'use client';

import { useEffect, useState } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

interface AnalyticsData {
  totalSales: number;
  totalOrders: number;
  totalCustomers: number;
  totalProducts: number;
  recentOrders: Array<{
    id: string;
    date: string;
    amount: number;
    status: string;
  }>;
  salesData: {
    labels: string[];
    data: number[];
  };
  productData: {
    labels: string[];
    data: number[];
  };
}

const defaultData: AnalyticsData = {
  totalSales: 0,
  totalOrders: 0,
  totalCustomers: 0,
  totalProducts: 0,
  recentOrders: [],
  salesData: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    data: [0, 0, 0, 0, 0, 0],
  },
  productData: {
    labels: ['Product 1', 'Product 2', 'Product 3'],
    data: [0, 0, 0],
  },
};

export default function AdminAnalytics() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>(defaultData);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        // For testing, using mock data
        const mockData: AnalyticsData = {
          totalSales: 15750,
          totalOrders: 124,
          totalCustomers: 89,
          totalProducts: 45,
          recentOrders: [
            { id: '1', date: '2024-05-28', amount: 299, status: 'completed' },
            { id: '2', date: '2024-05-27', amount: 199, status: 'pending' },
            { id: '3', date: '2024-05-26', amount: 499, status: 'cancelled' },
          ],
          salesData: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            data: [3000, 3500, 4000, 4200, 4800, 5000],
          },
          productData: {
            labels: ['Laptops', 'Phones', 'Accessories'],
            data: [25, 30, 45],
          },
        };
        setAnalyticsData(mockData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Error fetching analytics data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-red-50 p-4 rounded-lg">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <div className="mt-2 text-sm text-red-700">{error}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
        <div className="flex space-x-3">
          <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            <span className="mr-2">📊</span> Export Report
          </button>
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            <span className="mr-2">🔄</span> Refresh Data
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Sales"
          value={`$${analyticsData.totalSales?.toLocaleString() ?? '0'}`}
          change="+12.5%"
          trend="up"
          icon="💰"
          color="bg-green-500"
        />
        <StatCard
          title="Total Orders"
          value={analyticsData.totalOrders?.toString() ?? '0'}
          change="+8.2%"
          trend="up"
          icon="📦"
          color="bg-blue-500"
        />
        <StatCard
          title="Total Customers"
          value={analyticsData.totalCustomers?.toString() ?? '0'}
          change="+5.1%"
          trend="up"
          icon="👥"
          color="bg-purple-500"
        />
        <StatCard
          title="Total Products"
          value={analyticsData.totalProducts?.toString() ?? '0'}
          change="-2.3%"
          trend="down"
          icon="🏷️"
          color="bg-yellow-500"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Revenue Overview</h2>
            <select className="form-select text-sm border-gray-300 rounded-md">
              <option>Last 6 months</option>
              <option>Last 12 months</option>
              <option>Last 30 days</option>
            </select>
          </div>
          <div className="h-80">
            <Line
              data={{
                labels: analyticsData.salesData?.labels ?? [],
                datasets: [
                  {
                    label: 'Revenue',
                    data: analyticsData.salesData?.data ?? [],
                    borderColor: '#6366F1',
                    backgroundColor: 'rgba(99, 102, 241, 0.1)',
                    tension: 0.4,
                    fill: true,
                  },
                ],
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: false,
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    grid: {
                      color: 'rgba(0, 0, 0, 0.1)',
                    },
                  },
                  x: {
                    grid: {
                      display: false,
                    },
                  },
                },
              }}
            />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Product Performance</h2>
            <select className="form-select text-sm border-gray-300 rounded-md">
              <option>By Units</option>
              <option>By Revenue</option>
            </select>
          </div>
          <div className="h-80">
            <Bar
              data={{
                labels: analyticsData.productData?.labels ?? [],
                datasets: [
                  {
                    label: 'Units Sold',
                    data: analyticsData.productData?.data ?? [],
                    backgroundColor: [
                      'rgba(99, 102, 241, 0.8)',
                      'rgba(168, 85, 247, 0.8)',
                      'rgba(59, 130, 246, 0.8)',
                    ],
                  },
                ],
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: false,
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    grid: {
                      color: 'rgba(0, 0, 0, 0.1)',
                    },
                  },
                  x: {
                    grid: {
                      display: false,
                    },
                  },
                },
              }}
            />
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
            <button className="text-indigo-600 hover:text-indigo-900 text-sm font-medium">
              View All Orders →
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {analyticsData.recentOrders?.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    #{order.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(order.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${order.amount?.toLocaleString() ?? '0'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        order.status === 'completed'
                          ? 'bg-green-100 text-green-800'
                          : order.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-indigo-600 hover:text-indigo-900 mr-3">View</button>
                    <button className="text-gray-600 hover:text-gray-900">Edit</button>
                  </td>
                </tr>
              ))}
              {(!analyticsData.recentOrders || analyticsData.recentOrders.length === 0) && (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                    No recent orders
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  change,
  trend,
  icon,
  color,
}: {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  icon: string;
  color: string;
}) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center">
        <div className={`${color} rounded-full p-3 text-white`}>
          <span className="text-xl">{icon}</span>
        </div>
        <div className="ml-5 w-full">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-500 truncate">{title}</p>
            <div
              className={`flex items-center text-sm ${
                trend === 'up' ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {trend === 'up' ? '↑' : '↓'} {change}
            </div>
          </div>
          <p className="mt-1 text-xl font-semibold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );
} 