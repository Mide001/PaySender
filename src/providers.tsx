"use client";
import '@rainbow-me/rainbowkit/styles.css';
import { useState, type ReactNode } from 'react';
import { getDefaultConfig, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import { base, baseSepolia } from "wagmi/chains";
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';


if (!process.env.NEXT_PUBLIC_WALLET_CONNECT_KEY) {
    throw new Error('Missing NEXT_PUBLIC_WALLET_CONNECT_KEY');
}


const config = getDefaultConfig({
    appName: "Cool Onchain App",
    projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_KEY || '',
    chains: [base, baseSepolia],
    ssr: true,
});

export function Providers(props: { children: ReactNode }) {
    
    const [queryClient] = useState(() => new QueryClient());
    return (
        <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
                <RainbowKitProvider>
                    {props.children}
                </RainbowKitProvider>
            </QueryClientProvider>
        </WagmiProvider>
    );
}