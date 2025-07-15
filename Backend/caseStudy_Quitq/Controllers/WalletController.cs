using CaseStudy_Quitq.Models;
using CaseStudy_Quitq.Repository.IRepository;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;

namespace CaseStudy_Quitq.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class WalletController : ControllerBase
    {
        private readonly IWalletRepository _walletRepository;

        public WalletController(IWalletRepository walletRepository)
        {
            _walletRepository = walletRepository;
        }

        // ----------------- customer wallet -----------------

        [HttpGet("customer/{customerId}")]
        [Authorize(Roles = "customer,admin")]
        public IActionResult GetWalletByCustomer(int customerId)
        {
            try
            {
                var wallet = _walletRepository.GetWalletByCustomerId(customerId);
                if (wallet == null)
                    return NotFound(new { Error = $"Wallet not found for customer ID {customerId}" });

                return Ok(wallet);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Error = "Error retrieving customer wallet", Details = ex.Message });
            }
        }

        [HttpPost("customer/create")]
        [Authorize(Roles = "admin")]
        public IActionResult CreateWalletForCustomer([FromBody] Wallet wallet)
        {
            try
            {
                if (wallet == null || wallet.CustomerId == 0)
                    return BadRequest(new { Error = "Invalid customer wallet data." });

                var result = _walletRepository.CreateWallet(wallet);
                return Ok(new { Message = result });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Error = "Error creating customer wallet", Details = ex.Message });
            }
        }

        // ----------------- seller wallet -----------------

        [HttpGet("seller/{sellerId}")]
        [Authorize(Roles = "seller,admin")]
        public IActionResult GetWalletBySeller(int sellerId)
        {
            try
            {
                var wallet = _walletRepository.GetWalletBySellerId(sellerId);
                if (wallet == null)
                    return NotFound(new { Error = $"Wallet not found for seller ID {sellerId}" });

                return Ok(wallet);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Error = "Error retrieving seller wallet", Details = ex.Message });
            }
        }

        [HttpPost("seller/create")]
        [Authorize(Roles = "admin")]
        public IActionResult CreateWalletForSeller([FromBody] Wallet wallet)
        {
            try
            {
                if (wallet == null || wallet.SellerId == 0)
                    return BadRequest(new { Error = "Invalid seller wallet data." });

                var result = _walletRepository.CreateWallet(wallet);
                return Ok(new { Message = result });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Error = "Error creating seller wallet", Details = ex.Message });
            }
        }
    }
}
