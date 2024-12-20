import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

interface RootLayoutProps {
  children: React.ReactNode;
}

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    template: '%s | FoodEase',
    default: 'FoodEase',
  },
  description: 'Streamline your restaurant operations with FoodEase',
}

export default function RootLayout({
  children,
}: RootLayoutProps) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
