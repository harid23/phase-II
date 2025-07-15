import React from 'react';

export default function ProductTable({
  products,
  onEdit,
  onDelete,
  onUploadImage,
  showUpload = true
}) {
  return (
    <table className="table table-bordered">
      <thead className="table-dark">
        <tr>
          <th>Name</th>
          <th>Price</th>
          <th>Stock</th>
          <th>Category</th>
          <th>Image</th>
          {showUpload && <th>Upload Image</th>}
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {products.map((prod) => (
          <tr key={prod.productId}>
            <td>{prod.name}</td>
            <td>₹{prod.price}</td>
            <td>{prod.stock}</td>
            <td>{prod.category?.name || 'Unknown'}</td>
            <td>
              {prod.imagePath ? (
                <img
                  src={`https://localhost:7203/Images/Products/${prod.imagePath}`}
                  alt="Product"
                  width="50"
                  height="50"
                  style={{ objectFit: 'cover' }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/default-placeholder.png';
                  }}
                />
              ) : (
                <span>No image</span>
              )}
            </td>
            {showUpload && (
              <td>
                <input
                  type="file"
                  accept=".png,.jpg,.jpeg"
                  onChange={(e) => onUploadImage(prod.productId, e.target.files[0])}
                />
              </td>
            )}
            <td>
              <button className="btn btn-warning btn-sm me-2" onClick={() => onEdit(prod)}>
                Edit
              </button>
              <button className="btn btn-danger btn-sm" onClick={() => onDelete(prod.productId)}>
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
