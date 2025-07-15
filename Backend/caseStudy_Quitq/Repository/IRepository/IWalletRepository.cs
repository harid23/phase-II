using CaseStudy_Quitq.Models;
using System.Collections.Generic;

namespace CaseStudy_Quitq.Repository.IRepository
{
    public interface IWalletRepository
    {
        Wallet GetWalletByCustomerId(int customerId);
        Wallet GetWalletBySellerId(int sellerId);
        string CreateWallet(Wallet wallet);
        string UpdateCustomerBalance(int customerId, decimal amount, bool isCredit);
        string UpdateSellerBalance(int sellerId, decimal amount);
    }
}
