import Image from 'next/image'

import * as anchor from "@project-serum/anchor";

import { Bars3CenterLeftIcon, PlusCircleIcon, EnvelopeIcon, ShoppingCartIcon } from '@heroicons/react/24/outline'
import { WalletConnectButton, WalletModalButton, WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { useCallback, useContext, useEffect, useState } from 'react';

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

import Link from 'next/link';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';

import CreateAccountModal from '@includes/components/buttons/CreateAccountModal';
import ProfileButton from '@includes/components/buttons/ProfileButton';
import CartSideMenu from './CartSideMenu';
import CartCtx from '@contexts/CartCtx';
import PythClientCtx from '@contexts/PythClientCtx';
import ChatCtx from '@contexts/ChatCtx';
import { CreateChatModal } from './components/modals/CreateChatModal';
import ArweaveCtx from '@contexts/ArweaveCtx';
import AnchorProviderCtx from '@contexts/AnchorProviderCtx';
import { HeaderSearchBar, PageSearchBar } from './components/SearchBar';

export function HomeHeader(props) {
	// things for demoing cart funcs

	const {connection} = useConnection();
	const wallet = useWallet();

	const {anchorProvider, setAnchorProvider} = useContext(AnchorProviderCtx)

	const {digitalMarketClient, setDigitalMarketClient} = useContext(DigitalMarketCtx);
	const {disputeProgramClient, setDisputeProgramClient} = useContext(DisputeProgramCtx);
	const {physicalMarketClient, setPhysicalMarketClient} = useContext(PhysicalMarketCtx);
	const {commissionMarketClient, setCommissionMarketClient} = useContext(CommissionMarketCtx);
	const {marketAccountsClient, setMarketAccountsClient} = useContext(MarketAccountsCtx);
	const {bundlrClient, setBundlrClient} = useContext(BundlrCtx);
	const {matrixClient, setMatrixClient} = useContext(MatrixClientCtx);
	const {productClient, setProductClient} = useContext(ProductClientCtx);
	const {transactionClient, setTransactionClient} = useContext(TransactionClientCtx);
	const {userAccount, setUserAccount} = useContext(UserAccountCtx);
	const {pythClient, setPythClient} = useContext(PythClientCtx);
	const {arweaveClient, setArweaveClient} = useContext(ArweaveCtx);

	const [menuOpen, setMenuOpen] = useState(false);
	const [hasChat, setHasChat] = useState(false);

	const {cart} = useContext(CartCtx);
	const {chatState, setChatState} = useContext(ChatCtx);

	useEffect(()=>{
		if(!arweaveClient){
			setArweaveClient(new ArQueryClient())
		}
	})
	
	/// pure conn dep
	useEffect(()=>{
		if(pythClient){
			setPythClient(new PythClient(connection, process.env.NEXT_PUBLIC_CLUSTER_NAME));
		}
	},[connection]);

	/// pure wallet dep
	useEffect(async ()=>{
		if(!(wallet && wallet.publicKey)){
			setBundlrClient(undefined);
			return;
		}
		if(bundlrClient && (bundlrClient.bundlr.address == wallet.publicKey.toString())) return;
		
		let bundlr_client = new BundlrClient(wallet);
		await bundlr_client.initialize();
		setBundlrClient(bundlr_client);

	},[wallet])

	useEffect(()=>{
		let temp_wallet = (wallet && wallet.publicKey) ? wallet : {};
		if(anchorProvider && anchorProvider.wallet){
			if(anchorProvider.wallet.publicKey && temp_wallet.publicKey && (anchorProvider.wallet.publicKey.toString() == wallet.publicKey.toString())) return;
			anchorProvider.wallet = temp_wallet;
		}else{
			setAnchorProvider(new anchor.AnchorProvider(connection, temp_wallet, anchor.AnchorProvider.defaultOptions()));
		}
	},[connection, wallet])

	useEffect(async ()=>{
		if(!(anchorProvider && connection)) return;

		if(!digitalMarketClient){
			setDigitalMarketClient(new DigitalMarketClient(connection, anchorProvider));
		}
		if(!disputeProgramClient){
			setDisputeProgramClient(new DisputeClient(connection, anchorProvider));
		}
		if(!physicalMarketClient){
			setPhysicalMarketClient(new PhysicalMarketClient(connection, anchorProvider));
		}
		if(!commissionMarketClient){
			setCommissionMarketClient(new CommissionMarketClient(connection, anchorProvider))
		}
		
		if(!productClient){
			setProductClient(new ProductClient(connection, anchorProvider));
		}

		if(!transactionClient){
			setTransactionClient(new TransactionClient(connection, anchorProvider));
		}

		if(!marketAccountsClient){
			setMarketAccountsClient(new MarketAccountsClient(connection, anchorProvider));
		}

	}, [anchorProvider, connection])

	useEffect(async ()=>{
		if (!(wallet && wallet.publicKey && arweaveClient && marketAccountsClient)) return;
		if((userAccount && userAccount.data.wallet && wallet.publicKey) && (wallet.publicKey.toString() == userAccount.data.wallet.toString())) return;

		try{
			let account_address = (marketAccountsClient.GenAccountAddress(wallet.publicKey));
			let account = await marketAccountsClient.GetAccount(account_address);
			account.data.profilePic = await arweaveClient.GetPfp(account.data.profilePic);
			account.data.metadata = await arweaveClient.GetMetadata(account.data.metadata);
			
			// account.data.disputeDiscounts = 2;
			setUserAccount(account)
			console.log(account)
		}catch(e){
			console.log(e)
			setUserAccount(undefined)
		}
	},[wallet.publicKey, marketAccountsClient, userAccount])

	useEffect( async ()=>{
		if(!(marketAccountsClient && transactionClient && arweaveClient && userAccount && arweaveClient)) return;
		if(!(wallet.connected && wallet.publicKey)){
			setMatrixClient(undefined);
			return;
		}
		if((wallet.connected && wallet.publicKey && matrixClient) && (matrixClient.auth_keypair.publicKey.toString() == wallet.publicKey.toString())){
			return
		}
		try{
			let chat_client = new ChatClient(wallet, marketAccountsClient, physicalMarketClient, digitalMarketClient, commissionMarketClient, transactionClient, arweaveClient, userAccount);
			setMatrixClient(chat_client)
			await chat_client.initialize();
			if(await chat_client.Login()){
				setHasChat(true)
			};
		}catch(e){
			console.log(e);
			setHasChat(false);
		}
	}, [marketAccountsClient, physicalMarketClient, digitalMarketClient, commissionMarketClient, transactionClient, arweaveClient, userAccount, arweaveClient, wallet])

	return(
		<header className="mx-auto max-w-[100rem] h-14 lg:h-32 top-0 inset-x-0 sticky flex flex-row justify-between bg-transparent z-50 overflow-visible w-full">
			<div className="relative flex flex-shrink-0 py-auto w-40 align-middle content-start cursor-pointer p-2">
				<Link href="/">
					<div className="relative flex flex-shrink-0 h-1/2 w-1/2 my-auto">
						<Image
							src={"/OrbitLogos/OrbitFullLogo.png"}
							layout="fill"
							alt="The Name and Logo for the Orbit market"
							objectFit="contain"
							priority={true}
						/>
					</div>
				</Link>
			</div>
			<HeaderSearchBar />
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
							((!userAccount) && <CreateAccountModal connectedWallet={wallet}/>) || 
							(<ProfileButton selfAccount={userAccount} />)
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
