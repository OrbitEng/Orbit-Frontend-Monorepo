import 'styles/globals.css'
import { useEffect, useMemo, useState } from 'react';

import * as anchor from "@project-serum/anchor";
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
import { PublicKey } from '@solana/web3.js';

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

import UserAccountCtx from '@contexts/UserAccountCtx';
import MatrixClientCtx from '@contexts/MatrixClientCtx';
import BundlrCtx from '@contexts/BundlrCtx';
import PythClientCtx from '@contexts/PythClientCtx';

import ArweaveCtx from '@contexts/ArweaveCtx';

import ProductCacheCtx from '@contexts/ProductCacheCtx';
import VendorCacheCtx from '@contexts/VendorCacheCtx';

import CartCtx from '@contexts/CartCtx';
import ShippingCtx from '@contexts/ShippingCtx';
import ChatCtx from '@contexts/ChatCtx';

import ModalCtx from '@contexts/ModalCtx';
import IDBClientCtx from '@contexts/IDBClientCtx';

// TODO: init redux here too
// App wrapper that has all these providers
function MyApp({ Component, pageProps }) {
  ///////////////////////////////////////////////////////////////////////////////////////////////////  
  // marketplace clients
  
  const [bundlrClient, setBundlrClient] = useState();
  const [matrixClient, setMatrixClient] = useState();
  const [userAccount, setUserAccount] = useState();
  const [pythClient, setPythClient] = useState();
  const [arweaveClient, setArweaveClient] = useState();
  const [idbClient, setIdbClient] = useState();

  const [ productCache, setProductCache] = useState();
  const [ vendorCache, setVendorCache ] = useState();
  const [ chatState, setChatState ] = useState({
    isOpen: false,
    unRead: 5,
  });

  const [cart, setCart] = useState({
    items: []
  });

  const [shipping, setShipping] = useState({
    updated: false,
    firstName:"",
    lastName:"",
    addr1:"",
    addr2:"",
    city:"",
    zip:"",
    country:"",
    state:""
  })

  const [currentModal, setCurrentModal] = useState();

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
                  <IDBClientCtx.Provider value={{idbClient, setIdbClient}}>
                    <ModalCtx.Provider value={{currentModal, setCurrentModal}}>
                      <UserAccountCtx.Provider value={{userAccount, setUserAccount}}>
                        <BundlrCtx.Provider value={{bundlrClient, setBundlrClient}}>
                          <MatrixClientCtx.Provider value={{matrixClient, setMatrixClient}}>
                            <PythClientCtx.Provider value={{pythClient, setPythClient}}>
                              <ProductCacheCtx.Provider value = {{productCache, setProductCache}}>
                                <VendorCacheCtx.Provider value={{vendorCache, setVendorCache}}>
                                  <ShippingCtx.Provider value={{shipping, setShipping}}>
                                    <ArweaveCtx.Provider value={{arweaveClient, setArweaveClient}}>
                                      <CartCtx.Provider value={{cart, setCart}} >
                                        <ChatCtx.Provider value={{chatState, setChatState}} >
                                          <Component {...pageProps} />
                                        </ChatCtx.Provider>
                                      </CartCtx.Provider>
                                    </ArweaveCtx.Provider>
                                  </ShippingCtx.Provider>
                                </VendorCacheCtx.Provider>
                              </ProductCacheCtx.Provider>
                            </PythClientCtx.Provider>
                          </MatrixClientCtx.Provider>
                        </BundlrCtx.Provider>
                      </UserAccountCtx.Provider>
                    </ModalCtx.Provider>
                  </IDBClientCtx.Provider>
                </WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
  )
}

export default MyApp
