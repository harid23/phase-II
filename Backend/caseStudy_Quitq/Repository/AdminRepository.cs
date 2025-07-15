using CaseStudy_Quitq.Contexts;
using CaseStudy_Quitq.Models;
using Microsoft.EntityFrameworkCore;

namespace CaseStudy_Quitq.Repository
{
    public class AdminRepository : IAdminRepository
    {
        private readonly ApplicationDbContext _context;

        public AdminRepository(ApplicationDbContext context)
        {
            _context = context;
        }


        public List<Admin> GetAllActiveAdmins()
        {
            return _context.Admins
                .Where(a => !a.IsDeleted)
                .ToList();
        }

        public string AddAdmin(Admin admin)
        {
            try
            {
                if (admin != null)
                {
                    _context.Admins.Add(admin);
                    _context.SaveChanges();
                    return "Admin added successfully.";
                }
                return "Admin details are invalid.";
            }
            catch (Exception ex)
            {
                throw new Exception($"Error in AddAdmin: {ex.Message}");
            }
        }
        public Admin GetAdminByUserId(string userId)
        {
            return _context.Admins.FirstOrDefault(a => a.UserId == userId);
        }


        public string UpdateAdmin(int id, Admin admin)
        {
            try
            {
                var existing = _context.Admins.FirstOrDefault(a => a.AdminId == id);
                if (existing == null)
                    return $"Admin with ID {id} not found.";

                existing.AdminName = admin.AdminName;
                existing.Contact = admin.Contact;
                existing.UserId = admin.UserId;

                _context.SaveChanges();
                return $"Admin with ID {id} updated successfully.";
            }
            catch (Exception ex)
            {
                throw new Exception($"Error in UpdateAdmin: {ex.Message}");
            }
        }

        public string DeleteAdmin(int id)
        {
            try
            {
                var admin = _context.Admins.FirstOrDefault(a => a.AdminId == id);
                if (admin == null)
                    return $"Admin with ID {id} not found.";

                if (admin.IsDeleted)
                    return $"Admin with ID {id} is already deleted.";

                admin.IsDeleted = true;
                _context.Admins.Update(admin);
                _context.SaveChanges();
                return $"Admin with ID {id} soft-deleted successfully.";
            }
            catch (Exception ex)
            {
                throw new Exception("Error soft-deleting admin: " + ex.Message);
            }
        }

        public List<Admin> GetAllAdmins()
        {
            try
            {
                var admins = _context.Admins.ToList();
                return admins.Count > 0 ? admins : null;
            }
            catch (Exception ex)
            {
                throw new Exception($"Error in GetAllAdmins: {ex.Message}");
            }
        }

        public Admin GetAdminById(int id)
        {
            try
            {
                return _context.Admins.FirstOrDefault(a => a.AdminId == id);
            }
            catch (Exception ex)
            {
                throw new Exception($"Error in GetAdminById: {ex.Message}");
            }
        }

        public List<Admin> GetAdminByName(string name)
        {
            try
            {
                return _context.Admins
                    .Where(a => a.AdminName.ToLower().Contains(name.ToLower()))
                    .ToList();
            }
            catch (Exception ex)
            {
                throw new Exception($"Error in GetAdminByName: {ex.Message}");
            }
        }

        public int GetTotalCustomers()
        {
            try
            {
                return _context.Customers.Count();
            }
            catch (Exception ex)
            {
                throw new Exception($"Error in GetTotalCustomers: {ex.Message}");
            }
        }

        public int GetTotalSellers()
        {
            try
            {
                return _context.Sellers.Count();
            }
            catch (Exception ex)
            {
                throw new Exception($"Error in GetTotalSellers: {ex.Message}");
            }
        }

        public int GetTotalProducts()
        {
            try
            {
                return _context.Products.Count();
            }
            catch (Exception ex)
            {
                throw new Exception($"Error in GetTotalProducts: {ex.Message}");
            }
        }

        public int GetTotalOrders()
        {
            try
            {
                return _context.Orders.Count();
            }
            catch (Exception ex)
            {
                throw new Exception($"Error in GetTotalOrders: {ex.Message}");
            }
        }
    }
}
