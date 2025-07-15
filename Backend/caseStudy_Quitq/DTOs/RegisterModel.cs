using System.ComponentModel.DataAnnotations;

namespace CaseStudy_Quitq.DTOs
{
    public class RegisterModel
    {
        [Required(ErrorMessage = "Username should not be empty")]
        public string Username { get; set; }

        [Required(ErrorMessage = "Email should not be empty")]
        public string Email { get; set; }

        [Required(ErrorMessage = "Password should not be empty ")]
        public string Password { get; set; }

        [Required]
        [Compare("Password", ErrorMessage = "Password and Confirm Password do not match")]
        public string ConfirmPassword { get; set; }


        [Required(ErrorMessage = "Role should not be empty")]
        public string Role { get; set; }
    }
}
