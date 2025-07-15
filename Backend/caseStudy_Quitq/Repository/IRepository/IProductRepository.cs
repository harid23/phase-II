using CaseStudy_Quitq.Models;

namespace CaseStudy_Quitq.Repository.IRepository
{
    public interface IProductRepository
    {
        public List<Product> GetAllProducts();
        public List<Product> GetAllActiveProducts();
        public Product GetProductById(int id);
        public List<Product> GetProductByName(string name);
        public List<Product> GetProductsByPrice(decimal price);
        public List<Product> GetProductsByCategory(string category);
        public string AddProduct(Product product);
        public string UpdateProduct(int id, Product product);
        public string DeleteProduct(int id);
        public List<Product> GetProductsInStock(int thresold);
        public List<Product> GetProductsBySellerId(int sellerId);
    }

}
