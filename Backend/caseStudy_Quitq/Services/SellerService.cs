using CaseStudy_Quitq.Models;
using CaseStudy_Quitq.Repository.IRepository;
using System;
using System.Collections.Generic;

namespace CaseStudy_Quitq.Services
{
    public class SellerService
    {
        private readonly ISellerRepository _sellerRepository;

        public SellerService(ISellerRepository sellerRepository)
        {
            _sellerRepository = sellerRepository;
        }

        public List<Seller> GetAllSellers()
        {
            try
            {
                var sellers = _sellerRepository.GetAllSellers();
                return sellers.Count > 0 ? sellers : null;
            }
            catch (Exception ex)
            {
                throw new Exception("Exception in GetAllSellers: " + ex.Message);
            }
        }

        public Seller GetSellerById(int id)
        {
            try
            {
                return _sellerRepository.GetSellerById(id);
            }
            catch (Exception ex)
            {
                throw new Exception("Exception in GetSellerById: " + ex.Message);
            }
        }

        public List<Seller> GetSellersByName(string name)
        {
            try
            {
                return _sellerRepository.GetSellersByName(name);
            }
            catch (Exception ex)
            {
                throw new Exception("Exception in GetSellersByName: " + ex.Message);
            }
        }

        public string AddSeller(Seller seller)
        {
            try
            {
                var existingSeller = _sellerRepository.GetSellerByUserId(seller.UserId);
                if (existingSeller != null)
                {
                    return "This user already has a seller profile.";
                }

                return _sellerRepository.AddSeller(seller);
            }
            catch (Exception ex)
            {
                throw new Exception("Exception in AddSeller: " + ex.Message);
            }
        }


        public string UpdateSeller(int id, Seller seller)
        {
            try
            {
                return _sellerRepository.UpdateSeller(id, seller);
            }
            catch (Exception ex)
            {
                throw new Exception("Exception in UpdateSeller: " + ex.Message);
            }
        }

        public string DeleteSeller(int id)
        {
            try
            {
                return _sellerRepository.DeleteSeller(id);
            }
            catch (Exception ex)
            {
                throw new Exception("Exception in DeleteSeller: " + ex.Message);
            }
        }
    }
}
