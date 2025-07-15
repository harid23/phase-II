using CaseStudy_Quitq.Models;
using System.Collections.Generic;

namespace CaseStudy_Quitq.Repository.IRepository
{
    public interface IReviewRepository
    {
        string AddReview(Review review);
        List<Review> GetReviewsByProductId(int productId);
        List<Review> GetReviewsByCustomerId(int customerId);
        bool HasCustomerReviewed(int productId, int customerId);
    }
}
