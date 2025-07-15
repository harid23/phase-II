using CaseStudy_Quitq.Contexts;
using CaseStudy_Quitq.DTOs;
using CaseStudy_Quitq.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace CaseStudy_Quitq.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthenticationController : ControllerBase
    {
        private readonly UserManager<User> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly IConfiguration _configuration;
        private readonly ApplicationDbContext _context;
        public AuthenticationController(UserManager<User> userManager, RoleManager<IdentityRole> roleManager, IConfiguration configuration, ApplicationDbContext context)
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _configuration = configuration;
            _context = context;
        }
        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterModel registerModel)
        {
            var userExist = await _userManager.FindByNameAsync(registerModel.Username);
            if (userExist != null)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new Response
                {
                    Status = "Error",
                    StatusMessage = "User already Exist!"
                });
            }

            if (!Enum.TryParse(registerModel.Role, true, out Role parsedRole))
            {
                return BadRequest(new { Status = "Error", Message = "Invalid role provided" });
            }

            User user = new User
            {
                UserName = registerModel.Username,
                Email = registerModel.Email,
                Role = parsedRole
            };

            var result = await _userManager.CreateAsync(user, registerModel.Password);
            if (!result.Succeeded)
            {
                return BadRequest(new
                {
                    Status = "Error",
                    StatusMessage = "User Creation Failed",
                    Errors = result.Errors
                });
            }

            string[] roles = new[] { "admin", "customer", "seller" };
            foreach (var role in roles)
            {
                if (!await _roleManager.RoleExistsAsync(role))
                    await _roleManager.CreateAsync(new IdentityRole(role));
            }

            await _userManager.AddToRoleAsync(user, registerModel.Role.ToLower());

            // Auto-create profile and wallet
            try
            {
                if (registerModel.Role.ToLower() == "customer")
                {
                    var customer = new Customer
                    {
                        CustomerName = user.UserName,
                        Phone = "",
                        Address = "Default Address",
                        CustomerCity = "Default City",
                        UserId = user.Id,
                        Username = user.UserName
                    };
                    _context.Customers.Add(customer);
                    await _context.SaveChangesAsync();

                    _context.Wallets.Add(new Wallet
                    {
                        CustomerId = customer.CustomerId,
                        Balance = 0
                    });
                    await _context.SaveChangesAsync();
                }
                else if (registerModel.Role.ToLower() == "seller")
                {
                    var seller = new Seller
                    {
                        SellerName = user.UserName,
                        UserId = user.Id,
                        SellerAddress = "Default Seller Address",
                        SellerCity = "Default City",
                        Contact = "",
                        CompanyName = ""
                    };
                    _context.Sellers.Add(seller);
                    await _context.SaveChangesAsync();

                    _context.Wallets.Add(new Wallet
                    {
                        SellerId = seller.SellerId,
                        Balance = 0
                    });
                    await _context.SaveChangesAsync();
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Status = "Error", Message = $"Profile creation failed: {ex.Message}" });
            }

            return Ok(new { message = "User and profile registered successfully!" });
        }


        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginModel loginModel)
        {
            var user = await _userManager.FindByNameAsync(loginModel.UserName);
            if (user != null && await _userManager.CheckPasswordAsync(user, loginModel.Password))
            {
                var roles = await _userManager.GetRolesAsync(user);

                var authClaims = new List<Claim>
                {
                    new Claim(ClaimTypes.Name, user.UserName),
                   new Claim(ClaimTypes.NameIdentifier, user.Id),
                    new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
                };

                foreach (var role in roles)
                {
                    authClaims.Add(new Claim(ClaimTypes.Role, role));
                }

                var authSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Secret"]));

                var token = new JwtSecurityToken(
                    issuer: _configuration["Jwt:Issuer"],
                    audience: _configuration["Jwt:Audience"],
                    expires: DateTime.Now.AddHours(1),
                    claims: authClaims,
                    signingCredentials: new SigningCredentials(authSigningKey, SecurityAlgorithms.HmacSha256)
                );

                return Ok(new
                {
                    token = new JwtSecurityTokenHandler().WriteToken(token),
                    expiration = token.ValidTo
                });
            }
            return Unauthorized(new { message = "Invalid credentials" });
        }

        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword(ForgotPassword model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var user = await _userManager.FindByEmailAsync(model.Email);
            if (user == null)
                return BadRequest(new { message = "Invalid Email Address" });

            var token = await _userManager.GeneratePasswordResetTokenAsync(user);
            var encodedToken = System.Net.WebUtility.UrlEncode(token);

            var resetLink = Url.Action(nameof(ResetPassword), "Authentication", new { email = model.Email, token = encodedToken }, Request.Scheme);

            return Ok(new
            {
                status = "Success",
                message = "Password reset token generated successfully.",
                ResetLink = resetLink
            });
        }

        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword(ResetPassword model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var user = await _userManager.FindByEmailAsync(model.Email);
            if (user == null)
                return BadRequest(new { message = "User not found." });

            var decodedToken = System.Net.WebUtility.UrlDecode(model.Token);
            var result = await _userManager.ResetPasswordAsync(user, decodedToken, model.NewPassword);

            if (!result.Succeeded)
                return BadRequest(new
                {
                    message = "Password reset failed",
                    errors = result.Errors.Select(e => e.Description)
                });

            return Ok(new { status = "Success", message = "Password has been reset successfully" });
        }
    }
}
