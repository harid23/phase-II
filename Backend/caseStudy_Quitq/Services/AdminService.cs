using CaseStudy_Quitq.Models;
using CaseStudy_Quitq.Repository;

namespace CaseStudy_Quitq.Services
{
    public class AdminService 
    {
        private readonly IAdminRepository _adminRepository;

        public AdminService(IAdminRepository adminRepository)
        {
            _adminRepository = adminRepository;
        }

        public string AddAdmin(Admin admin)
        {
            try
            {
                var existingAdmin = _adminRepository.GetAdminByUserId(admin.UserId);
                if (existingAdmin != null)
                {
                    return "This user already has an admin profile.";
                }

                return _adminRepository.AddAdmin(admin);
            }
            catch (Exception ex)
            {
                throw new Exception("Exception in AddAdmin: " + ex.Message);
            }
        }


        public string UpdateAdmin(int id, Admin admin)
        {
            try
            {
                return _adminRepository.UpdateAdmin(id, admin);
            }
            catch (Exception ex)
            {
                throw new Exception("Exception in UpdateAdmin: " + ex.Message);
            }
        }

        public string DeleteAdmin(int id)
        {
            try
            {
                return _adminRepository.DeleteAdmin(id);
            }
            catch (Exception ex)
            {
                throw new Exception("Exception in DeleteAdmin: " + ex.Message);
            }
        }

        public List<Admin> GetAllAdmins()
        {
            try
            {
                return _adminRepository.GetAllAdmins();
            }
            catch (Exception ex)
            {
                throw new Exception("Exception in GetAllAdmins: " + ex.Message);
            }
        }

        public Admin GetAdminById(int id)
        {
            try
            {
                return _adminRepository.GetAdminById(id);
            }
            catch (Exception ex)
            {
                throw new Exception("Exception in GetAdminById: " + ex.Message);
            }
        }

        public List<Admin> GetAdminByName(string name)
        {
            try
            {
                return _adminRepository.GetAdminByName(name);
            }
            catch (Exception ex)
            {
                throw new Exception("Exception in GetAdminByName: " + ex.Message);
            }
        }

        public int GetTotalCustomers()
        {
            try
            {
                return _adminRepository.GetTotalCustomers();
            }
            catch (Exception ex)
            {
                throw new Exception("Exception in GetTotalCustomers: " + ex.Message);
            }
        }

        public int GetTotalSellers()
        {
            try
            {
                return _adminRepository.GetTotalSellers();
            }
            catch (Exception ex)
            {
                throw new Exception("Exception in GetTotalSellers: " + ex.Message);
            }
        }

        public int GetTotalProducts()
        {
            try
            {
                return _adminRepository.GetTotalProducts();
            }
            catch (Exception ex)
            {
                throw new Exception("Exception in GetTotalProducts: " + ex.Message);
            }
        }

        public int GetTotalOrders()
        {
            try
            {
                return _adminRepository.GetTotalOrders();
            }
            catch (Exception ex)
            {
                throw new Exception("Exception in GetTotalOrders: " + ex.Message);
            }
        }
    }
}
