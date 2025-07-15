using CaseStudy_Quitq.Models;
using CaseStudy_Quitq.Repository;
using CaseStudy_Quitq.Repository.IRepository;
using CaseStudy_Quitq.Services;
using CaseStudy_Quitq.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;

namespace CaseStudy_Quitq.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly ProductService _productService;
        private readonly IProductRepository _productRepository;
        private readonly ISellerRepository _sellerRepository;
        public ProductsController(ProductService productService, IProductRepository productRepository,ISellerRepository sellerRepository)
        {
            _productService = productService;
            _productRepository= productRepository;
            _sellerRepository = sellerRepository;
        }

        [HttpGet("all")]
        public ActionResult<List<Product>> GetAllProducts()
        {
            var products = _productRepository.GetAllProducts();
            return products == null ? NotFound("No products found.") : Ok(products);
        }
        [HttpGet]
        public ActionResult<List<Product>> GetAllActiveProducts()
        {
            var products = _productRepository.GetAllActiveProducts();
            if (products == null || !products.Any())
                return NotFound(); 

            return products; 
        }

        [HttpGet("by-id/{id}")]
        public ActionResult<Product> GetProductById(int id)
        {
            var product = _productService.GetProductById(id);
            return product == null ? NotFound("Product not found.") : Ok(product);
        }

        [HttpGet("by-name/{name}")]
        public ActionResult<List<Product>> GetByName(string name)
        {
            var result = _productService.GetProductByName(name);
            return result == null ? NotFound("No matching products.") : Ok(result);
        }

        [HttpGet("by-category/{category}")]
        public ActionResult<List<Product>> GetByCategory(string category)
        {
            var result = _productService.GetProductsByCategory(category);
            return result == null ? NotFound("No products found in this category.") : Ok(result);
        }

        [HttpGet("by-price/{price}")]
        public ActionResult<List<Product>> GetByPrice(int price)
        {
            var result = _productService.GetProductsByPrice(price);
            return result == null ? NotFound("No products match this price.") : Ok(result);
        }

        [Authorize(Roles = "admin,seller")]
        [HttpGet("in-stock")]
        public ActionResult<List<Product>> GetInStock()
        {
            return Ok(_productService.GetProductsInStock());
        }

        [Authorize(Roles = "admin,seller")]
        [HttpGet("low-stock/{threshold}")]
        public ActionResult<List<Product>> GetLowStock(int threshold)
        {
            return Ok(_productService.GetLowStockProducts(threshold));
        }

        [Authorize(Roles = "admin,seller")]
        [HttpPost("add")]
        public IActionResult AddProduct([FromBody] ProductDTO dto)
        {
            var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
                return Unauthorized("User ID not found in token.");

            var seller = _sellerRepository.GetSellerByUserId(userId);
            if (seller == null)
                return NotFound("Seller profile not found.");

            var product = new Product
            {
                Name = dto.Name,
                Description = dto.Description,
                Price = dto.Price,
                Stock = dto.Stock,
                CategoryId = dto.CategoryId,
                SellerId = seller.SellerId
            };

            var result = _productService.AddProduct(product);
            return Ok(result);
        }

        [Authorize(Roles = "admin,seller")]
        [HttpPut("update/{id}")]
        public IActionResult UpdateProduct(int id, [FromBody] ProductDTO dto)
        {
            if (id != dto.ProductId)
                return BadRequest("Product ID mismatch.");

            var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            var userRole = User.FindFirst(System.Security.Claims.ClaimTypes.Role)?.Value;

            var existing = _productRepository.GetProductById(id);
            if (existing == null)
                return NotFound("Product not found.");

            if (userRole == "seller")
            {
                var seller = _sellerRepository.GetSellerByUserId(userId);
                if (seller == null || seller.SellerId != existing.SellerId)
                    return Forbid("You can only update your own products.");
            }

            existing.Name = dto.Name;
            existing.Description = dto.Description;
            existing.Price = dto.Price;
            existing.Stock = dto.Stock;
            existing.CategoryId = dto.CategoryId;

            var result = _productService.UpdateProduct(id, existing);
            return Ok(result);
        }




        [Authorize(Roles = "admin,seller")]
        [HttpDelete("delete/{id}")]
        public ActionResult<string> DeleteProduct(int id)
        {
            try
            {
                var userRole = User.FindFirst("http://schemas.microsoft.com/ws/2008/06/identity/claims/role")?.Value;
                var userId = User.FindFirst("http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier")?.Value;

                var existingProduct = _productRepository.GetProductById(id);
                if (existingProduct == null)
                    return NotFound("Product not found");

                if (userRole == "seller")
                {
                    var seller = _sellerRepository.GetSellerByUserId(userId);
                    if (seller == null || seller.SellerId != existingProduct.SellerId)
                        return Forbid("You can only delete your own products.");
                }

                var result = _productService.DeleteProduct(id);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Error: " + ex.Message);
            }
        }


        [Authorize(Roles = "admin,seller")]
        [HttpPost("{id}/upload-image")]
        [Consumes("multipart/form-data")]
        public IActionResult UploadProductImage(int id, IFormFile file)
        {
            try
            {
                var userRole = User.FindFirst("http://schemas.microsoft.com/ws/2008/06/identity/claims/role")?.Value;
                var userId = User.FindFirst("http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier")?.Value;

                var product = _productRepository.GetProductById(id);
                if (product == null || product.IsDeleted)
                    return NotFound("Product not found or deleted.");

                // Seller permission check
                if (userRole == "seller")
                {
                    var seller = _sellerRepository.GetSellerByUserId(userId);
                    if (seller == null || seller.SellerId != product.SellerId)
                        return Forbid("You are not allowed to upload image for this product.");
                }

                if (file == null || file.Length == 0)
                    return BadRequest("No file uploaded.");

                var allowedExtensions = new[] { ".jpg", ".jpeg", ".png" };
                var extension = Path.GetExtension(file.FileName).ToLower();

                if (!allowedExtensions.Contains(extension))
                    return BadRequest("Only .jpg, .jpeg, .png formats are allowed.");

                var fileName = $"{Guid.NewGuid()}{extension}";
                var path = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "Images", "Products");

                if (!Directory.Exists(path))
                    Directory.CreateDirectory(path);

                var fullPath = Path.Combine(path, fileName);

                using (var stream = new FileStream(fullPath, FileMode.Create))
                {
                    file.CopyTo(stream);
                }

                product.ImagePath = fileName;
                _productRepository.UpdateProduct(id, product); // Reuse existing update logic

                return Ok("Image uploaded and product updated.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error: {ex.Message}");
            }
        }


        [Authorize(Roles = "seller")]
        [HttpGet("my-products")]
        public IActionResult GetMyProducts()
        {
            var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
                return Unauthorized("User ID not found in token.");

            var seller = _sellerRepository.GetSellerByUserId(userId);
            if (seller == null)
                return NotFound("Seller profile not found.");

            var products = _productRepository.GetProductsBySellerId(seller.SellerId);
            return Ok(products);
        }

    }
}
