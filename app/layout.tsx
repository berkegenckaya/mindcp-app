import type { Metadata } from 'next'
import {Space_Grotesk} from 'next/font/google'
import './globals.css'
import { AppSidebar } from '@/components/app-sidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import WalletProvider from './wallet-provider';

export const metadata: Metadata = {
  title: 'MindCP Neural Dashboard',
  keywords: ['AI', 'Neural Networks', 'Dashboard', 'MindCP'],
  authors: [{ name: 'MindCP Team', url: 'https://mindcp.ai' }],
  creator: 'MindCP Team',
  openGraph: {
    title: 'MindCP Neural Dashboard',
    description: 'Manage your AI agents and neural networks with MindCP',
    url: 'https://dashboard.mindcp.ai',
  },
  description: 'Manage your AI agents and neural networks with MindCP',
}

const space = Space_Grotesk({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});




export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">

      <body className={`${space.className}`}>
         <link
          rel="icon"
          href="/f5.png"
          type="image/png"
        />
        <WalletProvider>
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
        {children}
       
        </SidebarInset>
        </SidebarProvider>
         </WalletProvider>
        </body>
    </html>
  )
}
