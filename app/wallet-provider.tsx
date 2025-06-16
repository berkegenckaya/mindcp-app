'use client'
import '@rainbow-me/rainbowkit/styles.css';
import {
  darkTheme,
  getDefaultConfig,
  lightTheme,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import {
  mainnet,

  base,
} from 'wagmi/chains';
import {
  QueryClientProvider,
  QueryClient,
} from '@tanstack/react-query';

const config = getDefaultConfig({
  appName: 'My RainbowKit App',
  projectId: 'YOUR_PROJECT_ID', // WalletConnect project ID
  chains: [mainnet, base],
  ssr: true, // If your dApp uses server side rendering (SSR)
});

const queryClient = new QueryClient();

const WalletProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          locale="en-US"
          theme={lightTheme({
            accentColor: "#ECEAFF", 
      accentColorForeground: "#000",
      borderRadius: "medium",
      fontStack: "system",
      overlayBlur: "small",
          })}
        >
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};

export default WalletProvider;