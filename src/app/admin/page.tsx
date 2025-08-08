'use client';

import Link from "next/link";

export default function AdminDashboard() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-gray-100">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
        {/* Add Item */}
        <Link href="\admin\addItem">
          <div className="p-6 bg-white rounded-2xl shadow hover:shadow-lg transition cursor-pointer text-center">
            <h2 className="text-xl font-semibold mb-2">➕ Add Item</h2>
            <p className="text-gray-600">Add new merchandise to the store.</p>
          </div>
        </Link>

        {/* Submitted Orders */}
        <Link href="/admin/orders">
          <div className="p-6 bg-white rounded-2xl shadow hover:shadow-lg transition cursor-pointer text-center">
            <h2 className="text-xl font-semibold mb-2">📦 Submitted Orders</h2>
            <p className="text-gray-600">View all orders submitted by customers.</p>
          </div>
        </Link>

        {/* All Items */}
        <Link href="/admin/items">
          <div className="p-6 bg-white rounded-2xl shadow hover:shadow-lg transition cursor-pointer text-center">
            <h2 className="text-xl font-semibold mb-2">📋 All Items</h2>
            <p className="text-gray-600">View and manage all added items.</p>
          </div>
        </Link>
      </div>
    </main>
  );
}
