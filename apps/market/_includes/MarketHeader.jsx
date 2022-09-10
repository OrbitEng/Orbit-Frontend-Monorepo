import Image from 'next/image'
import OrbitLogo from '../public/OrbitLogo.png'

import * as anchor from "@project-serum/anchor";

import { HeaderSearchBar } from '@includes/components/SearchBar'
import { Bars3CenterLeftIcon, PlusCircleIcon, EnvelopeIcon } from '@heroicons/react/24/outline'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { useCallback, useContext, useEffect } from 'react';

const {DigitalMarketClient, PhysicalMarketClient, DisputeClient, MarketAccountsClient, CatalogClient} = require("orbit-clients");
const {BundlrClient, ChatClient} = require("data-transfer-clients");

import DigitalMarketCtx from '@contexts/DigitalMarketCtx';
import DisputeProgramCtx from '@contexts/DisputeProgramCtx';
import PhysicalMarketCtx from '@contexts/PhysicalMarketCtx';
import MarketAccountsCtx from '@contexts/MarketAccountsCtx';
import CatalogCtx from '@contexts/CatalogCtx';
import BundlrCtx from '@contexts/BundlrCtx';
import MatrixClientCtx from '@contexts/MatrixClientCtx';
import { useConnection, useWallet } from '@solana/wallet-adapter-react'


export function HomeHeader(props) {

	let {connection} = useConnection();
	let wallet = useWallet();

	const {digitalMarketClient, setDigitalMarketClient} = useContext(DigitalMarketCtx);
	const {disputeProgramClient, setDisputeProgramClient} = useContext(DisputeProgramCtx);
	const {physicalMarketClient, setPhysicalMarketClient} = useContext(PhysicalMarketCtx);
	const {marketAccountsClient, setMarketAccountsClient} = useContext(MarketAccountsCtx);
	const {catalogClient, setCatalogClient} = useContext(CatalogCtx);
	const {bundlrClient, setBundlrClient} = useContext(BundlrCtx);
	const {matrixClient, setMatrixClient} = useContext(MatrixClientCtx);

	useEffect(async ()=>{
		if(!wallet) return;

		const provider =  new anchor.AnchorProvider(connection, wallet, anchor.AnchorProvider.defaultOptions());

		const acc_client = new MarketAccountsClient(wallet, connection, provider);
		setMarketAccountsClient(acc_client);
		let load_acc_addr = acc_client.LoadAccountAddress();
		let load_auth = acc_client.LoadMasterAuth();
		setDigitalMarketClient(new DigitalMarketClient(wallet, connection, provider));
		setDisputeProgramClient(new DisputeClient(wallet, connection, provider));
		setPhysicalMarketClient(new PhysicalMarketClient(wallet, connection, provider));
		

		load_acc_addr = await load_acc_addr;
		load_auth = await load_auth;

		setCatalogClient(new CatalogClient(wallet, connection, provider));
		setBundlrClient(new BundlrClient(wallet));

		if(load_auth){
			let chat_client = new ChatClient(load_auth);
			setMatrixClient(chat_client);
			await chat_client.Login();
			await chat_client.Sync();
		}
		
	}, [])

	return(
		<header className="mx-auto max-w-7xl h-14 sm:h-32 top-0 sticky flex flex-row justify-between bg-transparent">
			<div className="relative py-auto w-40 align-middle content-start mr-36">
				<Image
					src={OrbitLogo}
					layout="fill"
					alt="The Name and Logo for the Orbit market"
					objectFit="contain"
					priority={true}
				/>
			</div>
			{props.headerMiddle}
			<div className="flex flex-row align-middle my-auto justify-end divide-x-[1px] divide-[#5E5E5E]">
				<div className="flex flex-row px-2 gap-3">
					<button className="rounded-lg bg-gradient-to-tr from-[#181424] via-buttontransparent2 to-buttontransparent border-t-[0.5px] border-[#474747] bg-transparent text-white align-middle flex my-auto p-2">
						<PlusCircleIcon className="w-3 h-3 sm:w-5 sm:h-5" />
					</button>
					<button className="rounded-lg bg-gradient-to-tr from-[#181424] via-buttontransparent2 to-buttontransparent border-t-[0.5px] border-[#474747] bg-transparent text-white align-middle flex my-auto p-2">
						<EnvelopeIcon className="w-3 h-3 sm:w-5 sm:h-5" />
					</button>
				</div>
				<div className="flex flex-row px-2 gap-3">
					<div className="bg-gradient-to-tr from-[#181424] via-buttontransparent2 to-buttontransparent border-t-[0.5px] border-[#474747] rounded-full">
						<WalletMultiButton 
							// onClick={}
						/>
					</div>
					<button className="rounded-lg bg-gradient-to-tr from-[#181424] via-buttontransparent2 to-buttontransparent border-t-[0.5px] border-[#474747] bg-transparent text-white align-middle flex my-auto p-2">
						<Bars3CenterLeftIcon className="w-3 h-3 sm:w-5 sm:h-5" />
					</button>
				</div>
			</div>
		</header>
	)
}
