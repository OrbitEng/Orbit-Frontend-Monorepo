import olmWasmPath from '@matrix-org/olm/olm.wasm'
import Olm from '@matrix-org/olm'
import 'styles/globals.css'
import { useMemo, useState } from 'react';
import * as sdk from 'matrix-js-sdk';

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

const fs = require("fs");

import PhysicalMarketCtx from "@contexts/PhysicalMarketCtx";
import DigitalMarketCtx from "@contexts/DigitalMarketCtx";
import MarketAccountsCtx from "@contexts/MarketAccountsCtx";
import DisputeProgramCtx from "@contexts/DisputeProgramCtx";
import CatalogCtx from "@contexts/CatalogCtx";
import MatrixClientCtx from '@contexts/MatrixClientCtx';
import BundlrCtx from '@contexts/BundlrCtx';

// TODO: init redux here too
// App wrapper that has all these providers
function MyApp({ Component, pageProps }) {
  ///////////////////////////////////////////////////////////////////////////////////////////////////  
  // marketplace clients
  const [digitalMarketClient, setDigitalMarketClient] = useState();
  const [disputeProgramClient, setDisputeProgramClient] = useState();
  const [physicalMarketClient, setPhysicalMarketClient] = useState();
  const [marketAccountsClient, setMarketAccountsClient] = useState();
  const [catalogClient, setCatalogClient] = useState();
  const [bundlrClient, setBundlrClient] = useState();

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

  ///////////////////////////////////////////////////////////////////////////////////////////////////  
  // Chat Client (this init one is just used for login)
  const matrixClient = sdk.createClient('https://matrix.org')
  function loadOlm() {
    /* Load Olm. We try the WebAssembly version first, and then the legacy,
     * asm.js version if that fails. For this reason we need to wait for this
     * to finish before continuing to load the rest of the app. In future
     * we could somehow pass a promise down to react-sdk and have it wait on
     * that so olm can be loading in parallel with the rest of the app.
     *
     * We also need to tell the Olm js to look for its wasm file at the same
     * level as index.html. It really should be in the same place as the js,
     * ie. in the bundle directory, but as far as I can tell this is
     * completely impossible with webpack. We do, however, use a hashed
     * filename to avoid caching issues.
     */

    return Olm.init({
        locateFile: () => window.location.href + olmWasmPath.replace("/_next",""),
    }).then(() => {
        console.log("Using WebAssembly Olm");
    }).catch((wasmLoadError) => {
        console.log("Failed to load Olm: trying legacy version", wasmLoadError);
        return new Promise((resolve, reject) => {
            const s = document.createElement('script');
            s.src = 'olm_legacy.js'; // XXX: This should be cache-busted too
            s.onload = resolve;
            s.onerror = reject;
            document.body.appendChild(s);
        }).then(() => {
            // Init window.Olm, ie. the one just loaded by the script tag,
            // not 'Olm' which is still the failed wasm version.
            return window.Olm.init();
        }).then(() => {
            console.log("Using legacy Olm");
        }).catch((legacyLoadError) => {
            console.log("Both WebAssembly and asm.js Olm failed!", legacyLoadError);
        });
    });
  };
  loadOlm();
  

  return (
          <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={wallets} autoConnect>
                <WalletModalProvider>
                  <MatrixClientCtx.Provider value={matrixClient}>
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
