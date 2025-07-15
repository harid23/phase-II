import React from 'react';
import { Link } from 'react-router-dom';

export default function Unauthorized() {
  return (
    <div className="container mt-5 text-center">
      <h2>🚫 Unauthorized Access</h2>
      <p>You are not allowed to view this page.</p>
      <Link className="btn btn-primary mt-3" to="/">Back to Home</Link>
    </div>
  );
}
