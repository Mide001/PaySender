import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Providers } from '@/providers'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'PaySender',
  description: 'The Lagos Onchain Summit is a conference for blockchain enthusiasts in Lagos, Nigeria.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true} className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
