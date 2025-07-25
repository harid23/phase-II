# 🛒 Role-Based E-Commerce Platform

A full-stack e-commerce web application with role-based access built using **ASP.NET Core** and **React.js**.


## 🔧 Tech Stack

- **Frontend**: React.js, Bootstrap, Axios
- **Backend**: ASP.NET Core Web API, Entity Framework Core (Code First)
- **Authentication**: ASP.NET Core Identity, JWT Token
- **Database**: SQL Server

## 👤 User Roles & Features

### 🧑 Customer
- Browse products by category
- Manage cart and place orders
- Use wallet for payments and refunds
- Write reviews
- View and update profile

### 🛍️ Seller
- Add, update, and delete own products (**softdelete**)
- View orders received, Update order status
- Track earnings via wallet
- Update profile

### 🛠️ Admin
- Manage all customers, sellers, products, and orders
- Soft-delete users, Products
- View dashboard stats and filter/search data

## 🚀 Project Features

- Role-based access control using JWT
- Dynamic frontend navigation based on user role
- Wallet auto-debit/credit on order and refund
- Protected routes and AuthContext handling
- Real-time order and product management

## ✅ Testing

Unit testing is implemented using **NUnit** for key backend functionalities:

-  **User Registration** – Validates customer and seller creation via Identity
-  **Login & Token Generation** – Ensures proper JWT token creation
-  **Place Order** – Tests order placement, wallet deduction logic
-  **Add/Update Product** – Verifies seller can manage their own products
-  **Cancel and Refund Processing** – Validates refund flow and customer wallet credit
-  **Get by ID/Username** – Ensures secure fetching of user-specific data

             --------------------------------------

