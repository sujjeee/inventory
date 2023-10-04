import '../styles/globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ClerkProvider, currentUser } from '@clerk/nextjs'
import TrpcProvider from '@/components/providers/TrpcProvider'
import { Toaster } from "@/components/ui/toaster"
import { Header } from '@/components/layout/header'
import { ThemeProvider } from '@/components/providers/theme-provider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Inventory App',
  description: 'Manage you task with ease.',
}


export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await currentUser()
  return (
    <ClerkProvider>
      <html lang="en">
        <TrpcProvider>
          <body className={inter.className}>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              {user &&
                <header className='max-w-6xl w-full px-8 mx-auto'>
                  <Header />
                </header>
              }
              {children}
              <Toaster />
            </ThemeProvider>
          </body>
        </TrpcProvider>
      </html>
    </ClerkProvider>
  )
}
