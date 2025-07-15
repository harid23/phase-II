using CaseStudy_Quitq.Contexts;
using CaseStudy_Quitq.Models;
using Microsoft.EntityFrameworkCore;
using CaseStudy_Quitq.Repository.IRepository;

namespace CaseStudy_Quitq.Repository
{
    public class CartRepository : ICartRepository
    {
        private readonly ApplicationDbContext _context;

        public CartRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public Cart GetCartByCustomerId(int customerId)
        {
            try
            {
                var cart = _context.Carts
                    .Include(c => c.Items)
                    .ThenInclude(ci => ci.Product)
                    .FirstOrDefault(c => c.CustomerId == customerId);

                return cart ?? new Cart { CustomerId = customerId, Items = new List<CartItem>() };
            }
            catch (Exception ex)
            {
                throw new Exception("Exception in GetCartByCustomerId: " + ex.Message);
            }
        }

        public string AddToCart(string username, int productId, int quantity)
        {
            try
            {
                var customer = _context.Customers .FirstOrDefault(c => c.Username.ToLower() == username.ToLower());
                if (customer == null)
                    throw new Exception("Customer not found for the provided username.");
                var cart = _context.Carts.Include(c => c.Items)
                                         .FirstOrDefault(c => c.CustomerId == customer.CustomerId);

                if (cart == null)
                {
                    cart = new Cart { CustomerId = customer.CustomerId };
                    _context.Carts.Add(cart);
                    _context.SaveChanges();
                }
                var existingItem = cart.Items.FirstOrDefault(i => i.ProductId == productId);
                if (existingItem != null)
                {
                    existingItem.Quantity += quantity;
                }
                else
                {
                    cart.Items.Add(new CartItem
                    {
                        CartId = cart.CartId,
                        ProductId = productId,
                        Quantity = quantity
                    });
                }
                _context.SaveChanges();
                return "Product added to cart successfully.";
            }
            catch (Exception ex)
            {
                throw new Exception("Exception in AddToCart: " + ex.Message);
            }
        }


        public string RemoveFromCart(int customerId, int productId)
        {
            try
            {
                var cart = _context.Carts.Include(c => c.Items)
                                         .FirstOrDefault(c => c.CustomerId == customerId);
                if (cart == null)
                    return "Cart not found.";

                var item = cart.Items.FirstOrDefault(i => i.ProductId == productId);
                if (item != null)
                {
                    _context.CartItems.Remove(item);
                    _context.SaveChanges();
                    return "Item removed from cart.";
                }

                return "Item not found in cart.";
            }
            catch (Exception ex)
            {
                throw new Exception("Exception in RemoveFromCart: " + ex.Message);
            }
        }

        public string ClearCart(int customerId)
        {
            try
            {
                var cart = _context.Carts.Include(c => c.Items)
                                         .FirstOrDefault(c => c.CustomerId == customerId);

                if (cart != null && cart.Items.Any())
                {
                    _context.CartItems.RemoveRange(cart.Items);
                    _context.SaveChanges();
                    return "Cart cleared successfully.";
                }

                return "Cart already empty.";
            }
            catch (Exception ex)
            {
                throw new Exception("Exception in ClearCart: " + ex.Message);
            }
        }


    }
}
