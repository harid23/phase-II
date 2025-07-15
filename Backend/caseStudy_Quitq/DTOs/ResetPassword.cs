using System.ComponentModel.DataAnnotations;

namespace CaseStudy_Quitq.DTOs
{
    public class ResetPassword
    {
        [Required, EmailAddress]
        public string Email { get; set; }

        [Required]
        public string Token { get; set; }

        [Required]
        public string NewPassword { get; set; }
    }
}
