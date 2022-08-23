import 'styles/globals.css'
import { useMemo, useState } from 'react';

import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react'
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import {
  CoinbaseWalletAdapter,
  GlowWalletAdapter,
  PhantomWalletAdapter,
  SlopeWalletAdapter,
  SolflareWalletAdapter,
  SolletExtensionWalletAdapter,
  SolletWalletAdapter,
  TorusWalletAdapter,
  TokenaryWalletAdapter,
} from '@solana/wallet-adapter-wallets';
import {
  WalletModalProvider,
  WalletDisconnectButton,
  WalletMultiButton
} from '@solana/wallet-adapter-react-ui';
import { clusterApiUrl } from '@solana/web3.js';
import { 
  createDefaultAddressSelector,
  createDefaultAuthorizationResultCache,
  SolanaMobileWalletAdapter,
} from '@solana-mobile/wallet-adapter-mobile';

import PhysicalMarketCtx from "@contexts/PhysicalMarketCtx";
import DigitalMarketCtx from "@contexts/DigitalMarketCtx";
import MarketAccountsCtx from "@contexts/MarketAccountsCtx";
import DisputeProgramCtx from "@contexts/DisputeProgramCtx";

// TODO: init redux here too
// App wrapper that has all these providers
function MyApp({ Component, pageProps }) {
  
  const [digitalMarketClient, setDigitalMarketClient] = useState();
  const [disputeProgramClient, setDisputeProgramClient] = useState();
  const [physicalMarketClient, setPhysicalMarketClient] = useState();
  const [marketAccountsClient, setMarketAccountsClient] = useState();

  const network = WalletAdapterNetwork.Devnet;

  const endpoint = useMemo(() => clusterApiUrl(network), [network]);
  const wallets = useMemo(
      () => [
        new CoinbaseWalletAdapter(),
        new GlowWalletAdapter(),
        new PhantomWalletAdapter(),
        new SolflareWalletAdapter(),
        new SolletExtensionWalletAdapter(),
        new SolletWalletAdapter(),
        new TorusWalletAdapter(),
        new TokenaryWalletAdapter(),
        // @ts-ignore (why does this complain but compiles???)
        new SolanaMobileWalletAdapter({
          addressSelector: createDefaultAddressSelector(),
          appIdentity: {
            name: 'Orbit',
            uri: 'https://',
            icon: './OrbitLogo.png'
          },
          authorizationResultCache: createDefaultAuthorizationResultCache(),
        })
      ],
      []
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={wallets} autoConnect>
                <WalletModalProvider>
                
                <PhysicalMarketCtx.Provider value={{physicalMarketClient, setPhysicalMarketClient}}>
                  <DigitalMarketCtx.Provider value={{digitalMarketClient, setDigitalMarketClient}}>
                    <MarketAccountsCtx.Provider value={{marketAccountsClient, setMarketAccountsClient}}>
                      <DisputeProgramCtx.Provider value={{disputeProgramClient, setDisputeProgramClient}}>

                        <Component {...pageProps} />

                      </DisputeProgramCtx.Provider>
                    </MarketAccountsCtx.Provider>
                  </DigitalMarketCtx.Provider>
                </PhysicalMarketCtx.Provider>
                
                </WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
  )
}

export default MyApp
