using CaseStudy_Quitq.Models;

public interface IAdminRepository
{
    public string AddAdmin(Admin admin);
    public Admin GetAdminByUserId(string userId);

    public string UpdateAdmin(int id, Admin admin);
    public string DeleteAdmin(int id);
    public List<Admin> GetAllActiveAdmins();
    public List<Admin> GetAllAdmins();
    public Admin GetAdminById(int id);
    public List<Admin> GetAdminByName(string name);
    public int GetTotalCustomers();
    public int GetTotalSellers();
    public int GetTotalProducts();
    public int GetTotalOrders();
}
