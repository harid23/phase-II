using CaseStudy_Quitq.Models;
using CaseStudy_Quitq.Repository.IRepository;
using CaseStudy_Quitq.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Security.Claims;

namespace CaseStudy_Quitq.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CustomersController : ControllerBase
    {
        private readonly CustomerService _customerService;
        private readonly ICustomerRepository _customerRepository;

        public CustomersController(CustomerService customerService, ICustomerRepository customerRepository)
        {
            _customerService = customerService;
            _customerRepository = customerRepository;
        }

        [HttpGet]
        [Authorize(Roles = "admin")]
        public ActionResult<List<Customer>> GetAllCustomers()
        {
            var customers = _customerService.GetAllCustomers();
            if (customers == null || customers.Count == 0)
                return NotFound("No customers found.");
            return Ok(customers);
        }

        [HttpGet("active")]
        [Authorize(Roles = "admin")]
        public IActionResult GetAllActiveCustomers()
        {
            var customers = _customerRepository.GetAllActiveCustomers();
            return customers == null || !customers.Any()
                ? NotFound("No active customers found.")
                : Ok(customers);
        }


        [HttpGet("{id}")]
        [Authorize(Roles = "admin,customer")]
        public ActionResult<Customer> GetCustomerById(int id)
        {
            var customer = _customerService.GetCustomerById(id);
            if (customer == null)
                return NotFound($"Customer with ID {id} not found.");
            return Ok(customer);
        }

        [HttpGet("name/{name}")]
        [Authorize(Roles = "admin,customer")]
        public ActionResult<List<Customer>> GetCustomerByName(string name)
        {
            var customers = _customerService.GetCustomerByName(name);
            if (customers == null || customers.Count == 0)
                return NotFound("No customers with this name found.");
            return Ok(customers);
        }

        //[HttpGet("email/{email}")]
        //[Authorize(Roles = "Admin")]
        //public ActionResult<List<Customer>> GetCustomerByEmail(string email)
        //{
        //    var customers = _customerService.GetCustomerByEmail(email);
        //    if (customers == null || customers.Count == 0)
        //        return NotFound("No customers with this email found.");
        //    return Ok(customers);
        //}

        [HttpPost]
        [Authorize(Roles = "customer")]
        public ActionResult<string> AddCustomer([FromBody] Customer customer)
        {
            try
            {

                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                var username = User.Identity?.Name;

                if (userId == null || username == null)
                    return Unauthorized("Invalid token");

                customer.UserId = userId;
                customer.Username = username;

                var result = _customerService.AddCustomer(customer);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error adding customer: {ex.Message}");
            }
        }


        [HttpPut("edit")]
        [Authorize(Roles = "customer")]
        public ActionResult<string> UpdateCustomer([FromBody] Customer customer)
        {
            try
            {
                var username = User.Identity?.Name;
                if (username == null)
                    return Unauthorized("Invalid token.");

                var existingCustomer = _customerService.GetCustomerByUsername(username);
                if (existingCustomer == null)
                    return NotFound("Customer not found.");

                if (existingCustomer.Username != username)
                    return Forbid("You can only update your own profile.");

                var response = _customerService.UpdateCustomer(username, customer); 
                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error updating customer: {ex.Message}");
            }
        }

        [HttpGet("me")]
        [Authorize(Roles = "customer")]
        public ActionResult<Customer> GetMyProfile()
        {
            try
            {
                var username = User.Identity?.Name;
                var customer = _customerService.GetCustomerByUsername(username);

                if (customer == null)
                    return NotFound("Profile not found.");

                return Ok(customer);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error fetching profile: {ex.Message}");
            }
        }

    }
}
