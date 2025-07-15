using CaseStudy_Quitq.Models;
using CaseStudy_Quitq.Repository;
using CaseStudy_Quitq.Repository.IRepository;
using CaseStudy_Quitq.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using CaseStudy_Quitq.DTOs;
using System.Linq;
using System.Security.Claims;

namespace CaseStudy_Quitq.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SellersController : ControllerBase
    {
        private readonly SellerService _sellerService;
        private readonly ISellerRepository _sellerRepository;

        public SellersController(SellerService sellerService, ISellerRepository sellerRepository)
        {
            _sellerService = sellerService;
            _sellerRepository = sellerRepository;
        }

        // ADMIN: Get all sellers
        [Authorize(Roles = "admin")]
        [HttpGet("get-all")]
        public ActionResult<List<Seller>> GetAllSellers()
        {
            var sellers = _sellerService.GetAllSellers();
            if (sellers == null)
                return NotFound("No sellers found.");
            return Ok(sellers);
        }

        // ADMIN: Get all active (not deleted) sellers
        [Authorize(Roles = "admin")]
        [HttpGet("active")]
        public IActionResult GetAllActiveSellers()
        {
            var sellers = _sellerRepository.GetAllActiveSellers();
            return sellers == null || !sellers.Any()
                ? NotFound("No active sellers found.")
                : Ok(sellers);
        }

        // PUBLIC: Get seller by ID
        [HttpGet("{id}")]
        public ActionResult<Seller> GetSellerById(int id)
        {
            var seller = _sellerService.GetSellerById(id);
            if (seller == null)
                return NotFound($"Seller with ID {id} not found.");
            return Ok(seller);
        }

        // PUBLIC: Get seller by name
        [HttpGet("by-name/{name}")]
        public ActionResult<List<Seller>> GetSellersByName(string name)
        {
            var sellers = _sellerService.GetSellersByName(name);
            if (sellers == null || sellers.Count == 0)
                return NotFound($"No sellers found with name {name}.");
            return Ok(sellers);
        }

        // ADMIN/SELLER: Add new seller (optional use)
        [Authorize(Roles = "admin, seller")]
        [HttpPost("add")]
        public ActionResult<string> AddSeller([FromBody] Seller seller)
        {
            var result = _sellerService.AddSeller(seller);
            return Ok(result);
        }

        // ADMIN/SELLER: Update any seller by ID
        [Authorize(Roles = "admin, seller")]
        [HttpPut("update/{id}")]
        public ActionResult<string> UpdateSeller(int id, [FromBody] Seller seller)
        {
            var result = _sellerService.UpdateSeller(id, seller);
            return Ok(result);
        }

        // ADMIN/SELLER: Soft delete a seller
        [Authorize(Roles = "admin, seller")]
        [HttpDelete("delete/{id}")]
        public ActionResult<string> DeleteSeller(int id)
        {
            var result = _sellerService.DeleteSeller(id);
            return Ok(result);
        }

        // SELLER ONLY: Get profile based on JWT token
        [Authorize(Roles = "seller")]
        [HttpGet("my-profile")]
        public IActionResult GetMyProfile()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var seller = _sellerRepository.GetSellerByUserId(userId);
            if (seller == null)
                return NotFound("Seller profile not found.");
            return Ok(seller);
        }
     

        // Inside SellersController class
        [Authorize(Roles = "seller")]
        [HttpPut("update-myprofile")]
        public IActionResult UpdateMyProfile([FromBody] SellerDTO updatedSeller)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var seller = _sellerRepository.GetSellerByUserId(userId);

            if (seller == null)
                return NotFound("Seller not found.");

            seller.SellerName = updatedSeller.SellerName;
            seller.SellerCity = updatedSeller.SellerCity;
            seller.Contact = updatedSeller.Contact;
            seller.CompanyName = updatedSeller.CompanyName;
            seller.SellerAddress = updatedSeller.SellerAddress;

            _sellerRepository.Save();
            return Ok("Seller profile updated successfully.");
        }


    }
}
