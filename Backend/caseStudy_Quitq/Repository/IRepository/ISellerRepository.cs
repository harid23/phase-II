using CaseStudy_Quitq.Models;
using System.Collections.Generic;

namespace CaseStudy_Quitq.Repository.IRepository
{
    public interface ISellerRepository
    {
        public List<Seller> GetAllActiveSellers();
        public List<Seller> GetAllSellers();
        public Seller GetSellerById(int id);
        public List<Seller> GetSellersByName(string name);
        public string AddSeller(Seller seller);
        public Seller GetSellerByUserId(string userId);
        public string UpdateSeller(int id, Seller seller);
        public string DeleteSeller(int id);
        void Save();
    }
}
