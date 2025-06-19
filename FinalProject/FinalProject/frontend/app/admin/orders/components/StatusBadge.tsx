'use client';

import { OrderStatus } from '../types';

interface StatusBadgeProps {
  status: OrderStatus;
}

const getStatusColor = (status: OrderStatus): string => {
  switch (status) {
    case OrderStatus.DELIVERED:
      return 'bg-green-100 text-green-800';
    case OrderStatus.PROCESSING:
      return 'bg-blue-100 text-blue-800';
    case OrderStatus.SHIPPED:
      return 'bg-purple-100 text-purple-800';
    case OrderStatus.CANCELLED:
      return 'bg-red-100 text-red-800';
    case OrderStatus.REFUNDED:
      return 'bg-yellow-100 text-yellow-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
} 