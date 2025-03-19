import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'GoSpin Name',
  description: 'Spin name randomly',
  generator: 'ALIF',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
