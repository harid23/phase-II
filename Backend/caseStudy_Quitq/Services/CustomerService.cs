using CaseStudy_Quitq.Contexts;
using CaseStudy_Quitq.Models;
using CaseStudy_Quitq.Repository;
using CaseStudy_Quitq.Repository.IRepository;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;

namespace CaseStudy_Quitq.Services
{
    public class CustomerService
    {
        private readonly ICustomerRepository _customerRepository;
        private readonly ApplicationDbContext _context;

        public CustomerService(ICustomerRepository customerRepository,ApplicationDbContext context)
        {
            _customerRepository = customerRepository;
            _context = context;
        }

        public List<Customer> GetAllCustomers()
        {
            try
            {
                return _customerRepository.GetAllCustomers();
            }
            catch (Exception ex)
            {
                throw new Exception("Exception in GetAllCustomers: " + ex.Message);
            }
        }

        public Customer GetCustomerById(int id)
        {
            try
            {
                return _customerRepository.GetCustomerById(id);
            }
            catch (Exception ex)
            {
                throw new Exception("Exception in GetCustomerById: " + ex.Message);
            }
        }

        public List<Customer> GetCustomerByName(string name)
        {
            try
            {
                return _customerRepository.GetCustomerByName(name);
            }
            catch (Exception ex)
            {
                throw new Exception("Exception in GetCustomerByName: " + ex.Message);
            }
        }

        //public List<Customer> GetCustomerByEmail(string email)
        //{
        //    try
        //    {
        //        return _customerRepository.GetCustomerByEmail(email);
        //    }
        //    catch (Exception ex)
        //    {
        //        throw new Exception("Exception in GetCustomerByEmail: " + ex.Message);
        //    }
        //}
        public string AddCustomer(Customer customer)
        {
            try
            {
                var existingCustomer = _customerRepository.GetCustomerByUsername(customer.Username);
                if (existingCustomer != null)
                {
                    return "A customer profile already exists for this user.";
                }

                _customerRepository.AddCustomer(customer);
                _customerRepository.Save(); 

                return "Customer profile created successfully.";
            }
            catch (Exception ex)
            {
                throw new Exception("Exception in AddCustomer: " + ex.Message);
            }
        }


        public string UpdateCustomer(string username, Customer customer)
        {
            try
            {
                var existingCustomer = _context.Customers.FirstOrDefault(c => c.Username == username);

                if (existingCustomer == null)
                    return "Customer not found";

                existingCustomer.CustomerName = customer.CustomerName;
                existingCustomer.Address = customer.Address;
                existingCustomer.CustomerCity = customer.CustomerCity;
                existingCustomer.Phone = customer.Phone;

                _context.SaveChanges();

                return "Customer profile updated successfully.";
            }
            catch (Exception ex)
            {
                throw new Exception("Exception in UpdateCustomer: " + ex.Message);
            }
        }
        public Customer GetCustomerByUsername(string username)
        {
            return _customerRepository.GetCustomerByUsername(username);
        }

        public string DeleteCustomer(int id)
        {
            try
            {
                return _customerRepository.DeleteCustomer(id);
            }
            catch (Exception ex)
            {
                throw new Exception("Exception in DeleteCustomer: " + ex.Message);
            }
        }
    }
}
