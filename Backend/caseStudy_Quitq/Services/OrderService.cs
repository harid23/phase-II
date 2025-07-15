// OrderService.cs
using CaseStudy_Quitq.Models;
using CaseStudy_Quitq.Repository;
using CaseStudy_Quitq.Repository.IRepository;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;

namespace CaseStudy_Quitq.Services
{
    public class OrderService
    {
        private readonly IOrderRepository _orderRepository;
        private readonly IProductRepository _productRepository;

        public OrderService(IOrderRepository orderRepository, IProductRepository productRepository)
        {
            _orderRepository = orderRepository;
            _productRepository = productRepository;
        }


        //public string PlaceOrder(Order order)
        //{
        //    var product = _productRepository.GetProductById(order.ProductId);
        //    if (product == null)
        //        return "Product not found.";

        //    if (order.Quantity <= 0)
        //        return "Quantity must be at least 1.";

        //    if (product.Stock < order.Quantity)
        //        return "Insufficient stock available.";

        //    product.Stock -= order.Quantity;

        //    _productRepository.UpdateProduct(product.ProductId, product);

        //    order.TotalAmount = product.Price * order.Quantity;
        //    order.OrderDate = DateTime.Now;
        //    order.Status = OrderStatus.Placed;
        //    order.SellerId = product.SellerId;
        //    _orderRepository.PlaceOrder(order);
        //    _orderRepository.SaveChanges();

        //    return "Order placed successfully.";
        //}


        public List<Order> GetAllOrders()
        {
            try
            {
                var orders = _orderRepository.GetAllOrders();
                return orders;
            }
            catch (Exception ex)
            {
                throw new Exception("Error in GetAllOrders (Service): " + ex.Message);
            }
        }

        public Order GetOrderById(int id)
        {
            try
            {
                return _orderRepository.GetOrderById(id);
            }
            catch (Exception ex)
            {
                throw new Exception("Error in GetOrderById (Service): " + ex.Message);
            }
        }

        public List<Order> GetOrdersByCustomerId(int customerId)
        {
            try
            {
                return _orderRepository.GetOrdersByCustomerId(customerId);
            }
            catch (Exception ex)
            {
                throw new Exception("Error in GetOrdersByCustomerId (Service): " + ex.Message);
            }
        }

        public List<Order> GetOrdersBySellerId(int sellerId)
        {
            try
            {
                return _orderRepository.GetOrdersBySellerId(sellerId);
            }
            catch (Exception ex)
            {
                throw new Exception("Error in GetOrdersBySellerId (Service): " + ex.Message);
            }
        }
        public List<Order> GetOrdersByProductId(int productId)
        {
            try
            {
                return _orderRepository.GetOrdersByProductId(productId);
            }
            catch (Exception ex)
            {
                throw new Exception("Error in GetOrdersBySellerId (Service): " + ex.Message);
            }
        }

        public string DeleteOrder(int id)
        {
            try
            {
                return _orderRepository.DeleteOrder(id);
            }
            catch (Exception ex)
            {
                throw new Exception("Error in CancelOrder (Service): " + ex.Message);
            }
        }

        public int GetTotalOrderCount()
        {
            try
            {
                return _orderRepository.GetTotalOrderCount();
            }
            catch (Exception ex)
            {
                throw new Exception("Error in GetTotalOrderCount (Service): " + ex.Message);
            }
        }
        public Order UpdateOrderStatus(int orderId, string newStatus)
        {
            if (!Enum.TryParse(newStatus, true, out OrderStatus parsedStatus))
                throw new Exception("Invalid status value");

            return _orderRepository.UpdateOrderStatus(orderId, parsedStatus);
        }



    }
}
