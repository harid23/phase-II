using CaseStudy_Quitq.Models;
using System.Collections.Generic;

namespace CaseStudy_Quitq.Repository.IRepository
{
    public interface IPaymentRepository
    {
        string MakePayment(Payment payment);
        Payment GetPaymentById(int id);
        List<Payment> GetPaymentsByCustomerId(int customerId);
        List<Payment> GetPaymentsByOrderId(int orderId);
        List<Payment> GetAllPayments();
    }
}
