using System.ComponentModel.DataAnnotations;

namespace CaseStudy_Quitq.DTOs
{
    public class LoginModel
    {
        [Required(ErrorMessage = "Username should not be empty")]
        public string UserName { get; set; }

        [Required(ErrorMessage = "Password should not be empty")]
        public string Password { get; set; }
    }
}
