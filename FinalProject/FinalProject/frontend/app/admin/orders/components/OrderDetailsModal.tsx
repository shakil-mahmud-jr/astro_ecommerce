'use client';

import { useState } from 'react';
import { Order, OrderStatus, PaymentStatus } from '../types';
import StatusBadge from './StatusBadge';
import PaymentStatusBadge from './PaymentStatusBadge';
import { formatDate, formatCurrency } from '@/lib/utils';

interface OrderDetailsModalProps {
  order: Order;
  onClose: () => void;
  onUpdateStatus: (orderId: string, status: OrderStatus) => Promise<void>;
  onUpdatePaymentStatus: (orderId: string, status: PaymentStatus) => Promise<void>;
}

export default function OrderDetailsModal({
  order,
  onClose,
  onUpdateStatus,
  onUpdatePaymentStatus,
}: OrderDetailsModalProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleStatusChange = async (status: OrderStatus) => {
    try {
      setIsUpdating(true);
      setError(null);
      await onUpdateStatus(order.id, status);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update order status');
    } finally {
      setIsUpdating(false);
    }
  };

  const handlePaymentStatusChange = async (status: PaymentStatus) => {
    try {
      setIsUpdating(true);
      setError(null);
      await onUpdatePaymentStatus(order.id, status);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update payment status');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Order Details</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <span className="sr-only">Close</span>
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="px-6 py-4">
          {error && (
            <div className="mb-4 bg-red-50 border-l-4 border-red-400 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <h4 className="text-sm font-medium text-gray-500">Order Information</h4>
              <div className="mt-2 space-y-2">
                <p className="text-sm text-gray-900">Order ID: {order.id}</p>
                <p className="text-sm text-gray-900">Date: {formatDate(order.createdAt)}</p>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-900">Status:</span>
                  <StatusBadge status={order.status} />
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-900">Payment Status:</span>
                  <PaymentStatusBadge status={order.paymentStatus} />
                </div>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500">Customer Information</h4>
              <div className="mt-2 space-y-2">
                <p className="text-sm text-gray-900">Name: {order.user.firstName} {order.user.lastName}</p>
                <p className="text-sm text-gray-900">Email: {order.user.email}</p>
                <p className="text-sm text-gray-900">Shipping Address: {order.shippingAddress}</p>
                <p className="text-sm text-gray-900">Billing Address: {order.billingAddress}</p>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <h4 className="text-sm font-medium text-gray-500 mb-4">Order Items</h4>
            <div className="bg-gray-50 rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {order.items.map((item) => (
                    <tr key={item.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.product.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatCurrency(item.price)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.quantity}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatCurrency(item.subtotal)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-6 flex justify-between items-center">
            <div className="space-y-2">
              <p className="text-sm text-gray-500">Subtotal: {formatCurrency(order.subtotal)}</p>
              <p className="text-sm text-gray-500">Tax: {formatCurrency(order.tax)}</p>
              <p className="text-sm text-gray-500">Shipping: {formatCurrency(order.shipping)}</p>
              <p className="text-base font-medium text-gray-900">Total: {formatCurrency(order.total)}</p>
            </div>

            <div className="space-x-4">
              <select
                value={order.status}
                onChange={(e) => handleStatusChange(e.target.value as OrderStatus)}
                disabled={isUpdating}
                className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                {Object.values(OrderStatus).map((status) => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>

              <select
                value={order.paymentStatus}
                onChange={(e) => handlePaymentStatusChange(e.target.value as PaymentStatus)}
                disabled={isUpdating}
                className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                {Object.values(PaymentStatus).map((status) => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 