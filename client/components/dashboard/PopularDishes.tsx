export default function PopularDishes() {
  const dishes = [
    {
      name: 'Butter Chicken',
      orders: 45,
      revenue: '₹18,000',
      trend: 'up',
      image: '/dishes/butter-chicken.jpg'
    },
    {
      name: 'Paneer Tikka',
      orders: 38,
      revenue: '₹15,200',
      trend: 'up',
      image: '/dishes/paneer-tikka.jpg'
    },
    // Add more dishes as needed
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900">Popular Dishes</h2>
      </div>
      <div className="divide-y divide-gray-100">
        {dishes.map((dish) => (
          <div key={dish.name} className="p-6 flex items-center">
            <img
              src={dish.image}
              alt={dish.name}
              className="w-12 h-12 rounded-lg object-cover"
            />
            <div className="ml-4 flex-1">
              <p className="text-sm font-medium text-gray-900">{dish.name}</p>
              <p className="text-sm text-gray-500">{dish.orders} orders</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">{dish.revenue}</p>
              <div className={`flex items-center justify-end ${
                dish.trend === 'up' ? 'text-green-600' : 'text-red-600'
              }`}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                    d={dish.trend === 'up' ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"} 
                  />
                </svg>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 