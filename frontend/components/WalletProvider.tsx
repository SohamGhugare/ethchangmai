'use client';

import { createContext, useContext, useState, useCallback, PropsWithChildren } from 'react';

interface WalletContextType {
  connected: boolean;
  account: { address: string } | null;
  network: { name: string } | null;
  connect: (walletName: string) => Promise<void>;
  disconnect: () => void;
  signAndSubmitTransaction: (transaction: any) => Promise<{ hash: string }>;
  wallets: { name: string; icon: string }[];
}

const WalletContext = createContext<WalletContextType | null>(null);

// ETH wallet options
const ETH_WALLETS = [
  { name: 'MetaMask', icon: 'https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg' },
  { name: 'Coinbase Wallet', icon: 'https://altcoinsbox.com/wp-content/uploads/2022/12/coinbase-wallet-logo.png' },
  { name: 'WalletConnect', icon: 'https://altcoinsbox.com/wp-content/uploads/2023/04/wallet-connect-logo.png' },
  { name: 'Trust Wallet', icon: 'https://trustwallet.com/assets/images/media/assets/TWT.png' },
];

// Generate a random ETH-like address
function generateEthAddress(): string {
  const chars = '0123456789abcdef';
  let address = '0x';
  for (let i = 0; i < 40; i++) {
    address += chars[Math.floor(Math.random() * chars.length)];
  }
  return address;
}

// Generate a random transaction hash
function generateTxHash(): string {
  const chars = '0123456789abcdef';
  let hash = '0x';
  for (let i = 0; i < 64; i++) {
    hash += chars[Math.floor(Math.random() * chars.length)];
  }
  return hash;
}

export function WalletProvider({ children }: PropsWithChildren) {
  const [connected, setConnected] = useState(false);
  const [account, setAccount] = useState<{ address: string } | null>(null);
  const [network, setNetwork] = useState<{ name: string } | null>({ name: 'Sepolia' });

  const connect = useCallback(async (walletName: string) => {
    // Simulate connection delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Check if there's a stored address in localStorage
    let address = localStorage.getItem('eth_wallet_address');
    if (!address) {
      address = generateEthAddress();
      localStorage.setItem('eth_wallet_address', address);
    }

    setAccount({ address });
    setConnected(true);
    console.log(`Connected to ${walletName}`);
  }, []);

  const disconnect = useCallback(() => {
    setAccount(null);
    setConnected(false);
    localStorage.removeItem('eth_wallet_address');
  }, []);

  const signAndSubmitTransaction = useCallback(async (transaction: any) => {
    // Simulate transaction signing and submission
    await new Promise(resolve => setTimeout(resolve, 1500));

    const hash = generateTxHash();
    console.log('Transaction submitted:', hash);

    return { hash };
  }, []);

  return (
    <WalletContext.Provider
      value={{
        connected,
        account,
        network,
        connect,
        disconnect,
        signAndSubmitTransaction,
        wallets: ETH_WALLETS,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}
