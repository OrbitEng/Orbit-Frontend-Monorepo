import Image from 'next/image'
import OrbitLogo from '../public/OrbitLogo.png'

import * as anchor from "@project-serum/anchor";

import { HeaderSearchBar } from '@includes/components/SearchBar'
import { ShoppingCartIcon } from '@heroicons/react/outline'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { useCallback, useContext, useEffect } from 'react';

const {DigitalMarketClient, PhysicalMarketClient, DisputeClient, MarketAccountsClient, CatalogClient} = require("orbit-clients")

import DigitalMarketCtx from '@contexts/DigitalMarketCtx';
import DisputeProgramCtx from '@contexts/DisputeProgramCtx';
import PhysicalMarketCtx from '@contexts/PhysicalMarketCtx';
import MarketAccountsCtx from '@contexts/MarketAccountsCtx';
import CatalogCtx from '@contexts/CatalogCtx';
import { useConnection, useWallet } from '@solana/wallet-adapter-react'


export function HomeHeader(props) {

	let {connection} = useConnection();
	let wallet = useWallet();

	const {digitalMarketClient, setDigitalMarketClient} = useContext(DigitalMarketCtx);
	const {disputeProgramClient, setDisputeProgramClient} = useContext(DisputeProgramCtx);
	const {physicalMarketClient, setPhysicalMarketClient} = useContext(PhysicalMarketCtx);
	const {marketAccountsClient, setMarketAccountsClient} = useContext(MarketAccountsCtx);
	const {catalogClient, setCatalogClient} = useContext(CatalogCtx);

	useEffect(()=>{
		if(!wallet) return;
		console.log(wallet)

		const provider =  new anchor.AnchorProvider(connection, wallet, anchor.AnchorProvider.defaultOptions());

		setDigitalMarketClient(new DigitalMarketClient(wallet, connection, provider));
		setDisputeProgramClient(new DisputeClient(wallet, connection, provider));
		setPhysicalMarketClient(new PhysicalMarketClient(wallet, connection, provider));
		setMarketAccountsClient(new MarketAccountsClient(wallet, connection, provider));
		setCatalogClient(new CatalogClient(wallet, connection, provider));

		// console.log("here", digitalMarketClient, disputeProgramClient, physicalMarketClient, marketAccountsClient, catalogClient);
	}, [])

	return(
		<header className="top-0 w-full h-14 sm:h-20 sticky flex">
			<div className="bg-gradient-r from-homeheadergray to-homeheaderpurple w-full h-full flex flex-row justify-around border-[#1A1A23] border-b-2 align-middle">
				<div className="relative basis-1/4 py-auto align-middle content-center my-2 sm:my-5 ml-2">
					<Image
						src={OrbitLogo}
						layout="fill"
						alt="The Name and Logo for the Orbit market"
						objectFit="contain"
						priority={true}
					/>
				</div>
				<div className="flex basis-1/2 align-middle content-center my-auto">
					<HeaderSearchBar />
				</div>
				<div className="flex flex-row basis-1/4 align-middle my-auto justify-center gap-4">
					<div className="border-2 border-[#1A1A23] rounded-full p-0">
						<WalletMultiButton 
							// onClick={}
						/>
					</div>
					<button className="rounded-full bg-transparent border-[#1A1A23] border-2 text-white align-middle flex my-auto p-2">
						<ShoppingCartIcon className="w-3 h-3 sm:w-4 sm:h-4" />
					</button>
				</div>
			</div>
		</header>
	)
}
