'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const menuItems = [
  { icon: '📊', label: 'Analytics', href: '/admin/analytics' },
  { icon: '📦', label: 'Products', href: '/admin/products' },
  { icon: '🛍️', label: 'Orders', href: '/admin/orders' },
  { icon: '👥', label: 'Customers', href: '/admin/customers' },
  { icon: '⚙️', label: 'Settings', href: '/admin/settings' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <nav className="bg-white shadow-sm fixed w-full z-10">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <button
                onClick={() => setSidebarOpen(!isSidebarOpen)}
                className="px-4 text-gray-500 focus:outline-none"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M4 6h16M4 12h16M4 18h16"></path>
                </svg>
              </button>
              <div className="flex-shrink-0 flex items-center">
                <span className="text-2xl font-bold text-indigo-600">Admin Dashboard</span>
              </div>
            </div>
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <img
                  className="h-8 w-8 rounded-full"
                  src="https://ui-avatars.com/api/?name=Admin&background=0066cc&color=fff"
                  alt="Admin"
                />
              </div>
              <div className="ml-3">
                <div className="text-base font-medium text-gray-800">Admin</div>
                <div className="text-sm font-medium text-gray-500">admin@example.com</div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Sidebar */}
      <div
        className={`fixed left-0 top-16 h-full bg-white shadow-lg transition-all duration-300 ease-in-out z-20 ${
          isSidebarOpen ? 'w-64' : 'w-20'
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex-1 py-4 overflow-y-auto">
            <nav className="px-2 space-y-1">
              {menuItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`group flex items-center px-2 py-3 text-base font-medium rounded-md transition-colors duration-150 ${
                      isActive
                        ? 'bg-indigo-50 text-indigo-600'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <span className="mr-3 text-xl">{item.icon}</span>
                    <span
                      className={`${
                        !isSidebarOpen && 'hidden'
                      } transition-opacity duration-150`}
                    >
                      {item.label}
                    </span>
                  </Link>
                );
              })}
            </nav>
          </div>
          <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
            <button
              className={`group flex items-center px-2 py-2 text-base font-medium rounded-md text-red-600 hover:bg-red-50 w-full ${
                !isSidebarOpen && 'justify-center'
              }`}
            >
              <span className="mr-3">🚪</span>
              <span className={`${!isSidebarOpen && 'hidden'}`}>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main
        className={`transition-all duration-300 ease-in-out ${
          isSidebarOpen ? 'ml-64' : 'ml-20'
        } pt-16`}
      >
        {children}
      </main>
    </div>
  );
} 