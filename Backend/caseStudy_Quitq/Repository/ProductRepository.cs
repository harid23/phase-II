using CaseStudy_Quitq.Contexts;
using CaseStudy_Quitq.Models;
using CaseStudy_Quitq.Repository.IRepository;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;

namespace CaseStudy_Quitq.Repository
{
    public class ProductRepository : IProductRepository
    {
        private readonly ApplicationDbContext _context;

        public ProductRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public string AddProduct(Product product)
        {
            try
            {
                _context.Products.Add(product);
                _context.SaveChanges();
                return "Product added successfully";
            }
            catch (Exception ex)
            {
                throw new Exception("Error adding product: " + ex.Message);
            }
        }

        public string DeleteProduct(int id)
        {
            try
            {
                var product = _context.Products.FirstOrDefault(p => p.ProductId == id);
                if (product == null)
                    return "Product not found";

                product.IsDeleted = true; 
                _context.Products.Update(product);
                _context.SaveChanges();
                return "Product soft-deleted successfully";
            }
            catch (Exception ex)
            {
                throw new Exception("Error deleting product: " + ex.Message);
            }
        }
        public List<Product> GetAllActiveProducts()
        {
            return _context.Products
                .Where(p => !p.IsDeleted)
                .ToList();
        }


        public List<Product> GetAllProducts()
        {
            return _context.Products
                   .Include(p => p.Category)
                   .ToList();
        }
        public Product GetProductById(int id)
        {
            return _context.Products
                .Include(p => p.Seller)
                .FirstOrDefault(p => p.ProductId == id);
        }
        public List<Product> GetProductByName(string name)
        {
            return _context.Products
                .Where(p => !string.IsNullOrEmpty(p.Name) && p.Name.ToLower().Contains(name.ToLower()))
                .ToList();
        }

        public List<Product> GetProductsByPrice(decimal price)
        {
            return _context.Products
                .Where(p => p.Price >= price)
                .ToList();
        }

        public List<Product> GetProductsByCategory(string category)
        {
            return _context.Products
                .Include(p => p.Category) 
                .Where(p => p.Category.Name.ToLower() == category.ToLower())
                .ToList();
        }


        public List<Product> GetProductsInStock(int threshold)
        {
            return _context.Products
                .Where(p => p.Stock <= threshold)
                .ToList();
        }

        public List<Product> GetProductsBySellerId(int sellerId)
        {
            return _context.Products
                .Where(p => p.SellerId == sellerId)
                .ToList();
        }

        public string UpdateProduct(int id, Product product)
        {
            try
            {
                var existing = _context.Products.FirstOrDefault(p => p.ProductId == id);
                if (existing == null)
                    return $"Product with ID {id} not found";

                existing.Name = product.Name;
                existing.Category = product.Category;
                existing.Description = product.Description;
                existing.Price = product.Price;
                existing.Stock = product.Stock;

                _context.SaveChanges();
                return $"Product with ID {id} updated successfully";
            }
            catch (Exception ex)
            {
                throw new Exception("Error updating product: " + ex.Message);
            }
        }

    }
}
