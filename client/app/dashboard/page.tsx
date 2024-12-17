'use client';
import DashboardStats from '@/components/dashboard/DashboardStats';
import RecentOrders from '@/components/dashboard/RecentOrders';
import PopularDishes from '@/components/dashboard/PopularDishes';
import RevenueChart from '@/components/dashboard/RevenueChart';

export default function Dashboard() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <button className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors">
          Generate Report
        </button>
      </div>

      <DashboardStats />

      <div className="grid lg:grid-cols-2 gap-8">
        <RevenueChart />
        <PopularDishes />
      </div>

      <RecentOrders />
    </div>
  );
}
