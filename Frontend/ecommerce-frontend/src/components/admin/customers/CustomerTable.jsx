import React from 'react';

export default function CustomerTable({ customers, onSoftDelete }) {
  return (
    <div className="mt-4">
      <h4>👥 Customers List</h4>
      <table className="table table-bordered">
        <thead className="table-dark">
          <tr>
            <th>Customer ID</th>
            <th>Name</th>
            <th>Username</th>
            {/* <th>Email</th> */}
            <th>Phone</th>
            <th>City</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {customers.map(customer => (
            <tr key={customer.customerId}>
              <td>{customer.customerId}</td>
              <td>{customer.customerName}</td>
              <td>{customer.username}</td>
              {/* <td>{customer.email}</td> */}
              <td>{customer.phone}</td>
              <td>{customer.customerCity}</td>
              <td>{customer.isDeleted ? 'Deleted' : 'Active'}</td>
              <td>
                {!customer.isDeleted && (
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => onSoftDelete(customer.customerId)}
                  >
                    Soft Delete
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
