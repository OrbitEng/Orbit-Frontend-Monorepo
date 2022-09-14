import 'styles/globals.css'
import * as anchor from "@project-serum/anchor"
import { useMemo, useState } from 'react';

import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
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

import { 
  createDefaultAddressSelector,
  createDefaultAuthorizationResultCache,
  SolanaMobileWalletAdapter,
} from '@solana-mobile/wallet-adapter-mobile';

import { useConnection, useWallet } from '@solana/wallet-adapter-react'

import { clusterApiUrl, Connection } from '@solana/web3.js';

import PhysicalMarketCtx from "@contexts/PhysicalMarketCtx";
import DigitalMarketCtx from "@contexts/DigitalMarketCtx";
import MarketAccountsCtx from "@contexts/MarketAccountsCtx";
import DisputeProgramCtx from "@contexts/DisputeProgramCtx";
import CatalogCtx from "@contexts/CatalogCtx";
import MatrixClientCtx from '@contexts/MatrixClientCtx';
import BundlrCtx from '@contexts/BundlrCtx';

import {DigitalMarketClient, DisputeClient, PhysicalMarketClient, MarketAccountsClient, CatalogClient } from "orbit-clients";
import {BundlrClient, ChatClient} from "data-transfer-clients";
import { useEffect } from 'react';


// TODO: init redux here too
// App wrapper that has all these providers
function MyApp({ Component, pageProps }) {
  
  const [connection, setConnection] = useState(new Connection( "https://api.devnet.solana.com"));
  const [defaultProvider, setProvider] = useState(new anchor.AnchorProvider(
      connection,
      {}
  ));

  ///////////////////////////////////////////////////////////////////////////////////////////////////  
  // marketplace clients
  const [digitalMarketClient, setDigitalMarketClient] = useState();
  const [disputeProgramClient, setDisputeProgramClient] = useState();
  const [physicalMarketClient, setPhysicalMarketClient] = useState();
  const [marketAccountsClient, setMarketAccountsClient] = useState();
  const [catalogClient, setCatalogClient] = useState();
  const [bundlrClient, setBundlrClient] = useState();
  const [matrixClient, setMatrixClient] = useState();

  useEffect(()=>{
      setDigitalMarketClient(new DigitalMarketClient(undefined, connection, defaultProvider));
      setDisputeProgramClient(new DisputeClient(undefined, connection, defaultProvider));
      setPhysicalMarketClient(new PhysicalMarketClient(undefined, connection, defaultProvider));
      setMarketAccountsClient(new MarketAccountsClient(undefined, connection, defaultProvider));
      setCatalogClient(new CatalogClient(undefined, connection, defaultProvider));
      setBundlrClient(new BundlrClient(undefined, connection, defaultProvider));
      setMatrixClient(new ChatClient(undefined, connection, defaultProvider));
  }, [])

  ///////////////////////////////////////////////////////////////////////////////////////////////////  
  // Solana wallet
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
                  <MatrixClientCtx.Provider value={{matrixClient, setMatrixClient}}>
                    <PhysicalMarketCtx.Provider value={{physicalMarketClient, setPhysicalMarketClient}}>
                      <DigitalMarketCtx.Provider value={{digitalMarketClient, setDigitalMarketClient}}>
                        <MarketAccountsCtx.Provider value={{marketAccountsClient, setMarketAccountsClient}}>
                          <DisputeProgramCtx.Provider value={{disputeProgramClient, setDisputeProgramClient}}>
                            <CatalogCtx.Provider value={{catalogClient, setCatalogClient}}>
                              <BundlrCtx.Provider value={{bundlrClient, setBundlrClient}}>
                                <Component {...pageProps} />
                              </BundlrCtx.Provider>
                            </CatalogCtx.Provider>
                          </DisputeProgramCtx.Provider>
                        </MarketAccountsCtx.Provider>
                      </DigitalMarketCtx.Provider>
                    </PhysicalMarketCtx.Provider>
                  </MatrixClientCtx.Provider>
                </WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
  )
}

export default MyApp
