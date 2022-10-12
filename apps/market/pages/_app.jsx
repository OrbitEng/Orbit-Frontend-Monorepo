import 'styles/globals.css'
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

import { clusterApiUrl } from '@solana/web3.js';

import PhysicalMarketCtx from "@contexts/PhysicalMarketCtx";
import DigitalMarketCtx from "@contexts/DigitalMarketCtx";
import CommissionMarketCtx from '@contexts/CommissionMarketCtx';
import MarketAccountsCtx from "@contexts/MarketAccountsCtx";
import DisputeProgramCtx from "@contexts/DisputeProgramCtx";
import MatrixClientCtx from '@contexts/MatrixClientCtx';
import BundlrCtx from '@contexts/BundlrCtx';
import ProductClientCtx from '@contexts/ProductClientCtx';
import TransactionClientCtx from '@contexts/TransactionClientCtx';

import ProductCacheCtx from '@contexts/ProductCacheCtx';
import VendorCacheCtx from '@contexts/VendorCacheCtx';

// TODO: init redux here too
// App wrapper that has all these providers
function MyApp({ Component, pageProps }) {
  ///////////////////////////////////////////////////////////////////////////////////////////////////  
  // marketplace clients
  const [digitalMarketClient, setDigitalMarketClient] = useState();
  const [disputeProgramClient, setDisputeProgramClient] = useState();
  const [physicalMarketClient, setPhysicalMarketClient] = useState();
  const [productClient, setProductClient] = useState();
  const [transactionClient, setTransactionClient] = useState();
  const [commissionMarketClient, setCommissionMarketClient] = useState();
  const [marketAccountsClient, setMarketAccountsClient] = useState();
  const [bundlrClient, setBundlrClient] = useState();
  const [matrixClient, setMatrixClient] = useState();

  const [ productCache, setProductCache] = useState();
  const [ vendorCache, setVendorCache ] = useState();

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
                            <CommissionMarketCtx.Provider value={{commissionMarketClient, setCommissionMarketClient}}>
                              <ProductClientCtx.Provider value={{productClient, setProductClient}}>
                                <TransactionClientCtx.Provider value={{transactionClient, setTransactionClient}}>
                                  <BundlrCtx.Provider value={{bundlrClient, setBundlrClient}}>
                                    <ProductCacheCtx.Provider value = {{productCache, setProductCache}}>
                                      <VendorCacheCtx.Provider value={{vendorCache, setVendorCache}}>
                                        <Component {...pageProps} />
                                      </VendorCacheCtx.Provider>
                                    </ProductCacheCtx.Provider>
                                  </BundlrCtx.Provider>
                                </TransactionClientCtx.Provider>
                              </ProductClientCtx.Provider>
                            </CommissionMarketCtx.Provider>
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
