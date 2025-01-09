'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Clock, Check, X, ChevronDown, Users, Timer } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

interface OrderItem {
  dishId: string;
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  tableNumber: string;
  customerName: string;
  customerPhone: string;
  items: OrderItem[];
  status: string;
  totalAmount?: number;
  createdAt?: string;
}

interface TableStatus {
  tableNumber: string;
  status: 'empty' | 'occupied' | 'pending';
  orderId?: string;
}

interface Table {
  id: string;
  tableNumber: string;
  status: 'empty' | 'occupied' | 'pending';
}

const metadata = {
  title: 'Orders',
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [view, setView] = useState<'list' | 'floor'>('floor');
  const [tables, setTables] = useState<Table[]>([]);

  useEffect(() => {
    fetchTablesAndOrders();
  }, []);

  const fetchTablesAndOrders = async () => {
    try {
      // Fetch tables
      const tablesResponse = await axios.get(
        'https://foodease-1.onrender.com:8080/api/table/restaurant/my-table',
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      setTables(tablesResponse.data);

      // Fetch orders
      const ordersResponse = await axios.get(
        'https://foodease-1.onrender.com:8080/api/order/get-order-by-token',
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      
      const ordersWithTotal = ordersResponse.data.map((order: Order) => ({
        ...order,
        totalAmount: order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
      }));

      setOrders(ordersWithTotal);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const getTableStatus = (tableNumber: string) => {
    const order = orders.find(o => o.tableNumber === tableNumber);
    if (!order) return 'empty';
    return order.status.toLowerCase();
  };

  const getTableOrder = (tableNumber: string) => {
    return orders.find(o => o.tableNumber === tableNumber);
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      setUpdatingOrderId(orderId);
      const response = await axios.put(
        `https://foodease-1.onrender.com:8080/api/order/update-order-status/${orderId}`,
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
        fetchTablesAndOrders();
      }
    } catch (error) {
      console.error('Error updating order:', error);
      toast.error('Failed to update order status');
    } finally {
      setUpdatingOrderId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Restaurant Floor</h1>
          <div className="flex items-center gap-4">
            <div className="flex gap-2">
              <button
                onClick={() => setView('floor')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  view === 'floor' 
                    ? 'bg-orange-500 text-white' 
                    : 'bg-white text-gray-600 hover:bg-gray-100'
                }`}
              >
                Floor View
              </button>
              <button
                onClick={() => setView('list')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  view === 'list' 
                    ? 'bg-orange-500 text-white' 
                    : 'bg-white text-gray-600 hover:bg-gray-100'
                }`}
              >
                List View
              </button>
            </div>
            <button
              onClick={() => fetchTablesAndOrders()}
              className="px-4 py-2 bg-white text-gray-600 rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-2"
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
        </div>

        <AnimatePresence mode="wait">
          {view === 'floor' ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {tables.map((table) => {
                const status = getTableStatus(table.tableNumber);
                const order = getTableOrder(table.tableNumber);
                
                return (
                  <motion.div
                    key={table.id}
                    whileHover={{ scale: 1.02 }}
                    className={`relative p-6 rounded-xl shadow-lg ${
                      status === 'pending' 
                        ? 'bg-orange-50 border-2 border-orange-500' 
                        : status === 'completed'
                        ? 'bg-green-50 border-2 border-green-500'
                        : status === 'cancelled'
                        ? 'bg-red-50 border-2 border-red-500'
                        : 'bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-semibold">Table {table.tableNumber}</h3>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        status === 'pending' 
                          ? 'bg-orange-100 text-orange-800' 
                          : status === 'completed'
                          ? 'bg-green-100 text-green-800'
                          : status === 'cancelled'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {status === 'empty' ? 'Available' : status.charAt(0).toUpperCase() + status.slice(1)}
                      </span>
                    </div>

                    {order && (
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 text-gray-600 border-b pb-3">
                          <Users size={16} />
                          <div>
                            <p className="font-medium">{order.customerName}</p>
                            <p className="text-sm">{order.customerPhone}</p>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <p className="text-sm font-medium text-gray-600">Order Details:</p>
                          <div className="bg-white rounded-lg p-3 space-y-2 max-h-48 overflow-y-auto">
                            {order.items.map((item, index) => (
                              <div key={index} className="flex justify-between items-center text-sm">
                                <div className="flex items-center gap-2">
                                  <span className="w-5 h-5 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-xs font-medium">
                                    {item.quantity}
                                  </span>
                                  <span className="font-medium">{item.name}</span>
                                </div>
                                <span className="text-gray-600">${(item.price * item.quantity).toFixed(2)}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="flex justify-between items-center pt-3 border-t">
                          <span className="text-gray-600 font-medium">Total Amount:</span>
                          <span className="text-lg font-bold text-orange-500">
                            ${order.totalAmount?.toFixed(2)}
                          </span>
                        </div>
                        
                        {status === 'pending' && (
                          <div className="flex gap-2 mt-4">
                            <button
                              onClick={() => updateOrderStatus(order.id, 'COMPLETED')}
                              className="flex-1 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm flex items-center justify-center gap-2"
                            >
                              <Check size={16} />
                              Complete
                            </button>
                            <button
                              onClick={() => updateOrderStatus(order.id, 'CANCELLED')}
                              className="flex-1 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm flex items-center justify-center gap-2"
                            >
                              <X size={16} />
                              Cancel
                            </button>
                          </div>
                        )}
                      </div>
                    )}

                    {!order && (
                      <div className="text-center text-gray-500 mt-4">
                        <Timer size={24} className="mx-auto mb-2" />
                        <p className="text-sm">Waiting for orders</p>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {orders.map((order) => (
                <motion.div
                  key={order.id}
                  className="bg-white rounded-xl shadow-lg overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h2 className="text-xl font-semibold text-gray-800">
                            Table {order.tableNumber}
                          </h2>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            order.status === 'PENDING'
                              ? 'bg-orange-100 text-orange-800'
                              : order.status === 'COMPLETED'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {order.status}
                          </span>
                        </div>
                        <p className="text-gray-600">
                          {order.customerName} • {order.customerPhone}
                        </p>
                      </div>
                      
                      {order.status === 'PENDING' && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => updateOrderStatus(order.id, 'COMPLETED')}
                            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                          >
                            Complete
                          </button>
                          <button
                            onClick={() => updateOrderStatus(order.id, 'CANCELLED')}
                            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="space-y-3">
                        {order.items.map((item, index) => (
                          <div key={index} className="flex justify-between items-center">
                            <div>
                              <span className="font-medium">{item.name}</span>
                              <span className="text-gray-600 ml-2">x{item.quantity}</span>
                            </div>
                            <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                          </div>
                        ))}
                        <div className="pt-3 border-t flex justify-between items-center font-semibold">
                          <span>Total</span>
                          <span className="text-lg text-orange-500">${order.totalAmount?.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
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
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
} 
