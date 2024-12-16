export default function HowItWorks() {
  const steps = [
    {
      number: "1",
      title: "Sign Up",
      description: "Create your restaurant account in minutes with simple verification process"
    },
    {
      number: "2",
      title: "Generate QR Codes",
      description: "Create unique QR codes for each table and print them instantly"
    },
    {
      number: "3",
      title: "Add Your Menu",
      description: "Upload your menu items with prices, images, and descriptions"
    },
    {
      number: "4",
      title: "Start Taking Orders",
      description: "Begin receiving digital orders from your customers instantly"
    }
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-orange-50 to-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-8">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Get Started in Minutes
          </h2>
          <p className="text-xl text-gray-600">
            Setting up FoodEase for your restaurant is quick and seamless
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-8 relative">
          {/* Connecting line */}
          <div className="hidden md:block absolute top-[45%] left-0 w-full h-0.5 bg-orange-200 -z-10"></div>

          {steps.map((step, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-2xl hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-orange-100/50"
            >
              <div className="bg-gradient-to-r from-orange-500 to-orange-600 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-6 text-xl font-bold text-white shadow-lg shadow-orange-100">
                {step.number}
              </div>
              <h3 className="text-xl font-semibold mb-4 text-center text-gray-900">
                {step.title}
              </h3>
              <p className="text-gray-600 text-center leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <button className="px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-full text-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-200 shadow-lg hover:shadow-orange-200 transform hover:-translate-y-1">
            Create Your Account
          </button>
          <p className="mt-4 text-gray-500">
            Free of Cost
          </p>
        </div>
      </div>

      {/* Background decoration */}
      <div className="absolute top-0 right-0 -z-10 opacity-10">
        <svg width="400" height="400" viewBox="0 0 200 200">
          <path
            fill="#f97316"
            d="M47.1,-57.7C59.9,-45.7,68.5,-29.2,71.5,-11.5C74.4,6.3,71.8,25.2,62.4,39.8C53,54.4,36.9,64.6,19.1,69.7C1.3,74.8,-18.1,74.8,-33.6,67.3C-49.1,59.8,-60.6,44.7,-68.3,27.3C-75.9,9.9,-79.7,-9.8,-73.5,-25.8C-67.3,-41.8,-51.2,-54.1,-35.1,-64.8C-19,-75.6,-2.9,-84.8,10.8,-81.9C24.5,-79,34.3,-69.7,47.1,-57.7Z"
            transform="translate(100 100)"
          />
        </svg>
      </div>
    </section>
  );
}