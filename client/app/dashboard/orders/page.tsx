'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Clock, Check, X, ChevronDown } from 'lucide-react';
import toast from 'react-hot-toast';

interface OrderItem {
  dishId: string;
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  tableId: string;
  restaurantId: string;
  customerName: string;
  customerPhone: string;
  items: OrderItem[];
  status: string;
  totalAmount?: number;
}

const metadata = {
  title: 'Orders',
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();

    const pollInterval = setInterval(() => {
      fetchOrders(false);
    }, 1000);

    return () => clearInterval(pollInterval);
  }, []);

  const fetchOrders = async (showLoading = true) => {
    if (showLoading) {
      setLoading(true);
    }

    try {
      const response = await axios.get(
        'http://localhost:8080/api/order/get-order-by-token',
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      
      const ordersWithTotal = response.data.map((order: Order) => ({
        ...order,
        totalAmount: order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
      }));

      if (!showLoading && ordersWithTotal.length > orders.length) {
        const newOrdersCount = ordersWithTotal.length - orders.length;
        toast.success(`${newOrdersCount} new order${newOrdersCount > 1 ? 's' : ''} received!`);
        playNotificationSound();
      }

      setOrders(ordersWithTotal);
    } catch (error) {
      console.error('Error fetching orders:', error);
      if (showLoading) {
        toast.error('Failed to fetch orders');
      }
    } finally {
      if (showLoading) {
        setLoading(false);
      }
    }
  };

  const playNotificationSound = () => {
    const audio = new Audio('/notification.mp3');
    audio.play().catch(error => console.log('Error playing sound:', error));
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      setUpdatingOrderId(orderId);
      const response = await axios.put(
        `http://localhost:8080/api/order/update-order-status/${orderId}`,
        { status },
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      
      if (response.status === 200) {
        setOrders(prevOrders => 
          prevOrders.map(order => 
            order.id === orderId 
              ? { ...order, status } 
              : order
          )
        );
        
        toast.success(`Order marked as ${status.toLowerCase()}`);
        fetchOrders(false);
      }
    } catch (error) {
      console.error('Error updating order:', error);
      toast.error('Failed to update order status');
    } finally {
      setUpdatingOrderId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Active Orders</h1>
        <button
          onClick={() => fetchOrders()}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          Refresh
        </button>
      </div>

      <div className="grid gap-6">
        {orders.map((order) => (
          <div
            key={order.id}
            className="bg-white rounded-lg shadow-md overflow-hidden"
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">
                    Table #{order.tableId}
                  </h2>
                  <p className="text-gray-600">
                    Customer: {order.customerName} • {order.customerPhone}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  {order.status === 'PENDING' ? (
                    <>
                      <button
                        onClick={() => updateOrderStatus(order.id, 'COMPLETED')}
                        disabled={updatingOrderId === order.id}
                        className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 flex items-center gap-2"
                      >
                        {updatingOrderId === order.id ? (
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Check size={18} />
                        )}
                        Complete Order
                      </button>
                      <button
                        onClick={() => updateOrderStatus(order.id, 'CANCELLED')}
                        disabled={updatingOrderId === order.id}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center gap-2"
                      >
                        <X size={18} />
                        Cancel
                      </button>
                    </>
                  ) : (
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      order.status === 'COMPLETED' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {order.status}
                    </span>
                  )}
                </div>
              </div>

              {/* Order Items */}
              <div className="mt-6">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-gray-600 text-sm">
                      <th className="pb-2">Item</th>
                      <th className="pb-2">Quantity</th>
                      <th className="pb-2">Price</th>
                      <th className="pb-2">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items.map((item, index) => (
                      <tr key={index} className="border-t">
                        <td className="py-3">{item.name}</td>
                        <td className="py-3">{item.quantity}</td>
                        <td className="py-3">${item.price.toFixed(2)}</td>
                        <td className="py-3">${(item.price * item.quantity).toFixed(2)}</td>
                      </tr>
                    ))}
                    <tr className="border-t">
                      <td colSpan={3} className="py-3 font-semibold">Total Amount</td>
                      <td className="py-3 font-semibold">${order.totalAmount?.toFixed(2)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ))}

        {orders.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <Clock size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-medium text-gray-600 mb-2">
              No active orders
            </h3>
            <p className="text-gray-500">
              New orders will appear here
            </p>
          </div>
        )}
      </div>
    </div>
  );
} 