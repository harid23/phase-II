using CaseStudy_Quitq.Contexts;
using CaseStudy_Quitq.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using CaseStudy_Quitq.Repository.IRepository;

namespace CaseStudy_Quitq.Repository
{
    public class SellerRepository : ISellerRepository
    {
        private readonly ApplicationDbContext _context;

        public SellerRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public List<Seller> GetAllActiveSellers()
        {
            return _context.Sellers
                .Where(s => !s.IsDeleted)
                .ToList();
        }

        public List<Seller> GetAllSellers()
        {
            try
            {
                return _context.Sellers.Include(s => s.User).ToList();
            }
            catch (Exception ex)
            {
                throw new Exception("Error retrieving sellers: " + ex.Message);
            }
        }

        public Seller GetSellerById(int id)
        {
            try
            {
                return _context.Sellers.Include(s => s.User).FirstOrDefault(s => s.SellerId == id);
            }
            catch (Exception ex)
            {
                throw new Exception("Error retrieving seller by ID: " + ex.Message);
            }
        }

        public List<Seller> GetSellersByName(string name)
        {
            try
            {
                return _context.Sellers
                    .Include(s => s.User)
                    .Where(s => !string.IsNullOrEmpty(s.SellerName) &&
                                s.SellerName.ToLower().Contains(name.ToLower()))
                    .ToList();
            }
            catch (Exception ex)
            {
                throw new Exception("Error retrieving sellers by name: " + ex.Message);
            }
        }

        public string AddSeller(Seller seller)
        {
            try
            {
                if (seller != null)
                {
                    _context.Sellers.Add(seller);
                    _context.SaveChanges();
                    var wallet = new Wallet
                    {
                        SellerId = seller.SellerId,
                        Balance = 0
                    };
                    _context.Wallets.Add(wallet);
                    _context.SaveChanges();

                    return "Seller added successfully with wallet.";
                }
                return "Invalid seller data.";
            }
            catch (Exception ex)
            {
                throw new Exception("Error in AddSeller: " + ex.Message);
            }
        }

        public Seller GetSellerByUserId(string userId)
        {
            return _context.Sellers.FirstOrDefault(s => s.UserId == userId);
        }


        public string UpdateSeller(int id, Seller seller)
        {
            try
            {
                var existing = _context.Sellers.FirstOrDefault(s => s.SellerId == id);
                if (existing == null)
                    return $"Seller with ID {id} not found.";

                existing.SellerName = seller.SellerName;
                existing.CompanyName = seller.CompanyName;
                existing.Contact = seller.Contact;
                existing.SellerAddress = seller.SellerAddress;

                _context.SaveChanges();
                return $"Seller with ID {id} updated successfully.";
            }
            catch (Exception ex)
            {
                throw new Exception("Error updating seller: " + ex.Message);
            }
        }

        public string DeleteSeller(int id)
        {
            try
            {
                var seller = _context.Sellers.FirstOrDefault(s => s.SellerId == id);
                if (seller == null)
                    return $"Seller with ID {id} not found.";

                if (seller.IsDeleted)
                    return $"Seller with ID {id} is already deleted.";

                seller.IsDeleted = true;
                _context.Sellers.Update(seller);
                _context.SaveChanges();
                return $"Seller with ID {id} soft-deleted successfully.";
            }
            catch (Exception ex)
            {
                throw new Exception("Error soft-deleting seller: " + ex.Message);
            }
        }
        public void Save()
        {
            _context.SaveChanges();
        }
    }
}
