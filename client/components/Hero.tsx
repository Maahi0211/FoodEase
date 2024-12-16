export default function Hero() {
    return (
      <section className="min-h-screen pt-28 pb-20 bg-gradient-to-b from-orange-50 to-white relative overflow-hidden">
        {/* Animated background blobs */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
          <div className="blob-1 absolute w-[800px] h-[800px] rounded-full bg-orange-100/50 -top-[400px] -left-[400px] animate-blob"></div>
          <div className="blob-2 absolute w-[600px] h-[600px] rounded-full bg-orange-200/30 top-[20%] -right-[300px] animate-blob animation-delay-2000"></div>
          <div className="blob-3 absolute w-[500px] h-[500px] rounded-full bg-orange-100/40 -bottom-[250px] left-[20%] animate-blob animation-delay-4000"></div>
        </div>
  
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            {/* Left side - Content */}
            <div className="flex-1 text-center lg:text-left">
              <h1 className="text-6xl font-bold text-gray-900 mb-8 leading-tight">
                Order Smarter with
                <span className="text-orange-500 block">QR-Powered Dining</span>
              </h1>
              <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto lg:mx-0">
                Transform your dining experience with our contactless QR ordering system.
                No apps needed, just scan and enjoy!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <button className="px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-full text-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-200 shadow-lg hover:shadow-orange-200 transform hover:-translate-y-1">
                  Get Started Free
                </button>
                <button className="px-8 py-4 bg-white text-orange-500 rounded-full text-lg border-2 border-orange-500 hover:bg-orange-50 transition-all duration-200 flex items-center justify-center gap-2">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Watch Demo
                </button>
              </div>
              <div className="mt-12 flex gap-8 text-sm text-gray-500 justify-center lg:justify-start">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Free of Cost
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Easy Setup
                </div>
              </div>
            </div>
  
            {/* Right side - Image */}
            <div className="flex-1 relative">
              <div className="relative w-full aspect-square max-w-[600px] mx-auto">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-orange-600/10 rounded-full animate-pulse"></div>
                <img 
                  src="/hero-image.jpg" 
                  alt="Restaurant QR Ordering" 
                  className="relative z-10 w-full h-full object-cover animate-float"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }