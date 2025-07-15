using CaseStudy_Quitq.Contexts;
using CaseStudy_Quitq.Models;
using CaseStudy_Quitq.Repository.IRepository;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;

namespace CaseStudy_Quitq.Repository
{
    public class PaymentRepository : IPaymentRepository
    {
        private readonly ApplicationDbContext _context;

        public PaymentRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public string MakePayment(Payment payment)
        {
            try
            {
                var order = _context.Orders.FirstOrDefault(o => o.OrderId == payment.OrderId);
                if (order == null)
                    return "Order not found.";

                var customerWallet = _context.Wallets.FirstOrDefault(w => w.CustomerId == payment.CustomerId);
                var sellerWallet = _context.Wallets.FirstOrDefault(w => w.SellerId == order.SellerId);

                payment.Amount = order.TotalAmount;
                payment.PaymentDate = DateTime.Now;

                if (payment.PaymentMethod == PaymentMethod.Wallet)
                {
                    if (customerWallet == null || customerWallet.Balance < payment.Amount)
                        return "Insufficient wallet balance.";

                    customerWallet.Balance -= payment.Amount;
                    _context.Wallets.Update(customerWallet);
                }

                if (payment.PaymentMethod == PaymentMethod.Wallet ||
                    payment.PaymentMethod == PaymentMethod.UPI ||
                    payment.PaymentMethod == PaymentMethod.CreditCard ||
                    payment.PaymentMethod == PaymentMethod.DebitCard)
                {
                    payment.PaymentStatus = PaymentStatus.Completed;

                    if (sellerWallet != null)
                    {
                        decimal sellerAmount = payment.Amount * 0.80m;
                        sellerWallet.Balance += sellerAmount;
                        _context.Wallets.Update(sellerWallet);
                    }

                    order.Status = OrderStatus.Confirmed;
                    order.PaymentStatus = "Paid";
                    _context.Orders.Update(order);
                }

                _context.Payments.Add(payment);
                _context.SaveChanges();

                return "Payment processed successfully.";
            }
            catch (Exception ex)
            {
                throw new Exception("Error processing payment: " + ex.Message);
            }
        }


        public Payment GetPaymentById(int id)
        {
            return _context.Payments
                .Include(p => p.Order)
                .Include(p => p.Customer)
                .FirstOrDefault(p => p.PaymentId == id);
        }

        public List<Payment> GetPaymentsByCustomerId(int customerId)
        {
            return _context.Payments
                .Include(p => p.Order)
                .Where(p => p.CustomerId == customerId)
                .ToList();
        }

        public List<Payment> GetPaymentsByOrderId(int orderId)
        {
            return _context.Payments
                .Include(p => p.Customer)
                .Where(p => p.OrderId == orderId)
                .ToList();
        }

        public List<Payment> GetAllPayments()
        {
            return _context.Payments
                .Include(p => p.Order)
                .Include(p => p.Customer)
                .ToList();
        }
    }
}
