using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.AspNetCore.Identity;

namespace CaseStudy_Quitq.Models
{
    public class User : IdentityUser
    {
        //[Key]
        //public int UserId { get; set; }

        //[Required]
        //[MaxLength(100)]
        //public string Username { get; set; }

        //[Required]
        //[MaxLength(100)]
        //public string Email { get; set; }

        //[Required]
        //public string Password { get; set; }  

        [Required]
        public Role Role { get; set; }  
    }

    public enum Role
    {
        admin,
        seller,
        customer
    }
}
