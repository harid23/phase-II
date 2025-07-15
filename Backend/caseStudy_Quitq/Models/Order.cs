using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using CaseStudy_Quitq.Models;

namespace CaseStudy_Quitq.Models
{
    public class Order
    {
        [Key]
        public int OrderId { get; set; }

        [Required]
        public int ProductId { get; set; }
        [ForeignKey("ProductId")]
        public Product? Product { get; set; }

        [ForeignKey("CustomerId")]
        public int CustomerId { get; set; }  

        public Customer? Customer { get; set; }

        [Required]
        public int SellerId { get; set; }
        [ForeignKey("SellerId")]
        public Seller? Seller { get; set; }

        public DateTime OrderDate { get; set; } = DateTime.Now;

        [Required]
        public decimal TotalAmount { get; set; }

        [Required]
        public int Quantity { get; set; }

        [Required]
        public OrderStatus Status { get; set; } = OrderStatus.Placed;

        public string? ShippingAddress { get; set; }
        public string? CancelReason { get; set; }

        [Required]
        public string PaymentStatus { get; set; } = "Pending";
        public bool IsDeleted { get; set; } = false;

    }

    public enum OrderStatus
    {
        Placed,          
        Confirmed,
        Shipped,
        Delivered,
        CancellationRequested,
        InProgress,
        Cancelled,
    }
}
