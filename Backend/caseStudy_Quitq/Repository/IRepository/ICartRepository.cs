using CaseStudy_Quitq.Models;

namespace CaseStudy_Quitq.Repository.IRepository
{
    public interface ICartRepository
    {
        public Cart GetCartByCustomerId(int customerId);
        public string AddToCart(string username, int productId, int quantity);
        public string RemoveFromCart(int customerId, int productId);
        public string ClearCart(int customerId);

    }
}
