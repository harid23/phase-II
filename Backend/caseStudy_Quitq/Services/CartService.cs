using CaseStudy_Quitq.Models;
using CaseStudy_Quitq.Repository.IRepository;
using System;

namespace CaseStudy_Quitq.Services
{
    public class CartService
    {
        private readonly ICartRepository _cartRepository;

        public CartService(ICartRepository cartRepository)
        {
            _cartRepository = cartRepository;
        }

        public Cart GetCartByCustomerId(int customerId)
        {
            try
            {
                return _cartRepository.GetCartByCustomerId(customerId);
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
                return _cartRepository.AddToCart(username, productId, quantity);
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
                return _cartRepository.RemoveFromCart(customerId, productId);
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
                return _cartRepository.ClearCart(customerId);
            }
            catch (Exception ex)
            {
                throw new Exception("Exception in ClearCart: " + ex.Message);
            }
        }
    }
}
