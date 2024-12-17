// components/Footer.tsx
import Link from 'next/link';

const Footer = () => {
    return (
      <footer className="bg-white border-t">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Logo and Tagline */}
            <div className="flex flex-col items-center md:items-start">
              <span className="text-2xl font-bold text-orange-500">FoodEase</span>
              <p className="text-gray-600 text-sm mt-1">
                Scan. Order. Enjoy.
              </p>
            </div>
  
            {/* Quick Links */}
            <div className="flex space-x-8">
              <Link 
                href="/about" 
                className="text-gray-600 hover:text-orange-500 transition-colors"
              >
                About
              </Link>
              <Link 
                href="/contact" 
                className="text-gray-600 hover:text-orange-500 transition-colors"
              >
                LinkedIn
              </Link>
              <Link 
                href="/privacy" 
                className="text-gray-600 hover:text-orange-500 transition-colors"
              >
                Github
              </Link>
            </div>
          </div>
  
          {/* Copyright */}
          <div className="mt-8 text-center text-gray-500 text-sm">
            © {new Date().getFullYear()} FoodEase. All rights reserved.
          </div>
        </div>
      </footer>
    );
  };
  
  export default Footer;