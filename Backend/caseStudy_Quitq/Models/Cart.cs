using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using CaseStudy_Quitq.Models;

namespace CaseStudy_Quitq.Models
{
    public class Cart
    {
        [Key]
        public int CartId { get; set; }

        [Required]
        [ForeignKey("CustomerId")]
        public int CustomerId { get; set; }

        public Customer? Customer { get; set; }

        public ICollection<CartItem> Items { get; set; } = new List<CartItem>();
    }
}
