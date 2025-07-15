using CaseStudy_Quitq.Contexts;
using CaseStudy_Quitq.Models;
using CaseStudy_Quitq.Repository.IRepository;
using System;
using System.Collections.Generic;
using System.Linq;

namespace CaseStudy_Quitq.Repository
{
    public class ReviewRepository : IReviewRepository
    {
        private readonly ApplicationDbContext _context;

        public ReviewRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public string AddReview(Review review)
        {
            try
            {
                if (HasCustomerReviewed(review.ProductId, review.CustomerId))
                    return "Customer has already reviewed this product.";

                _context.Reviews.Add(review);
                _context.SaveChanges();
                return "Review added successfully.";
            }
            catch (Exception ex)
            {
                throw new Exception("Error adding review: " + ex.Message);
            }
        }

        public List<Review> GetReviewsByProductId(int productId)
        {
            try
            {
                return _context.Reviews
                    .Where(r => r.ProductId == productId)
                    .ToList();
            }
            catch (Exception ex)
            {
                throw new Exception("Error fetching reviews: " + ex.Message);
            }
        }

        public List<Review> GetReviewsByCustomerId(int customerId)
        {
            try
            {
                return _context.Reviews
                    .Where(r => r.CustomerId == customerId)
                    .ToList();
            }
            catch (Exception ex)
            {
                throw new Exception("Error fetching customer reviews: " + ex.Message);
            }
        }

        public bool HasCustomerReviewed(int productId, int customerId)
        {
            return _context.Reviews.Any(r => r.ProductId == productId && r.CustomerId == customerId);
        }
    }
}
