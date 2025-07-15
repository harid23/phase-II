using CaseStudy_Quitq.Models;
using CaseStudy_Quitq.Repository.IRepository;
using CaseStudy_Quitq.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CaseStudy_Quitq.Controllers
{
    [Authorize(Roles = "admin")]
    [ApiController]
    [Route("api/[controller]")]
    public class AdminsController : ControllerBase
    {
        private readonly AdminService _adminService;
        private readonly IAdminRepository _adminRepository;
        public AdminsController(AdminService adminService, IAdminRepository adminRepository)
        {
            _adminService = adminService;
            _adminRepository = adminRepository;
        }

        [HttpPost("add")]
        public IActionResult AddAdmin([FromBody] Admin admin)
        {
            try
            {
                var result = _adminService.AddAdmin(admin);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest($"Error: {ex.Message}");
            }
        }

        [HttpPut("update/{id}")]
        public IActionResult UpdateAdmin(int id, [FromBody] Admin admin)
        {
            try
            {
                var result = _adminService.UpdateAdmin(id, admin);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest($"Error: {ex.Message}");
            }
        }

        [HttpDelete("delete/{id}")]
        public IActionResult DeleteAdmin(int id)
        {
            try
            {
                var result = _adminService.DeleteAdmin(id);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest($"Error: {ex.Message}");
            }
        }

        [HttpGet("get-all")]
        public IActionResult GetAllAdmins()
        {
            try
            {
                var result = _adminService.GetAllAdmins();
                if (result == null || result.Count == 0)
                    return NotFound("No admins found");
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest($"Error: {ex.Message}");
            }
        }
        [HttpGet("active")]
        public IActionResult GetAllActiveAdmins()
        {
            var admins = _adminRepository.GetAllActiveAdmins();
            return admins == null || !admins.Any()
                ? NotFound("No active admins found.")
                : Ok(admins);
        }

        [HttpGet("get-by-id/{id}")]
        public IActionResult GetAdminById(int id)
        {
            try
            {
                var result = _adminService.GetAdminById(id);
                if (result == null)
                    return NotFound($"Admin with ID {id} not found");
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest($"Error: {ex.Message}");
            }
        }

        [HttpGet("get-by-name/{name}")]
        public IActionResult GetAdminByName(string name)
        {
            try
            {
                var result = _adminService.GetAdminByName(name);
                if (result == null || result.Count == 0)
                    return NotFound("No admins found with the given name");
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest($"Error: {ex.Message}");
            }
        }

        [HttpGet("count/customers")]
        public IActionResult GetTotalCustomers()
        {
            try
            {
                int count = _adminService.GetTotalCustomers();
                return Ok(new { totalCustomers = count });
            }
            catch (Exception ex)
            {
                return BadRequest($"Error: {ex.Message}");
            }
        }

        [HttpGet("count/sellers")]
        public IActionResult GetTotalSellers()
        {
            try
            {
                int count = _adminService.GetTotalSellers();
                return Ok(new { totalSellers = count });
            }
            catch (Exception ex)
            {
                return BadRequest($"Error: {ex.Message}");
            }
        }

        [HttpGet("count/products")]
        public IActionResult GetTotalProducts()
        {
            try
            {
                int count = _adminService.GetTotalProducts();
                return Ok(new { totalProducts = count });
            }
            catch (Exception ex)
            {
                return BadRequest($"Error: {ex.Message}");
            }
        }

        [HttpGet("count/orders")]
        public IActionResult GetTotalOrders()
        {
            try
            {
                int count = _adminService.GetTotalOrders();
                return Ok(new { totalOrders = count });
            }
            catch (Exception ex)
            {
                return BadRequest($"Error: {ex.Message}");
            }
        }
    }
}
