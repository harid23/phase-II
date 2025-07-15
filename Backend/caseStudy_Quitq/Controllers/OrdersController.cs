using CaseStudy_Quitq.Models;
using CaseStudy_Quitq.Repository;
using CaseStudy_Quitq.Repository.IRepository;
using CaseStudy_Quitq.Services;
using CaseStudy_Quitq.Contexts;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Security.Claims;
using CaseStudy_Quitq.DTOs;

namespace CaseStudy_Quitq.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrdersController : ControllerBase
    {
        private readonly OrderService _orderService;
        private readonly IOrderRepository _orderRepository;
        private readonly IProductRepository _productRepository;
        private readonly ApplicationDbContext _context;
        private readonly ICustomerRepository _customerRepository;
        public OrdersController(OrderService orderService,IOrderRepository orderRepository,ApplicationDbContext context,IProductRepository productRepository,ICustomerRepository customerRepository)
        {
            _orderService = orderService;
            _orderRepository = orderRepository;
            _productRepository = productRepository;
            _context = context;
            _customerRepository = customerRepository;
        }


        [HttpGet("get-order-by-id/{id}")]
        public IActionResult GetOrderById(int id)
        {
            var order = _orderService.GetOrderById(id);
            if (order != null)
                return Ok(order);
            return NotFound($"Order with ID {id} not found");
        }

        [HttpGet("get-orders-by-customer-id/{customerId}")]
        public IActionResult GetOrdersByCustomerId(int customerId)
        {
            try
            {
                var orders = _orderService.GetOrdersByCustomerId(customerId);
                if (orders == null || !orders.Any())
                    return NotFound(new { message = "No orders found for this customer." });

                return Ok(orders);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("get-orders-by-product-id/{productId}")]
        public IActionResult GetOrdersByProductId(int productId)
        {
            var orders = _orderService.GetOrdersByProductId(productId);
            return Ok(orders);
        }

        [Authorize(Roles = "admin,seller")]
        [HttpGet("get-orders-by-seller-id/{sellerId}")]
        public IActionResult GetOrdersBySellerId(int sellerId)
        {
            var orders = _orderService.GetOrdersBySellerId(sellerId);
            return Ok(orders);
        }

        [HttpPost("placeOrder")]
        [Authorize(Roles = "customer")]
        public IActionResult PlaceOrder([FromBody] Order order)
        {
            try
            {
                Console.WriteLine($"Order Received: CustomerId={order.CustomerId}, ProductId={order.ProductId}, Qty={order.Quantity}");
                var product = _productRepository.GetProductById(order.ProductId);
                if (product == null)
                    return NotFound(new { status = "Error", message = "Product not found." });

                Console.WriteLine($"Product stock: {product.Stock}, Order Qty: {order.Quantity}");

                if (product.Stock < order.Quantity)
                    return BadRequest(new { status = "Error", message = "Insufficient stock." });

                // Calculate total amount
                decimal totalAmount = product.Price * order.Quantity;

                // Reduce stock
                product.Stock -= order.Quantity;
                _productRepository.UpdateProduct(product.ProductId, product);

                // Prepare order
                order.SellerId = product.SellerId;
                order.OrderDate = DateTime.Now;
                order.TotalAmount = totalAmount;
                order.Status = OrderStatus.Placed;

                _context.Orders.Add(order);
                _context.SaveChanges();

                // Remove cart item if exists
                var cartItem = _context.CartItems
                    .FirstOrDefault(ci => ci.ProductId == order.ProductId && ci.Cart.CustomerId == order.CustomerId);

                if (cartItem != null)
                {
                    _context.CartItems.Remove(cartItem);
                    _context.SaveChanges();
                }

                return Ok(new { status = "Success", message = "Order placed successfully", orderId = order.OrderId });
            }
            catch (Exception ex)
            {
                return BadRequest(new { status = "Error", message = "Order failed: " + ex.Message });
            }
        }
        [HttpGet("my-orders")]
        [Authorize(Roles = "customer")]
        public IActionResult GetOrdersForLoggedInCustomer()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            //if (string.IsNullOrEmpty(userId))
            //    return Unauthorized("Invalid token");

            var customer = _customerRepository.GetCustomerByUserId(userId);

            if (customer == null)
                return NotFound("Customer profile not found.");

            var orders = _orderService.GetOrdersByCustomerId(customer.CustomerId);

            if (orders == null || !orders.Any())
                return NotFound("No orders found.");

            return Ok(orders);
        }


        [Authorize(Roles = "admin,seller")]
        [HttpPut("update-status/{orderId}")]
        public IActionResult UpdateOrderStatus(int orderId, [FromBody] string newStatus)
        {
            try
            {
                var result = _orderService.UpdateOrderStatus(orderId, newStatus);
                if (result == null)
                    return NotFound($"Order with ID {orderId} not found or update failed.");

                return Ok(new { Message = "Order status updated", UpdatedOrder = result });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
        [HttpGet("active")]
        public IActionResult GetAllActiveOrders()
        {
            var orders = _orderRepository.GetAllActiveOrders();
            return orders == null || !orders.Any()
                ? NotFound("No active orders found.")
                : Ok(orders);
        }

        [Authorize(Roles = "admin")]
        [HttpDelete("delete-order/{id}")]
        public IActionResult DeleteOrder(int id)
        {
            var result = _orderService.DeleteOrder(id);
            return Ok(result);
        }

        [Authorize(Roles = "admin")]
        [HttpGet("get-total-order-count")]
        public IActionResult GetOrderCount()
        {
            var count = _orderService.GetTotalOrderCount();
            return Ok(count);
        }

        [Authorize(Roles = "customer")]
        [HttpPost("checkout-cart/{cartItemId}")]
        public IActionResult CheckoutCart(int cartItemId, [FromQuery] string address, [FromQuery] int quantity)
        {
            try
            {
                var order = _orderRepository.CheckoutCart(cartItemId, address, quantity); 

                if (order == null)
                {
                    return NotFound(new { Error = "Order generation failed" });
                }

                return Ok(new
                {
                    orderId = order.OrderId,
                    message = "Order placed successfully",
                    status = "Success"
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new { Error = "Failed to checkout cart", Details = ex.Message });
            }
        }

        [Authorize(Roles = "customer")]
        [HttpPost("request-cancel/{orderId}")]
        public IActionResult RequestCancel(int orderId, [FromBody] CancelDTO dto)
        {
            if (dto == null || string.IsNullOrWhiteSpace(dto.Reason))
                return BadRequest("Reason is required.");

            try
            {
                var result = _orderRepository.RequestCancelOrder(orderId, dto.Reason);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Error: " + ex.Message);
            }
        }


        [Authorize(Roles = "admin,seller")]
        [HttpPost("process-cancel/{orderId}")]
        public IActionResult ProcessCancel(int orderId, [FromQuery] bool approve)
        {
            try
            {
                var result = _orderRepository.ProcessCancelOrder(orderId, approve);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Error: " + ex.Message);
            }
        }
        [HttpGet("admin-all-orders")]
        [Authorize(Roles = "admin")]
        public IActionResult GetAllOrdersForAdmin()
        {
            var orders = _context.Orders
                .Include(o => o.Product)
                .Include(o => o.Customer)
                .Include(o => o.Seller)
                .Where(o => !o.IsDeleted)
                .ToList();

            return Ok(orders);
        }

    }
}
