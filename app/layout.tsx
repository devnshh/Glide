import type { Metadata, Viewport } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'

import './globals.css'
import { AppProvider } from '@/lib/app-context'
import { WebSocketProvider } from '@/lib/websocket-context'
import Silk from '@/components/ui/silk'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
})

export const metadata: Metadata = {
  title: 'Glide',
  description: 'Premium gesture-based desktop control with real-time WebSocket updates',
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon.ico', sizes: '32x32' },
    ],
    apple: '/apple-touch-icon.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#1a1a2e',
  width: 'device-width',
  initialScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body suppressHydrationWarning className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased bg-transparent text-foreground min-h-screen`}>
        {/* Silk Background */}
        <div className="fixed inset-0 -z-10 h-full w-full">
          <Silk
            speed={2.8}
            scale={0.6}
            color="#301088ff" // RGB(87,35,231)
            noiseIntensity={2.5}
            rotation={0}
          />
        </div>

        <AppProvider>
          <WebSocketProvider>
            {children}
          </WebSocketProvider>
        </AppProvider>
      </body>
    </html>
  )
}
