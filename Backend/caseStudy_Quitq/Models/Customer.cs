using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using CaseStudy_Quitq.Models;

namespace CaseStudy_Quitq.Models
{
    public class Customer
    {
        [Key]
        public int CustomerId { get; set; }

        [Required]
        public string CustomerName { get; set; }
        public string? UserId { get; set; } 
        public string? Username { get; set; } 

        [Required]
        [RegularExpression(@"^[6-9]\d{9}$", ErrorMessage = "Invalid phone number format.")]
        public string Phone { get; set; }

        [MaxLength(200)]
        public string Address { get; set; }

        public string CustomerCity { get; set; }

        public bool IsDeleted { get; set; } = false;

        public Wallet? Wallet { get; set; }
    }
}
