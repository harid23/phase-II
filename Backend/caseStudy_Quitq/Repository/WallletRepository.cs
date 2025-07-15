using CaseStudy_Quitq.Contexts;
using CaseStudy_Quitq.Models;
using CaseStudy_Quitq.Repository.IRepository;
using System;
using System.Linq;

namespace CaseStudy_Quitq.Repository
{
    public class WalletRepository : IWalletRepository
    {
        private readonly ApplicationDbContext _context;

        public WalletRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public Wallet GetWalletByCustomerId(int customerId)
        {
            return _context.Wallets.FirstOrDefault(w => w.CustomerId == customerId);
        }
        public Wallet GetWalletBySellerId(int sellerId)
        {
            return _context.Wallets.FirstOrDefault(w => w.SellerId == sellerId);
        }
        
        public string CreateWallet(Wallet wallet)
        {
            try
            {
                if (wallet.CustomerId == 0 && wallet.SellerId == 0)
                    return "Wallet must be associated with a customer or seller.";

                _context.Wallets.Add(wallet);
                _context.SaveChanges();
                return "Wallet created successfully.";
            }
            catch (Exception ex)
            {
                throw new Exception("Error creating wallet: " + ex.Message);
            }
        }

        public string UpdateCustomerBalance(int customerId, decimal amount, bool isCredit)
        {
            var wallet = _context.Wallets.FirstOrDefault(w => w.CustomerId == customerId);
            if (wallet == null)
                return "Customer wallet not found.";

            if (!isCredit && wallet.Balance < amount)
                return "Insufficient balance in customer wallet.";

            wallet.Balance += isCredit ? amount : -amount;
            _context.SaveChanges();
            return $"Customer wallet {(isCredit ? "credited" : "debited")} successfully.";
        }

        public string UpdateSellerBalance(int sellerId, decimal amount)
        {
            var wallet = _context.Wallets.FirstOrDefault(w => w.SellerId == sellerId);
            if (wallet == null)
                return "Seller wallet not found.";

            wallet.Balance += amount;
            _context.SaveChanges();
            return $"Seller wallet credited with {amount}.";
        }
    }
}
