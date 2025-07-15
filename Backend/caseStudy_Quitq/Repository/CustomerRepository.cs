using CaseStudy_Quitq.Contexts;
using CaseStudy_Quitq.Models;
using CaseStudy_Quitq.Repository.IRepository;
using Microsoft.EntityFrameworkCore;

public class CustomerRepository : ICustomerRepository
{
    private readonly ApplicationDbContext _context;

    public CustomerRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public List<Customer> GetAllActiveCustomers()
    {
        return _context.Customers.Where(c => !c.IsDeleted).ToList();
    }

    public List<Customer> GetAllCustomers()
    {
        try
        {
            return _context.Customers.ToList();
        }
        catch (Exception ex)
        {
            throw new Exception("Error in GetAllCustomers: " + ex.Message);
        }
    }
    public Customer GetCustomerByUserId(string userId)
    {
        return _context.Customers.Include(c => c.Wallet).FirstOrDefault(c => c.UserId == userId && !c.IsDeleted);
    }

    public Customer GetCustomerById(int id)
    {
        try
        {
            return _context.Customers.FirstOrDefault(c => c.CustomerId == id);
        }
        catch (Exception ex)
        {
            throw new Exception("Error in GetCustomerById: " + ex.Message);
        }
    }

    public List<Customer> GetCustomerByName(string name)
    {
        try
        {
            return _context.Customers
                .Where(c => !string.IsNullOrEmpty(c.CustomerName) && c.CustomerName.ToLower().Contains(name.ToLower()))
                .ToList();
        }
        catch (Exception ex)
        {
            throw new Exception("Error in GetCustomerByName: " + ex.Message);
        }
    }

    public string AddCustomer(Customer customer)
    {
        try
        {
            if (customer != null)
            {
                _context.Customers.Add(customer);
                _context.SaveChanges();

                var wallet = new Wallet
                {
                    CustomerId = customer.CustomerId,
                    Balance = 0
                };
                _context.Wallets.Add(wallet);
                _context.SaveChanges();

                return "Customer and wallet added successfully.";
            }
            return "Invalid customer data.";
        }
        catch (Exception ex)
        {
            throw new Exception("Error in AddCustomer: " + ex.Message);
        }
    }

    public string UpdateCustomer(string username, Customer updatedCustomer)
    {
        try
        {
            var existing = _context.Customers.FirstOrDefault(c => c.Username == username && !c.IsDeleted);
            if (existing == null)
                return $"Customer with username '{username}' not found.";

            existing.CustomerName = updatedCustomer.CustomerName;
            existing.Phone = updatedCustomer.Phone;
            existing.Address = updatedCustomer.Address;

            _context.SaveChanges();
            return $"Customer '{username}' updated successfully.";
        }
        catch (Exception ex)
        {
            throw new Exception("Error in UpdateCustomer: " + ex.Message);
        }
    }

    public Customer GetCustomerByUsername(string username)
    {
        try
        {
            return _context.Customers.FirstOrDefault(c => c.Username == username && !c.IsDeleted);
        }
        catch (Exception ex)
        {
            throw new Exception("Error in GetCustomerByUsername: " + ex.Message);
        }
    }

    public string DeleteCustomer(int id)
    {
        try
        {
            var customer = _context.Customers.FirstOrDefault(c => c.CustomerId == id);
            if (customer == null)
                return $"Customer with ID {id} not found.";

            if (customer.IsDeleted)
                return "Customer already deleted.";

            customer.IsDeleted = true;
            _context.Customers.Update(customer);
            _context.SaveChanges();

            return "Customer soft-deleted successfully.";
        }
        catch (Exception ex)
        {
            throw new Exception("Error in DeleteCustomer: " + ex.Message);
        }
    }
    public void Save()
    {
        _context.SaveChanges();
    }

}
