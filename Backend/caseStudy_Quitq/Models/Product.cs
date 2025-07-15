using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace CaseStudy_Quitq.Models
{
    public class Product
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int ProductId { get; set; }

        [Required]
        [ForeignKey("SellerId")]
        public int SellerId { get; set; }

        public Seller? Seller { get; set; }   

        [Required]
        public string Name { get; set; }
        public string Description { get; set; }

        [Required]
        public decimal Price { get; set; }

        [Required]
        public int Stock { get; set; }
        public string? ImagePath { get; set; }

        [Required]
        [ForeignKey("Category")]
        public int CategoryId { get; set; } 
        public Category? Category { get; set; }
        public bool IsDeleted { get; set; } = false;
    }
}
