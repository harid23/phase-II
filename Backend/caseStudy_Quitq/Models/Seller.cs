using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using CaseStudy_Quitq.Models;

namespace CaseStudy_Quitq.Models
{
    public class Seller
    {
        [Key]
        public int SellerId { get; set; }
        public string SellerName { get; set; }

      
        public string UserId { get; set; }
        [ForeignKey("UserId")]
        public User? User { get; set; }

        [RegularExpression(@"^[6-9]\d{9}$", ErrorMessage = "Invalid phone number format.")]
        public string? Contact { get; set; }

        public string CompanyName { get; set; }

        [MaxLength(100)]
        public string SellerAddress { get; set; }

        public string SellerCity { get; set; }
        public bool IsDeleted { get; set; } = false;
        public Wallet? Wallet { get; set; }

    }
}
