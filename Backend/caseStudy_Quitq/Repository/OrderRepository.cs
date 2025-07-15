using CaseStudy_Quitq.Contexts;
using CaseStudy_Quitq.Models;
using CaseStudy_Quitq.Repository.IRepository;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;

namespace CaseStudy_Quitq.Repository
{
    public class OrderRepository : IOrderRepository
    {
        private readonly ApplicationDbContext _context;
        private readonly IProductRepository _productRepo;
        private readonly ICartRepository _cartRepo;
        private readonly IWalletRepository _walletRepo;
        public OrderRepository(ApplicationDbContext context, IProductRepository productRepo, ICartRepository cartRepo, IWalletRepository walletRepo)
        {
            _context = context;
            _productRepo = productRepo;
            _cartRepo = cartRepo;
            _walletRepo = walletRepo;
        }

        public string PlaceOrder(Order order)
        {
            try
            {
                var product = _productRepo.GetProductById(order.ProductId);
                if (product == null)
                    throw new Exception("Product not found.");

                if (product.Stock < order.Quantity)
                    throw new Exception("Insufficient stock.");

                decimal totalAmount = product.Price * order.Quantity;

                product.Stock -= order.Quantity;
                _productRepo.UpdateProduct(product.ProductId, product);

                order.SellerId = product.SellerId;
                order.OrderDate = DateTime.Now;
                order.TotalAmount = totalAmount;
                order.Status = OrderStatus.Placed;

                _context.Orders.Add(order);
                _context.SaveChanges();

                var cartItem = _context.CartItems
                    .FirstOrDefault(ci => ci.ProductId == order.ProductId && ci.Cart.CustomerId == order.CustomerId);
                if (cartItem != null)
                {
                    _context.CartItems.Remove(cartItem);
                    _context.SaveChanges();
                }
                return order.OrderId.ToString();
            }
            catch (Exception ex)
            {
                throw new Exception("Error in PlaceOrder: " + ex.Message);
            }
        }


        public List<Order> GetAllActiveOrders()
        {
            return _context.Orders
                .Where(o => !o.IsDeleted)
                .ToList();
        }


        public List<Order> GetAllOrders()
        {
            try
            {
                var orders = _context.Orders
                 .Where(o => !o.IsDeleted && o.PaymentStatus == "Paid")
                 .Include(o => o.Customer)
                 .Include(o => o.Product)
                 .Include(o => o.Seller)
                 .ToList(); 
                if (orders.Count > 0)
                    return orders;
                else
                    return new List<Order>();
            }
            catch (Exception ex)
            {
                throw new Exception("Error in GetAllOrders: " + ex.Message);
            }
        }

        public Order GetOrderById(int id)
        {
            try
            {
                var order = _context.Orders.FirstOrDefault(o => o.OrderId == id);
                return order ?? null;
            }
            catch (Exception ex)
            {
                throw new Exception("Error in GetOrderById: " + ex.Message);
            }
        }

        public List<Order> GetOrdersByCustomerId(int customerId)
        {
            try
            {
                var orders = _context.Orders.Include(o => o.Product) .Where(o => o.CustomerId == customerId).ToList();
                return orders;
            }
            catch (Exception ex)
            {
                throw new Exception("Error in GetOrdersByCustomerId: " + ex.Message);
            }
        }

        public List<Order> GetOrdersBySellerId(int sellerId)
        {
            try
            {
                var orders = _context.Orders
                    .Include(o => o.Product)
                    .Include(o => o.Customer)
                    .Where(o => o.SellerId == sellerId && o.PaymentStatus == "Paid" && !o.IsDeleted)
                    .ToList();

                return orders;
            }
            catch (Exception ex)
            {
                throw new Exception("Error in GetOrdersBySellerId: " + ex.Message);
            }
        }


        public List<Order> GetOrdersByProductId(int productid)
        {
            try
            {
                var orders = _context.Orders.Where(o => o.ProductId == productid).ToList();
                return orders;
            }
            catch (Exception ex)
            {
                throw new Exception("Error in GetOrdersBySellerId: " + ex.Message);
            }
        }

        public string DeleteOrder(int id)
        {
            try
            {
                var order = _context.Orders.FirstOrDefault(o => o.OrderId == id);
                if (order == null)
                    return $"Order with ID {id} not found.";

                if (order.IsDeleted)
                    return $"Order with ID {id} is already deleted.";

                order.IsDeleted = true;
                _context.Orders.Update(order);
                _context.SaveChanges();
                return $"Order with ID {id} soft-deleted successfully.";
            }
            catch (Exception ex)
            {
                throw new Exception("Error soft-deleting order: " + ex.Message);
            }
        }

        public int GetTotalOrderCount()
        {
            try
            {
                return _context.Orders.Count();
            }
            catch (Exception ex)
            {
                throw new Exception("Error in GetTotalOrderCount: " + ex.Message);
            }
        }
        public Order UpdateOrderStatus(int orderId, OrderStatus newStatus)
        {
            var order = _context.Orders.FirstOrDefault(o => o.OrderId == orderId);
            if (order == null)
                return null;

            order.Status = newStatus;
            _context.SaveChanges();
            return order;
        }
        public Order CheckoutCart(int cartItemId, string shippingAddress, int quantity)
        {
            try
            {
                var cartItem = _context.CartItems
                    .Include(ci => ci.Product)
                    .Include(ci => ci.Cart)
                    .FirstOrDefault(ci => ci.CartItemId == cartItemId);

                if (cartItem == null || cartItem.Product == null)
                    throw new Exception("Cart item or associated product not found.");

                if (quantity > 0 && cartItem.Quantity != quantity)
                {
                    cartItem.Quantity = quantity;
                    _context.CartItems.Update(cartItem);
                }

                var product = cartItem.Product;
                var customerId = cartItem.Cart.CustomerId;

                if (product.Stock < cartItem.Quantity)
                    throw new Exception("Insufficient stock for product: " + product.Name);

                product.Stock -= cartItem.Quantity;
                _context.Products.Update(product);

                var order = new Order
                {
                    ProductId = product.ProductId,
                    CustomerId = customerId,
                    SellerId = product.SellerId,
                    Quantity = cartItem.Quantity,
                    OrderDate = DateTime.Now,
                    TotalAmount = product.Price * cartItem.Quantity,
                    Status = OrderStatus.Placed,
                    PaymentStatus = "Pending",
                    ShippingAddress = shippingAddress
                };

                _context.Orders.Add(order);
                _context.CartItems.Remove(cartItem);

                _context.SaveChanges();

                return order;
            }
            catch (Exception ex)
            {
                throw new Exception("Error placing order from cart item: " + ex.Message);
            }
        }

        public string RequestCancelOrder(int orderId, string reason)
        {
          try 
          { 
            var order = _context.Orders.FirstOrDefault(o => o.OrderId == orderId && !o.IsDeleted);
            if (order == null)
                return "Order not found.";

            if (order.Status == OrderStatus.Cancelled || order.Status == OrderStatus.CancellationRequested)
                return "Order is already cancelled or cancellation requested.";

            if (order.Status == OrderStatus.Delivered && string.IsNullOrWhiteSpace(reason))
                return "Please provide a reason for cancelling a delivered order.";

            // No reason required for non-delivered orders
            if (order.Status != OrderStatus.Delivered)
                reason = "Customer requested cancellation.";

            order.Status = OrderStatus.CancellationRequested;
            order.CancelReason = reason;
            _context.Orders.Update(order);
            _context.SaveChanges();

            return "Cancellation request submitted.";
          }catch(Exception ex){
             throw new Exception("Error in cancelling order request: " + ex.Message);
          }
        }


        public string ProcessCancelOrder(int orderId, bool isApproved)
        {
            try
            {
                var order = _context.Orders.FirstOrDefault(o => o.OrderId == orderId && !o.IsDeleted);
                if (order == null)
                    return "Order not found.";

                if (order.Status != OrderStatus.CancellationRequested)
                    return "No cancellation request to process.";

                if (isApproved)
                {
                    order.Status = OrderStatus.Cancelled;

                    var product = _context.Products.FirstOrDefault(p => p.ProductId == order.ProductId);
                    if (product != null)
                    {
                        product.Stock += order.Quantity;
                        _context.Products.Update(product);
                    }
                    var customerWallet = _context.Wallets.FirstOrDefault(w => w.CustomerId == order.CustomerId);
                    if (customerWallet != null)
                    {
                        customerWallet.Balance += order.TotalAmount;
                        _context.Wallets.Update(customerWallet);
                    }
                }
                else
                {
                    order.Status = OrderStatus.InProgress;
                }

                _context.Orders.Update(order);
                _context.SaveChanges();

                return isApproved ? "Order cancelled, stock and refund updated." : "Cancellation rejected.";
            }
            catch (Exception ex)
            {
                throw new Exception("Error in cancelling order process: " + ex.Message);
            }
        }


        public void SaveChanges()
        {
            _context.SaveChanges();
        }
    }
}
