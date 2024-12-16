export default function RecentOrders() {
  const orders = [
    {
      id: '1',
      table: 'Table 4',
      items: ['Butter Chicken', 'Naan', 'Lassi'],
      total: '₹850',
      status: 'preparing',
      time: '5 mins ago',
    },
    {
      id: '2',
      table: 'Table 2',
      items: ['Paneer Tikka', 'Roti'],
      total: '₹450',
      status: 'served',
      time: '15 mins ago',
    },
    // Add more orders as needed
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'preparing':
        return 'bg-yellow-100 text-yellow-800';
      case 'served':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
      </div>
      <div className="divide-y divide-gray-100">
        {orders.map((order) => (
          <div key={order.id} className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">{order.table}</p>
                <p className="text-sm text-gray-500">{order.items.join(', ')}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{order.total}</p>
                <p className="text-sm text-gray-500">{order.time}</p>
              </div>
            </div>
            <div className="mt-2">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 