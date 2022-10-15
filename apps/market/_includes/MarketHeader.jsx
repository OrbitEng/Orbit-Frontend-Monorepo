import Image from 'next/image'
import OrbitLogo from '../public/OrbitLogo.png'

import * as anchor from "@project-serum/anchor";

import { Bars3CenterLeftIcon, PlusCircleIcon, EnvelopeIcon, ShoppingCartIcon } from '@heroicons/react/24/outline'
import { WalletConnectButton, WalletModalButton, WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { useCallback, useContext, useEffect } from 'react';

const {DigitalMarketClient, PhysicalMarketClient, CommissionMarketClient, DisputeClient, MarketAccountsClient, ProductClient, TransactionClient} = require("orbit-clients");
const {BundlrClient, ChatClient} = require("data-transfer-clients");

import DigitalMarketCtx from '@contexts/DigitalMarketCtx';
import DisputeProgramCtx from '@contexts/DisputeProgramCtx';
import PhysicalMarketCtx from '@contexts/PhysicalMarketCtx';
import CommissionMarketCtx from '@contexts/CommissionMarketCtx';
import ProductClientCtx from '@contexts/ProductClientCtx';
import TransactionClientCtx from '@contexts/TransactionClientCtx';
import MarketAccountsCtx from '@contexts/MarketAccountsCtx';
import BundlrCtx from '@contexts/BundlrCtx';
import MatrixClientCtx from '@contexts/MatrixClientCtx';

import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';

import CreateAccountButton from '@includes/components/CreateAccountButton';
import ProfileButton from '@includes/components/ProfileButton';
import CartSideMenu from './components/CartSideMenu';
import CartCtx from '@contexts/CartCtx';

export function HomeHeader(props) {
	// things for demoing cart funcs
	let cartItems = [{
		name:"100 Icon pack",
		vendorUserName:"@testing123",
		image:"/demologos.png",
		price: 12340000000,
	},
	{
		name:"100 Icon pack",
		vendorUserName:"@testing123",
		image:"/demologos.png",
		price: 12340000000,
	},
	{
		name:"100 Icon pack",
		vendorUserName:"@testing123",
		image:"/demologos.png",
		price: 12340000000,
	}];

	const router = useRouter();
	let {connection} = useConnection();
	let wallet = useWallet();

	const {digitalMarketClient, setDigitalMarketClient} = useContext(DigitalMarketCtx);
	const {disputeProgramClient, setDisputeProgramClient} = useContext(DisputeProgramCtx);
	const {physicalMarketClient, setPhysicalMarketClient} = useContext(PhysicalMarketCtx);
	const {commissionMarketClient, setCommissionMarketClient} = useContext(CommissionMarketCtx);
	const {marketAccountsClient, setMarketAccountsClient} = useContext(MarketAccountsCtx);
	const {bundlrClient, setBundlrClient} = useContext(BundlrCtx);
	const {matrixClient, setMatrixClient} = useContext(MatrixClientCtx);
	const {productClient, setProductClient} = useContext(ProductClientCtx);
	const {transactionClient, setTransactionClient} = useContext(TransactionClientCtx);

	const [marketAccount, setMarketAccount] = useState(undefined);
	const [menuOpen, setMenuOpen] = useState(false);

	const {cart, setCart} = useContext(CartCtx);
	const Notifications = 5;
	useEffect(() => {
		console.log("CART:\n" + JSON.stringify(cart));
	}, [cart.items])

	useEffect(async ()=>{
		let temp_wallet = wallet;
		if(!(wallet && wallet.publicKey)) {
			temp_wallet = {};
		}

		const provider =  new anchor.AnchorProvider(connection, wallet, anchor.AnchorProvider.defaultOptions());

		let accounts_client = new MarketAccountsClient(wallet, connection, provider);
		let account_address = "";
		if (wallet && wallet.publicKey){
			account_address = (accounts_client.GenAccountAddress(wallet.publicKey));
		}
		try{
			if(account_address != ""){
				let account = await accounts_client.GetAccount(account_address);
				if(!(account && account.data)){
					
				}else{
					console.log(account);
					setMarketAccount(account)
				}
			}
		}catch(e){
			
		}

		setDigitalMarketClient(new DigitalMarketClient(wallet, connection, provider));
		setDisputeProgramClient(new DisputeClient(wallet, connection, provider));
		setPhysicalMarketClient(new PhysicalMarketClient(wallet, connection, provider));
		setCommissionMarketClient(new CommissionMarketClient(wallet, connection, provider))
		setProductClient(new ProductClient(wallet, connection, provider));
		setTransactionClient(new TransactionClient(wallet, connection, provider));
		setBundlrClient(new BundlrClient(wallet));
		setMatrixClient(new ChatClient());

		setMarketAccountsClient(accounts_client);
		
	}, [wallet.connected])

	return(
		<header className="mx-auto max-w-7xl h-14 lg:h-32 top-0 sticky flex flex-row justify-between bg-transparent backdrop-blur z-50 overflow-visible w-full">
			<div className="relative py-auto w-40 align-middle content-start cursor-pointer">
				<Link href="/">
					<div className="">
						<Image
							src={OrbitLogo}
							layout="fill"
							alt="The Name and Logo for the Orbit market"
							objectFit="contain"
							priority={true}
						/>
					</div>
				</Link>
			</div>
			{props.headerMiddle}
			<div className="flex flex-row align-middle my-auto justify-end divide-x-[1px] divide-[#5E5E5E] z-[60] w-40">
				<div className="flex flex-row px-2 gap-3">
					<button
						className="rounded-lg bg-gradient-to-tr from-[#181424] via-buttontransparent2 to-buttontransparent border-t-[0.5px] border-[#474747] bg-transparent text-white align-middle flex my-auto p-2 transition hover:scale-[105%]"
						onClick={() => router.push("sell")}
					>
						<PlusCircleIcon className="w-3 h-3 lg:w-5 lg:h-5" />
					</button>
					<button className="inline-flex relative rounded-lg bg-gradient-to-tr from-[#181424] via-buttontransparent2 to-buttontransparent border-t-[0.5px] border-[#474747] bg-transparent text-white align-middle my-auto p-2 transition hover:scale-[105%]">
						<EnvelopeIcon className="w-3 h-3 lg:w-5 lg:h-5" />
						{

							<span className="absolute top-0 right-0 inline-flex items-center justify-center px-[5px] py-[3px] text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full">
								{Notifications > 999 ? "+999" : Notifications}
							</span>
						}
					</button>
				</div>
				<div className="flex flex-row px-2 gap-3">
					<div className="bg-gradient-to-tr from-[#181424] via-buttontransparent2 to-buttontransparent border-t-[0.5px] border-[#474747] rounded-full">
						{
							!wallet.connected ? ( 
								<WalletMultiButton />
							) : (
								marketAccount ? <ProfileButton setMarketAccount={setMarketAccount} /> :
								// add market account set here
								<CreateAccountButton setMarketAccount={setMarketAccount} connectedWallet={wallet}/>
							)
						}
					</div>
					<button
						className="inline-flex relative rounded-lg bg-gradient-to-tr from-[#181424] via-buttontransparent2 to-buttontransparent border-t-[0.5px] border-[#474747] bg-transparent text-white align-middle my-auto p-2 transition hover:scale-[105%]"
						onClick={() => setMenuOpen(true)}
					>
						<ShoppingCartIcon className="w-3 h-3 lg:w-5 lg:h-5" />
						{
							(cart && cart.items.length > 0) &&
							<span className="absolute top-0 right-0 inline-flex items-center justify-center px-[5px] py-[3px] text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full">
								{cart.items.length > 999 ? "+999" : cart.items.length}
							</span>
						}
					</button>
					<CartSideMenu open={menuOpen} setOpen={setMenuOpen} cartItems={cartItems}/>
				</div>
			</div>
		</header>
	)
}
