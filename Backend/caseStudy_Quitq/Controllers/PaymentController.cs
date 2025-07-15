using CaseStudy_Quitq.Models;
using CaseStudy_Quitq.Repository.IRepository;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;

namespace CaseStudy_Quitq.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PaymentsController : ControllerBase
    {
        private readonly IPaymentRepository _paymentRepository;

        public PaymentsController(IPaymentRepository paymentRepository)
        {
            _paymentRepository = paymentRepository;
        }

        [HttpPost("make")]
        [Authorize(Roles = "customer")]
        public IActionResult MakePayment([FromBody] Payment payment)
        {
            try
            {
                if (payment == null)
                    return BadRequest(new { Error = "Invalid payment data." });

                var result = _paymentRepository.MakePayment(payment);

                if (result.Contains("Insufficient") || result.Contains("not found"))
                {
                    return BadRequest(new { Message = result }); 
                }

                return Ok(new { Message = result });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Error = "An error occurred while processing payment.", Details = ex.Message });
            }
        }

        [HttpGet("{id}")]
        [Authorize(Roles = "admin,customer")]
        public IActionResult GetPaymentById(int id)
        {
            try
            {
                var payment = _paymentRepository.GetPaymentById(id);
                if (payment == null)
                    return NotFound(new { Error = $"Payment with ID {id} not found." });

                return Ok(payment);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Error = "Error fetching payment details.", Details = ex.Message });
            }
        }

        [HttpGet("all")]
        [Authorize(Roles = "admin")]
        public IActionResult GetAllPayments()
        {
            try
            {
                var payments = _paymentRepository.GetAllPayments();
                return Ok(payments);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Error = "Error fetching all payments.", Details = ex.Message });
            }
        }

        [HttpGet("by-customer/{customerId}")]
        [Authorize(Roles = "customer")]
        public IActionResult GetPaymentsByCustomerId(int customerId)
        {
            try
            {
                var payments = _paymentRepository.GetPaymentsByCustomerId(customerId);
                return Ok(payments);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Error = "Error fetching customer's payments.", Details = ex.Message });
            }
        }

        [HttpGet("by-order/{orderId}")]
        [Authorize(Roles = "admin,seller")]
        public IActionResult GetPaymentsByOrderId(int orderId)
        {
            try
            {
                var payments = _paymentRepository.GetPaymentsByOrderId(orderId);
                return Ok(payments);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Error = "Error fetching order payments.", Details = ex.Message });
            }
        }
    }
}
