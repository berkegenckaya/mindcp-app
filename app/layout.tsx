import type { Metadata } from 'next'
import {DM_Sans} from 'next/font/google'
import './globals.css'
import { AppSidebar } from '@/components/app-sidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import WalletProvider from './wallet-provider';
import { Head } from 'react-day-picker';
import Header from '@/components/header';

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

const space = DM_Sans({
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

      <body className={`${space.className} bg-[#1b1a1a] overflow-auto text-white`}>
         <link
          rel="icon"
          href="/f5.png"
          type="image/png"
        />
        <WalletProvider>
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset className="overflow-auto">
              <Header />
        {children}
       
        </SidebarInset>
        </SidebarProvider>
         </WalletProvider>
        </body>
    </html>
  )
}
