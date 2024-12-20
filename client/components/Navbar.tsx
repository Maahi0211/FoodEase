import Link from "next/link"
import Image from 'next/image';

export default function Navbar() {
    return (
      <nav className="fixed w-[90%] left-1/2 -translate-x-1/2 top-4 bg-white/80 backdrop-blur-md shadow-lg z-50 rounded-2xl">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold text-orange-500 flex items-center gap-2">
              <Image 
                src="/logo.png" 
                alt="FoodEase Logo"
                width={40}
                height={40}
                className="w-10"
              />
              FoodEase
            </div>
            <div className="hidden md:flex space-x-8">
              <a href="#" className="text-gray-700 hover:text-orange-500 transition-colors">Home</a>
              <a href="#" className="text-gray-700 hover:text-orange-500 transition-colors">Features</a>
              <a href="#" className="text-gray-700 hover:text-orange-500 transition-colors">How It Works</a>
            </div>
            <div className="space-x-4">
              <Link href="/login">
              <button className="px-4 py-2 text-orange-500 hover:text-orange-600 font-medium">Login</button></Link>
              <Link href="/signup">
              <button className="px-6 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-full hover:from-orange-600 hover:to-orange-700 transition-all duration-200 shadow-lg hover:shadow-orange-200">
                Sign Up
              </button>
              </Link>
              
            </div>
          </div>
        </div>
      </nav>
    );
  }