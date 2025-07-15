import React from 'react';
import { useParams } from 'react-router-dom';
import PaymentForm from '../PaymentForm';

export default function MakePaymentPage() {
  const { orderId } = useParams();

  return (
    <div className="container mt-4">
      <h3>🔐 Secure Payment</h3>
      <PaymentForm orderId={orderId} />
    </div>
  );
}