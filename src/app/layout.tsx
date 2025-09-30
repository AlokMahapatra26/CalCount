import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Header } from '@/components/navigation/header'
import { BottomNavigation } from '@/components/navigation/bottom-navigation'
import { Toaster } from 'sonner'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Calcount - Nutrition Tracker',
  description: 'Track your daily nutrition offline with Calcount',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Header />
        <main className="pb-16 min-h-[calc(100vh-3.5rem)] bg-background">
          {children}
        </main>
        <BottomNavigation />
        <Toaster />
      </body>
    </html>
  )
}
