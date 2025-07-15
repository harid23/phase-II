using CaseStudy_Quitq.Models;
using CaseStudy_Quitq.Contexts;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

public class Admin
{
    [Key]
    public int AdminId { get; set; }

    public string AdminName { get; set; }
    // public string Email { get; set; }

    [Required]
    [RegularExpression(@"^[6-9]\d{9}$", ErrorMessage = "Invalid phone number format.")]
    public string Contact { get; set; }
  
    public string UserId { get; set; }
    [ForeignKey("UserId")]
    public User? User { get; set; }
    public bool IsDeleted { get; set; } = false;

}
