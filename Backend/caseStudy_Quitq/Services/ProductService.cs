// ProductService.cs
using CaseStudy_Quitq.Contexts;
using CaseStudy_Quitq.Models;
using CaseStudy_Quitq.Repository.IRepository;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;

namespace CaseStudy_Quitq.Services
{
    public class ProductService
    {
        private readonly IProductRepository _productRepository;
        private readonly ApplicationDbContext _context;
        public ProductService(IProductRepository productRepository, ApplicationDbContext context)
        {
            _productRepository = productRepository;
            _context = context;
        }

        public List<Product> GetAllProducts()
        {
            try
            {
                var products = _productRepository.GetAllProducts();
                if (products.Count > 0)
                    return products;
                else
                    return null;
            }
            catch (Exception ex)
            {
                throw new Exception("Exception While GetAllProducts: " + ex.Message);
            }
        }

        public Product GetProductById(int id)
        {
            try
            {
                var product = _productRepository.GetProductById(id);
                return product;
            }
            catch (Exception ex)
            {
                throw new Exception("Exception in GetProductById: " + ex.Message);
            }
        }

        public List<Product> GetProductByName(string name)
        {
            try
            {
                return _productRepository.GetProductByName(name);
            }
            catch (Exception ex)
            {
                throw new Exception("Exception in GetProductByName: " + ex.Message);
            }
        }

        public List<Product> GetProductsByCategory(string category)
        {
            try
            {
                return _productRepository.GetProductsByCategory(category);
            }
            catch (Exception ex)
            {
                throw new Exception("Exception in GetProductsByCategory: " + ex.Message);
            }
        }

        public List<Product> GetProductsByPrice(int price)
        {
            try
            {
                return _productRepository.GetProductsByPrice(price);
            }
            catch (Exception ex)
            {
                throw new Exception("Exception in GetProductsByPrice: " + ex.Message);
            }
        }

        public string AddProduct(Product product)
        {
            try
            {
                if (product.SellerId == 0)
                    throw new Exception("SellerId is required to add a product.");

                _context.Products.Add(product);
                _context.SaveChanges();
                return "Product added successfully";
            }
            catch (Exception ex)
            {
                throw new Exception("Error adding product: " + ex.Message);
            }
        }


        public string UpdateProduct(int id, Product product)
        {
            try
            {
                var existing = _productRepository.GetProductById(id);
                if (existing == null)
                    return $"Product with the Id {id} not found";

                existing.Name = product.Name;
                existing.Category = product.Category;
                existing.Description = product.Description;
                existing.Price = product.Price;
                existing.Stock = product.Stock;

                return _productRepository.UpdateProduct(id,existing);
            }
            catch (Exception ex)
            {
                throw new Exception("Exception in UpdateProduct: " + ex.Message);
            }
        }

        public string DeleteProduct(int id)
        {
            try
            {
                return _productRepository.DeleteProduct(id);
            }
            catch (Exception ex)
            {
                throw new Exception("Exception in DeleteProduct: " + ex.Message);
            }
        }

        public List<Product> GetProductsBySellerId(int sellerId)
        {
            try
            {
                return _productRepository.GetProductsBySellerId(sellerId);
            }
            catch (Exception ex)
            {
                throw new Exception("Exception in GetProductsBySellerId: " + ex.Message);
            }
        }

        public List<Product> GetProductsInStock()
        {
            try
            {
                return _productRepository.GetAllProducts().Where(p => p.Stock > 0).ToList();
            }
            catch (Exception ex)
            {
                throw new Exception("Exception in GetProductsInStock: " + ex.Message);
            }
        }

        public List<Product> GetLowStockProducts(int threshold)
        {
            try
            {
                return _productRepository.GetAllProducts()
                    .Where(p => p.Stock <= threshold )
                    .ToList();
            }
            catch (Exception ex)
            {
                throw new Exception("Exception in GetLowStockProducts: " + ex.Message);
            }
        }
    }
}
