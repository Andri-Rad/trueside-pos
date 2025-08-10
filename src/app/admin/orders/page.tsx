"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, DocumentData } from "firebase/firestore";
import { db } from "@/firebase";
import { useRouter } from "next/navigation"; // <-- Import router

// Order item type
type OrderItem = {
  item: string;
  size: string;
  quantity: number;
  price: number;
};

// Main order type
type Order = {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  orders: OrderItem[];
  total: number;
  timestamp?: string; // stored as ISO string
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const router = useRouter(); // <-- Initialize router

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "orders"));
        const ordersData: Order[] = querySnapshot.docs.map((doc) => {
          const data = doc.data() as DocumentData;
          return {
            id: doc.id,
            name: data.name ?? "",
            email: data.email ?? "",
            phone: data.phone ?? "",
            address: data.address ?? "",
            orders: Array.isArray(data.orders)
              ? data.orders.map((item: Partial<OrderItem>): OrderItem => ({
                  item: item.item ?? "",
                  size: item.size ?? "",
                  quantity: Number(item.quantity) || 0,
                  price: Number(item.price) || 0,
                }))
              : [],
            total: Number(data.total) || 0,
            timestamp: data.timestamp ?? undefined,
          };
        });
        console.log("Fetched Orders:", ordersData);
        setOrders(ordersData);
      } catch (error) {
        console.error("Error fetching orders: ", error);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="p-6">
      {/* Back button */}
      <button
        onClick={() => router.push("/admin")}
        className="mb-4 bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
      >
        ← Back to Dashboard
      </button>

      <h1 className="text-2xl font-bold mb-4">Submitted Orders</h1>
      <div className="overflow-x-auto">
        <table className="table-auto w-full border">
          <thead>
            <tr className="bg-gray-200">
              <th className="border px-4 py-2">Name</th>
              <th className="border px-4 py-2">Email</th>
              <th className="border px-4 py-2">Phone No.</th>
              <th className="border px-4 py-2">Address</th>
              <th className="border px-4 py-2">Orders</th>
              <th className="border px-4 py-2">Total</th>
              <th className="border px-4 py-2">Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td className="border px-4 py-2">{order.name}</td>
                <td className="border px-4 py-2">{order.email}</td>
                <td className="border px-4 py-2">{order.phone}</td>
                <td className="border px-4 py-2">{order.address}</td>
                <td className="border px-4 py-2">
                  {order.orders.map((item, index) => (
                    <div key={index}>
                      {item.item} - {item.size} x {item.quantity}
                    </div>
                  ))}
                </td>
                <td className="border px-4 py-2">
                  {new Intl.NumberFormat("id-ID", {
                    style: "currency",
                    currency: "IDR",
                    minimumFractionDigits: 0,
                  }).format(order.total)}
                </td>
                <td className="border px-4 py-2">
                  {order.timestamp
                    ? new Date(order.timestamp).toLocaleString("id-ID", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })
                    : ""}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
