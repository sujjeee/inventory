import '../styles/globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'
import TrpcProvider from '@/components/providers/TrpcProvider'
import { Toaster } from "@/components/ui/toaster"
import { Header } from '@/components/layout/header'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Inventory App',
  description: 'Manage you task with ease.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <TrpcProvider>
          <body className={inter.className}>
            <header className='max-w-6xl w-full px-8 mx-auto'>
              <Header />
            </header>
            {children}
          </body>
          <Toaster />
        </TrpcProvider>
      </html>
    </ClerkProvider>
  )
}
