import Image from 'next/image'
import OrbitLogo from '../public/OrbitLogo.png'

import * as anchor from "@project-serum/anchor";

import { Bars3CenterLeftIcon, PlusCircleIcon, EnvelopeIcon } from '@heroicons/react/24/outline'
import { WalletConnectButton, WalletModalButton, WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { useCallback, useContext, useEffect } from 'react';

const {DigitalMarketClient, PhysicalMarketClient, CommissionMarketClient, DisputeClient, MarketAccountsClient, CatalogClient} = require("orbit-clients");
const {BundlrClient, ChatClient} = require("data-transfer-clients");

import DigitalMarketCtx from '@contexts/DigitalMarketCtx';
import DisputeProgramCtx from '@contexts/DisputeProgramCtx';
import PhysicalMarketCtx from '@contexts/PhysicalMarketCtx';
import CommissionMarketCtx from '@contexts/CommissionMarketCtx';
import MarketAccountsCtx from '@contexts/MarketAccountsCtx';
import CatalogCtx from '@contexts/CatalogCtx';
import BundlrCtx from '@contexts/BundlrCtx';
import MatrixClientCtx from '@contexts/MatrixClientCtx';

import { MarketAccountFunctionalities } from '@functionalities/Accounts';

import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';

import MarketAccountButton from '@includes/components/MarketAccountButton';

export function HomeHeader(props) {
	const router = useRouter();
	let {connection} = useConnection();
	let wallet = useWallet();

	const {CreateAccount} = MarketAccountFunctionalities();

	const {digitalMarketClient, setDigitalMarketClient} = useContext(DigitalMarketCtx);
	const {disputeProgramClient, setDisputeProgramClient} = useContext(DisputeProgramCtx);
	const {physicalMarketClient, setPhysicalMarketClient} = useContext(PhysicalMarketCtx);
	const {commissionMarketClient, setCommissionMarketClient} = useContext(CommissionMarketCtx);
	const {marketAccountsClient, setMarketAccountsClient} = useContext(MarketAccountsCtx);
	const {catalogClient, setCatalogClient} = useContext(CatalogCtx);
	const {bundlrClient, setBundlrClient} = useContext(BundlrCtx);
	const {matrixClient, setMatrixClient} = useContext(MatrixClientCtx);

	const [marketAccount, setMarketAccount] = useState(undefined);

	useEffect(async ()=>{
		if(!wallet) return;

		const provider =  new anchor.AnchorProvider(connection, wallet, anchor.AnchorProvider.defaultOptions());
		setDigitalMarketClient(new DigitalMarketClient(wallet, connection, provider));
		setDisputeProgramClient(new DisputeClient(wallet, connection, provider));
		// setPhysicalMarketClient(new PhysicalMarketClient(wallet, connection, provider));
		let accounts_client = new MarketAccountsClient(wallet, connection, provider)
		setMarketAccountsClient(accounts_client);
		// setCommissionMarketClient(new CommissionMarketClient(wallet, connection, provider))
		setCatalogClient(new CatalogClient(wallet, connection, provider));
		setBundlrClient(new BundlrClient(wallet));
		setMatrixClient(new ChatClient());

		let account = await accounts_client.GetAccount(
			accounts_client.GenAccountAddress(wallet.publicKey)
		);

		if(!(account && account.data)) return;
		setMarketAccount(account)
		
	}, [])

	return(
		<header className="mx-auto max-w-7xl h-14 sm:h-32 top-0 sticky flex flex-row justify-between bg-transparent backdrop-blur z-50 overflow-visible">
			<div className="relative py-auto w-40 align-middle content-start mr-36 cursor-pointer">
				<Link href="./">
					<Image
						src={OrbitLogo}
						layout="fill"
						alt="The Name and Logo for the Orbit market"
						objectFit="contain"
						priority={true}
					/>
				</Link>
			</div>
			{props.headerMiddle}
			<div className="flex flex-row align-middle my-auto justify-end divide-x-[1px] divide-[#5E5E5E]">
				<div className="flex flex-row px-2 gap-3">
					<button
						className="rounded-lg bg-gradient-to-tr from-[#181424] via-buttontransparent2 to-buttontransparent border-t-[0.5px] border-[#474747] bg-transparent text-white align-middle flex my-auto p-2 transition hover:scale-[105%]"
						onClick={() => router.push('/sell')}
					>
						<PlusCircleIcon className="w-3 h-3 sm:w-5 sm:h-5" />
					</button>
					<button className="inline-flex relative rounded-lg bg-gradient-to-tr from-[#181424] via-buttontransparent2 to-buttontransparent border-t-[0.5px] border-[#474747] bg-transparent text-white align-middle my-auto p-2 transition hover:scale-[105%]">
						<EnvelopeIcon className="w-3 h-3 sm:w-5 sm:h-5" />
						{
							(props.notifications || props.notifications > 0) &&
							<div className="inline-flex absolute font-serif bg-red-500 -top-1 -right-1 h-4 w-4 rounded-full justify-center items-center text-xs">{props.notifications > 999 ? "+999" : props.notifications}</div>
						}
					</button>
				</div>
				<div className="flex flex-row px-2 gap-3">
					<div className="bg-gradient-to-tr from-[#181424] via-buttontransparent2 to-buttontransparent border-t-[0.5px] border-[#474747] rounded-full transition hover:scale-[102%]">
						{
							!wallet.connected ? ( 
								<WalletMultiButton />
							) : (
								<MarketAccountButton />
							)
						}
					</div>
					<button className="rounded-lg bg-gradient-to-tr from-[#181424] via-buttontransparent2 to-buttontransparent border-t-[0.5px] border-[#474747] bg-transparent text-white align-middle flex my-auto p-2 transition hover:scale-[105%]">
						<Bars3CenterLeftIcon className="w-3 h-3 sm:w-5 sm:h-5" />
					</button>
				</div>
			</div>
		</header>
	)
}
