using CaseStudy_Quitq.Models;

namespace CaseStudy_Quitq.Repository.IRepository
{
    public interface IOrderRepository
    {
        public string PlaceOrder(Order order);
        public List<Order> GetAllActiveOrders();
        public List<Order> GetAllOrders();
        public Order GetOrderById(int id);
        public List<Order> GetOrdersByCustomerId(int customerId);
        public List<Order> GetOrdersBySellerId(int sellerId);
        public List<Order> GetOrdersByProductId(int productId);
        public string DeleteOrder(int id);
        public int GetTotalOrderCount();
        //public string UpdateOrderStatus(int orderId, string newStatus);
        public Order UpdateOrderStatus(int orderId, OrderStatus newStatus);
        public Order CheckoutCart(int cartItemId, string shippingAddress, int quantity);
        string RequestCancelOrder(int orderId, string reason);
        string ProcessCancelOrder(int orderId, bool isApproved);
        public void SaveChanges();
    }
}
