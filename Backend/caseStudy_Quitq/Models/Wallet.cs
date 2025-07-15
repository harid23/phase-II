using CaseStudy_Quitq.Models;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

public class Wallet
{
    [Key]
    public int WalletId { get; set; }

    [ForeignKey("Customer")]
    public int? CustomerId { get; set; }
    public Customer? Customer { get; set; }
    
    public int? SellerId { get; set; }

    [ForeignKey("SellerId")]
    public Seller? Seller { get; set; }

    public decimal Balance { get; set; } = 0;

    public DateTime LastUpdated { get; set; } = DateTime.Now;
}
