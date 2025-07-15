using CaseStudy_Quitq.Models;

namespace CaseStudy_Quitq.Repository.IRepository
{
    public interface ICustomerRepository
    {
        public List<Customer> GetAllActiveCustomers();
        public List<Customer> GetAllCustomers();
        public Customer GetCustomerById(int id);
        public List<Customer> GetCustomerByName(string name);
        //public List<Customer> GetCustomerByEmail(string email);
        public string AddCustomer(Customer customer);
        public string UpdateCustomer(string username, Customer customer);
        public Customer GetCustomerByUsername(string username);
        Customer GetCustomerByUserId(string userId);
        void Save();
        public string DeleteCustomer(int id);
    }
}
