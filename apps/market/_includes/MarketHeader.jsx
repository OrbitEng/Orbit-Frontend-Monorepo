import Image from 'next/image'

import * as anchor from "@project-serum/anchor";

import { Bars3CenterLeftIcon, PlusCircleIcon, EnvelopeIcon, ShoppingCartIcon } from '@heroicons/react/24/outline'
import { WalletConnectButton, WalletModalButton, WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { useCallback, useContext, useEffect } from 'react';

const {DigitalMarketClient, PhysicalMarketClient, CommissionMarketClient, DisputeClient, MarketAccountsClient, ProductClient, TransactionClient} = require("orbit-clients");
const {BundlrClient, ChatClient, PythClient, ArQueryClient} = require("data-transfer-clients");


import DigitalMarketCtx from '@contexts/DigitalMarketCtx';
import DisputeProgramCtx from '@contexts/DisputeProgramCtx';
import PhysicalMarketCtx from '@contexts/PhysicalMarketCtx';
import CommissionMarketCtx from '@contexts/CommissionMarketCtx';
import ProductClientCtx from '@contexts/ProductClientCtx';
import TransactionClientCtx from '@contexts/TransactionClientCtx';
import MarketAccountsCtx from '@contexts/MarketAccountsCtx';
import BundlrCtx from '@contexts/BundlrCtx';
import MatrixClientCtx from '@contexts/MatrixClientCtx';
import UserAccountCtx from '@contexts/UserAccountCtx';

import { MarketAccountFunctionalities } from '@functionalities/Accounts';

import Link from 'next/link';
import { useState } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';

import CreateAccountModal from '@includes/components/buttons/CreateAccountModal';
import ProfileButton from '@includes/components/buttons/ProfileButton';
import CartSideMenu from './CartSideMenu';
import CartCtx from '@contexts/CartCtx';
import PythClientCtx from '@contexts/PythClientCtx';
import ChatCtx from '@contexts/ChatCtx';
import { CreateChatModal } from './components/modals/CreateChatModal';
import ArweaveCtx from '@contexts/ArweaveCtx';

export function HomeHeader(props) {
	// things for demoing cart funcs

	let {connection} = useConnection();
	let wallet = useWallet();

	const {setDigitalMarketClient} = useContext(DigitalMarketCtx);
	const {setDisputeProgramClient} = useContext(DisputeProgramCtx);
	const {setPhysicalMarketClient} = useContext(PhysicalMarketCtx);
	const {setCommissionMarketClient} = useContext(CommissionMarketCtx);
	const {setMarketAccountsClient} = useContext(MarketAccountsCtx);
	const {bundlrClient, setBundlrClient} = useContext(BundlrCtx);
	const {matrixClient, setMatrixClient} = useContext(MatrixClientCtx);
	const {setProductClient} = useContext(ProductClientCtx);
	const {setTransactionClient} = useContext(TransactionClientCtx);
	const {userAccount, setUserAccount} = useContext(UserAccountCtx);
	const {setPythClient} = useContext(PythClientCtx);
	const {setArweaveClient} = useContext(ArweaveCtx);

	const [marketAccount, setMarketAccount] = useState(undefined);
	const [menuOpen, setMenuOpen] = useState(false);

	const {cart} = useContext(CartCtx);
	const {chatState, setChatState} = useContext(ChatCtx);

	useEffect(async ()=>{

		if((userAccount && wallet.connected)&& (wallet.publicKey.toString() == userAccount.address.toString())) return;

		let temp_wallet = (wallet && wallet.publicKey) ? wallet : {};

		setPythClient(new PythClient(connection, process.env.NEXT_PUBLIC_CLUSTER_NAME))

		const provider =  new anchor.AnchorProvider(connection, temp_wallet, anchor.AnchorProvider.defaultOptions());
		provider.wallet = wallet;
		let accounts_client = new MarketAccountsClient(temp_wallet, connection, provider);

		setDigitalMarketClient(new DigitalMarketClient(temp_wallet, connection, provider));
		setDisputeProgramClient(new DisputeClient(temp_wallet, connection, provider));
		setPhysicalMarketClient(new PhysicalMarketClient(temp_wallet, connection, provider));
		setCommissionMarketClient(new CommissionMarketClient(temp_wallet, connection, provider))
		setProductClient(new ProductClient(temp_wallet, connection, provider));
		let ar_client = new ArQueryClient();
		setArweaveClient(ar_client)
		let tx_client = new TransactionClient(temp_wallet, connection, provider);
		setTransactionClient(tx_client);

		setMarketAccountsClient(accounts_client);

		if (temp_wallet.publicKey){
			let account_address = (accounts_client.GenAccountAddress(temp_wallet.publicKey));
			let account;
			try{
				account = await accounts_client.GetAccount(account_address);
				account.data.profilePic = await ar_client.GetPfp(account.data.profilePic);
				account.data.metadata = await ar_client.GetMetadata(account.data.metadata);
				
				account.data.disputeDiscounts = 2;
				setMarketAccount(account)
				setUserAccount(account)
				console.log(account)
			}catch(e){
				console.log(e)
				setMarketAccount(undefined)
				setUserAccount(undefined)
			}

			if((!matrixClient || (matrixClient.auth_keypair.publicKey.toString() != temp_wallet.publicKey.toString())) && account){

				let chat_client = new ChatClient(temp_wallet, accounts_client, tx_client, ar_client, account);
				await chat_client.initialize();
				setMatrixClient(chat_client);
				await chat_client.Login();
			}

			if(!bundlrClient || (bundlrClient && !bundlrClient.bundlr.address)){
				let bundlr_client = new BundlrClient(temp_wallet);
				await bundlr_client.initialize();
				setBundlrClient(bundlr_client);				
			}

		}
		
	}, [wallet.connected, wallet.publicKey])

	return(
		<header className="mx-auto max-w-7xl h-14 lg:h-32 top-0 sticky flex flex-row justify-between bg-transparent backdrop-blur z-50 overflow-visible w-full">
			<div className="relative flex flex-shrink-0 py-auto w-40 align-middle content-start cursor-pointer p-2">
				<Link href="/">
					<div className="relative flex flex-shrink-0 h-full w-full">
						<Image
							src={"/OrbitLogo.png"}
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
						<Link href="/sell">
							<button className='rounded-lg bg-gradient-to-tr from-[#181424] via-buttontransparent2 to-buttontransparent border-t-[0.5px] border-[#474747] bg-transparent text-white align-middle flex my-auto p-2 transition hover:scale-[105%]'>
								<PlusCircleIcon className="w-3 h-3 lg:w-5 lg:h-5" />
							</button>
						</Link>
						<Link href="/chat" >
							<button
								className="inline-flex relative rounded-lg bg-gradient-to-tr from-[#181424] via-buttontransparent2 to-buttontransparent border-t-[0.5px] border-[#474747] bg-transparent text-white align-middle my-auto p-2 transition hover:scale-[105%]"
							>
								<EnvelopeIcon className="w-3 h-3 lg:w-5 lg:h-5" />
								{
									chatState.unRead > 0 &&
									<span className="absolute top-0 right-0 inline-flex items-center justify-center px-[5px] py-[3px] text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full">
										{chatState.unRead > 999 ? "+999" : chatState.unRead}
									</span>
								}
							</button>
						</Link>
				</div>
				<div className="flex flex-row px-2 gap-3">
					<div className="bg-gradient-to-tr from-[#181424] via-buttontransparent2 to-buttontransparent border-t-[0.5px] border-[#474747] rounded-full relative">
						{
							((!wallet.connected) && <WalletMultiButton />) || 
							((!marketAccount) && <CreateAccountModal setMarketAccount={setMarketAccount} connectedWallet={wallet}/>) || 
							((!(matrixClient && matrixClient.logged_in)) && <CreateChatModal/>) || 
							(<ProfileButton selfAccount={marketAccount} setMarketAccount={setMarketAccount}/>)
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
					<CartSideMenu open={menuOpen} setOpen={setMenuOpen}/>
				</div>
			</div>
		</header>
	)
}
