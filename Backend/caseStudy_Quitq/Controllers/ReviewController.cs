using CaseStudy_Quitq.Models;
using CaseStudy_Quitq.Repository.IRepository;
using Microsoft.AspNetCore.Mvc;
using CaseStudy_Quitq.DTOs;
using System;
using System.Collections.Generic;

namespace CaseStudy_Quitq.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReviewController : ControllerBase
    {
        private readonly IReviewRepository _reviewRepo;

        public ReviewController(IReviewRepository reviewRepo)
        {
            _reviewRepo = reviewRepo;
        }

        [HttpPost]
        public IActionResult AddReview([FromBody] ReviewDTO dto)
        {
            if (dto == null)
                return BadRequest("Review data is null");

            try
            {
                var review = new Review
                {
                    ProductId = dto.ProductId,
                    CustomerId = dto.CustomerId,
                    Rating = dto.Rating,
                    Comment = dto.Comment
                };

                var result = _reviewRepo.AddReview(review);
                if (result.Contains("already reviewed"))
                    return Conflict(result);

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Error adding review: " + ex.Message);
            }
        }


        [HttpGet("product/{productId}")]
        public IActionResult GetReviewsByProduct(int productId)
        {
            try
            {
                var reviews = _reviewRepo.GetReviewsByProductId(productId);
                return Ok(reviews ?? new List<Review>());
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Error retrieving reviews: " + ex.Message);
            }
        }

        [HttpGet("customer/{customerId}")]
        public IActionResult GetReviewsByCustomer(int customerId)
        {
            try
            {
                var reviews = _reviewRepo.GetReviewsByCustomerId(customerId);
                if (reviews == null || reviews.Count == 0)
                    return NotFound("No reviews found for this customer.");

                return Ok(reviews);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Error retrieving reviews: " + ex.Message);
            }
        }
    }
}
