using System.ComponentModel.DataAnnotations;

namespace CaseStudy_Quitq.Models
{
    public class Category
    {
        [Key]
        public int CategoryId { get; set; }

        [Required]
        [StringLength(100)]
        public string Name { get; set; }
        public bool IsDeleted { get; set; } = false;
    }
}
