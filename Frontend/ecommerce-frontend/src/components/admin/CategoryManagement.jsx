import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API = 'https://localhost:7203/api/Category';

export default function CategoryManagement() {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ name: '', categoryId: null });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await axios.get(API);
      setCategories(res.data);
    } catch (err) {
      console.error("❌ Failed to fetch categories", err);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await axios.put(`${API}/${form.categoryId}`, { name: form.categoryName });
        alert("✅ Category updated");
      } else {
        await axios.post(API, { name: form.categoryName });
        alert("✅ Category added");
      }
      setForm({ name: '', categoryId: null });
      setIsEditing(false);
      fetchCategories();
    } catch (err) {
      console.error("❌ Failed to submit category", err);
    }
  };

  const handleEdit = (category) => {
    setForm({ name: category.categoryName, categoryId: category.categoryId });
    setIsEditing(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;
    try {
      await axios.delete(`${API}/${id}`);
      alert("✅ Category deleted");
      fetchCategories();
    } catch (err) {
      console.error("❌ Failed to delete category", err);
    }
  };

  return (
    <div className="container mt-4">
      <h2>📁 Category Management</h2>

      <form className="row g-2 mb-4" onSubmit={handleSubmit}>
        <div className="col-md-6">
          <input
            type="text"
            className="form-control"
            name="categoryName"
            value={form.name}
            onChange={handleChange}
            placeholder="Enter category name"
            required
          />
        </div>
        <div className="col-md-3">
          <button className="btn btn-primary w-100" type="submit">
            {isEditing ? 'Update' : 'Add'} Category
          </button>
        </div>
        {isEditing && (
          <div className="col-md-3">
            <button
              type="button"
              className="btn btn-secondary w-100"
              onClick={() => {
                setIsEditing(false);
                setForm({ name: '', categoryId: null });
              }}
            >
              Cancel
            </button>
          </div>
        )}
      </form>

      <table className="table table-bordered">
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((cat) => (
            <tr key={cat.categoryId}>
              <td>{cat.categoryId}</td>
              <td>{cat.name}</td>
              <td>
                <button className="btn btn-sm btn-warning me-2" onClick={() => handleEdit(cat)}>
                  Edit
                </button>
                <button className="btn btn-sm btn-danger" onClick={() => handleDelete(cat.categoryId)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
