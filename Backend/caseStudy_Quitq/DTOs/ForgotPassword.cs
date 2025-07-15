using System.ComponentModel.DataAnnotations;

namespace CaseStudy_Quitq.DTOs
{
    public class ForgotPassword
    {
        [Required, EmailAddress]
        public string Email { get; set; }
    }
}
