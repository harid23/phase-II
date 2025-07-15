using System.Security.Claims;
using Azure.Core;
using CaseStudy_Quitq.Contexts;
using CaseStudy_Quitq.Migrations;
using CaseStudy_Quitq.Models;
using CaseStudy_Quitq.DTOs;
using CaseStudy_Quitq.Repository.IRepository;
using CaseStudy_Quitq.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CaseStudy_Quitq.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CartsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly CartService _cartService;
        private readonly IOrderRepository _orderRepository;
        private readonly ICartRepository _cartRepository;

        public CartsController(ApplicationDbContext context,CartService cartService, IOrderRepository orderRepository, ICartRepository cartRepository)
        {
            _context = context;
            _cartService = cartService;
            _orderRepository = orderRepository;
            _cartRepository = cartRepository;
        }

        [HttpGet("{customerId}")]
        [Authorize(Roles = "customer")]
        public IActionResult GetCart(int customerId)
        {
            try
            {
                var cart = _cartService.GetCartByCustomerId(customerId);
                if (cart == null)
                    return NotFound(new { Status = "Error", Message = "Cart not found." });

                return Ok(cart);
            }
            catch (Exception ex)
            {
                return BadRequest(new { Status = "Error", Message = ex.InnerException?.Message ?? ex.Message });
            }
        }

        [HttpPost("add")]
        [Authorize(Roles = "customer")]
        public IActionResult AddToCart([FromBody] CartDTO request)
        {
            try
            {
                var username = User.Identity?.Name;
                if (string.IsNullOrEmpty(username))
                    return Unauthorized("Username not found in token.");

                var result = _cartRepository.AddToCart(username, request.ProductId, request.Quantity);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    Status = "Error",
                    Message = ex.InnerException?.Message ?? ex.Message
                });
            }
        }

        [HttpPost("checkout/item")]
        [Authorize(Roles = "customer")]
        public IActionResult CheckoutCart([FromQuery] int cartItemId, [FromQuery] string shippingAddress,int quantity)
        {
            try
            {
                var order = _orderRepository.CheckoutCart(cartItemId, shippingAddress, quantity);
                return Ok(new
                {
                    Status = "Success",
                    Message = "Order placed from cart item.",
                    Order = order
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new { Status = "Error", Message = ex.InnerException?.Message ?? ex.Message });
            }
        }


       [HttpDelete("remove/{cartItemId}")]
[Authorize(Roles = "customer")]
public IActionResult RemoveItem(int cartItemId)
{
    try
    {
        var item = _context.CartItems.FirstOrDefault(i => i.CartItemId == cartItemId);
        if (item == null)
            return NotFound("Item not found.");

        _context.CartItems.Remove(item);
        _context.SaveChanges();
        return Ok("Item removed from cart.");
    }
    catch (Exception ex)
    {
        return BadRequest($"Error removing item: {ex.Message}");
    }
}


        [HttpDelete("clear/{customerId}")]
        [Authorize(Roles = "customer")]
        public IActionResult ClearCart(int customerId)
        {
            try
            {
                var result = _cartService.ClearCart(customerId);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { Status = "Error", Message = ex.InnerException?.Message ?? ex.Message });
            }
        }
        [HttpGet("me")]
        [Authorize(Roles = "customer")]
        public IActionResult GetMyCart()
        {
            try
            {
                var username = User.Identity?.Name;
                if (string.IsNullOrEmpty(username))
                    return Unauthorized("Username not found in token.");

                var customer = _context.Customers.FirstOrDefault(c => c.Username == username);
                if (customer == null)
                    return NotFound("Customer profile not found for this user.");

                var cart = _context.Carts
                    .Include(c => c.Items)
                    .ThenInclude(i => i.Product)
                    .FirstOrDefault(c => c.CustomerId == customer.CustomerId);

                if (cart == null || cart.Items.Count == 0)
                    return Ok(new List<CartItem>());

                return Ok(cart.Items);
            }
            catch (Exception ex)
            {
                return BadRequest($"Error retrieving cart: {ex.Message}");
            }
        }

    }
}
