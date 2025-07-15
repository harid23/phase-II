import React from 'react';

export default function SellerTable({ sellers, onDelete }) {
  return (
    <table className="table table-bordered">
      <thead className="table-dark">
        <tr>
          <th>Seller ID</th>
          <th>Username</th>
          <th>Phone</th>
          {/* <th>Email</th> */}
          <th>Company Name</th>
          <th>City</th>
          <th>Status</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {sellers && sellers.length > 0 ? (
          sellers.map(seller => (
            <tr key={seller.sellerId}>
              <td>{seller.sellerId}</td>
              <td>{seller.sellerName}</td>
              <td>{seller.contact}</td>
              {/* <td>{seller.email}</td> */}
              <td>{seller.companyName}</td>
              <td>{seller.sellerCity}</td>  
              <td>{seller.isDeleted ? "Deleted" : "Active"}</td>
              <td>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => onDelete(seller.sellerId)}
                  disabled={seller.isDeleted}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="7" className="text-center">No sellers found.</td>
          </tr>
        )}
      </tbody>
    </table>
  );
}
