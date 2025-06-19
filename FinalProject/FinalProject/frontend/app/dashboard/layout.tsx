import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard - Bazar Admin',
  description: 'Admin dashboard for managing Bazar e-commerce platform',
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-100">
      {children}
    </div>
  );
} 