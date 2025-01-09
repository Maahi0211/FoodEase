'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import { ShoppingCart, Plus, Minus, X } from 'lucide-react';
import toast from 'react-hot-toast';
import Image from 'next/image';

interface Dish {
  id: string;
  name: string;
  description: string;
  price: number;
  dishUrl: string;
}

interface CartItem {
  dishId: string;
  name: string;
  price: number;
  quantity: number;
}

export default function OrderPage() {
  const params = useParams();
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCart, setShowCart] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [isOrdering, setIsOrdering] = useState(false);

  const fetchDishes = useCallback(async () => {
    try {
      const response = await axios.get(`https://foodease-1.onrender.com/api/dishes/${params.restaurantId}`);
      setDishes(response.data);
    } catch (_err) {
      toast.error('Failed to fetch menu');
    } finally {
      setLoading(false);
    }
  }, [params.restaurantId]);

  useEffect(() => {
    fetchDishes();
  }, [fetchDishes]);

  const addToCart = (dish: Dish) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.dishId === dish.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.dishId === dish.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, {
        dishId: dish.id,
        name: dish.name,
        price: dish.price,
        quantity: 1
      }];
    });
    toast.success('Added to cart');
  };

  const updateQuantity = (dishId: string, change: number) => {
    setCart(prevCart => {
      const newCart = prevCart.map(item => {
        if (item.dishId === dishId) {
          const newQuantity = item.quantity + change;
          return newQuantity > 0 ? { ...item, quantity: newQuantity } : null;
        }
        return item;
      }).filter(Boolean) as CartItem[];
      return newCart;
    });
  };

  const placeOrder = async () => {
    if (!customerName.trim() || !customerPhone.trim()) {
      toast.error('Please fill in your details');
      return;
    }

    if (cart.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    try {
      setIsOrdering(true);
      const response = await axios.post('https://foodease-1.onrender.com/api/order/create-order', {
        tableId: params.tableId,
        customerName,
        customerPhone,
        items: cart.map(item => ({
          dishId: item.dishId,
          quantity: item.quantity
        }))
      });

      if (response.status === 200) {
        toast.success('Order placed successfully');
        setCart([]);
        setShowCart(false);
        setCustomerName('');
        setCustomerPhone('');
      }
    } catch (error) {
      toast.error('Failed to place order');
    } finally {
      setIsOrdering(false);
    }
  };

  const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="sticky top-0 bg-white shadow-sm z-10 p-4">
        <h1 className="text-xl font-semibold text-gray-800">Menu</h1>
      </div>

      {/* Menu Items */}
      <div className="p-4 grid gap-4">
        {dishes.map((dish) => (
          <div
            key={dish.id}
            className="bg-white rounded-lg shadow-sm overflow-hidden flex"
          >
            <Image
              src={dish.dishUrl}
              alt={dish.name}
              width={300}
              height={300}
              className="w-full h-full object-cover"
            />
            <div className="p-3 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-semibold text-gray-800">{dish.name}</h3>
                <p className="text-sm text-gray-600 line-clamp-2">{dish.description}</p>
                <p className="text-orange-500 font-semibold mt-1">${dish.price.toFixed(2)}</p>
              </div>
              <button
                onClick={() => addToCart(dish)}
                className="self-end px-3 py-1 bg-orange-500 text-white rounded-full text-sm hover:bg-orange-600 transition-colors"
              >
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Cart Button */}
      {cart.length > 0 && (
        <button
          onClick={() => setShowCart(true)}
          className="fixed bottom-4 right-4 bg-orange-500 text-white p-4 rounded-full shadow-lg hover:bg-orange-600 transition-colors"
        >
          <ShoppingCart />
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center">
            {cart.reduce((sum, item) => sum + item.quantity, 0)}
          </span>
        </button>
      )}

      {/* Cart Modal */}
      {showCart && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
          <div className="fixed inset-x-0 bottom-0 bg-white rounded-t-xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white p-4 border-b">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">Your Cart</h2>
                <button onClick={() => setShowCart(false)}>
                  <X size={24} />
                </button>
              </div>
            </div>

            <div className="p-4 space-y-4">
              {cart.map((item) => (
                <div key={item.dishId} className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-sm text-gray-600">${item.price.toFixed(2)}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => updateQuantity(item.dishId, -1)}
                      className="p-1 rounded-full bg-gray-100"
                    >
                      <Minus size={16} />
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.dishId, 1)}
                      className="p-1 rounded-full bg-gray-100"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
              ))}

              <div className="border-t pt-4">
                <div className="mb-4">
                  <input
                    type="text"
                    placeholder="Your Name"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full p-2 border rounded-lg mb-2"
                  />
                  <input
                    type="tel"
                    placeholder="Phone Number"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>

                <div className="flex justify-between items-center font-semibold mb-4">
                  <span>Total Amount:</span>
                  <span>${totalAmount.toFixed(2)}</span>
                </div>

                <button
                  onClick={placeOrder}
                  disabled={isOrdering}
                  className="w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50"
                >
                  {isOrdering ? 'Placing Order...' : 'Place Order'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

