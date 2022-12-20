import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from "next/router";

import OrbitLogoFull from "../public/OrbitLogos/OrbitFullLogo.png"

import * as anchor from "@project-serum/anchor";

import { Bars3CenterLeftIcon, MagnifyingGlassIcon, PlusCircleIcon, ShoppingCartIcon } from '@heroicons/react/24/outline'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { useContext, useEffect, useState } from 'react';

const {
	DigitalMarketClient,
	PhysicalMarketClient,
	CommissionMarketClient,
	DisputeClient,
	MarketAccountsClient,
	ProductClient,
	TransactionClient
} = require("orbit-clients");

const {
	BundlrClient,
	ChatClient,
	PythClient,
	ArQueryClient
} = require("data-transfer-clients");

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

import { useConnection, useWallet } from '@solana/wallet-adapter-react';

import CreateAccountModal from '@includes/components/buttons/CreateAccountModal';
import HoloGrayButton from '@includes/components/buttons/HoloGrayButton';
import ProfileButton from '@includes/components/buttons/ProfileButton';
import CartSideMenu from './CartSideMenu';
import CartCtx from '@contexts/CartCtx';
import PythClientCtx from '@contexts/PythClientCtx';
import ChatCtx from '@contexts/ChatCtx';
import { CreateChatModal } from './components/modals/CreateChatModal';
import ArweaveCtx from '@contexts/ArweaveCtx';
import AnchorProviderCtx from '@contexts/AnchorProviderCtx';
import { HeaderSearchBar, PageSearchBar } from './components/SearchBar';
import { Category } from 'matrix-js-sdk';

const categoryTags = [
	{ name: "Local", value: "local" },
	{ name: "Shipping", value: "shipping" },
	{ name: "Digital Products", value: "digital products" },
	{ name: "Commission Jobs", value: "commission jobs" },
	{ name: "Cars", value: "Cars" },
	{ name: "Logo Design", value: "logo design" },
	{ name: "File Assets", value: "file assets" },
	{ name: "Clothing", value: "clothing" },
	{ name: "Sneakers", value: "sneakers" },
	{ name: "Editor", value: "editor" },
	{ name: "Furniture", value: "furniture" },
	{ name: "Audio Equipment", value: "audio equipment" },
	{ name: "Music Videos", value: "music videos" },
	{ name: "Cellphones", value: "cellphones" },
	{ name: "3D Models", value: "3D models" },
];

export function HomeHeader(props) {
	// things for demoing cart funcs
	const router = useRouter();
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
		<header className="mx-auto max-w-[100rem] h-32 top-0 inset-x-0 fixed flex flex-col justify-between backdrop-filter backdrop-blur z-[100] overflow-visible w-full">
			<div className="flex flex-row mt-5 justify-between mr-3">
				<div className="relative flex py-auto w-52 cursor-pointer justify-start">
					<button className="text-white sm:hidden flex mr-1">
						<Bars3CenterLeftIcon className="text-white h-6 w-6 my-auto"/>
					</button>
					<button 
						className="relative flex flex-shrink-0 p-0 m-0 w-24 sm:w-32 h-6 sm:h-8 my-auto"
						onClick={(e) =>  {
							e.preventDefault()
							router.push("/")
						}}
					>
						<Image
							src={OrbitLogoFull}
							layout="fill"
							alt="The Name and Logo for the Orbit market"
							objectFit="contain"
							priority={true}
						/>
					</button>
				</div>
				<div className="hidden sm:flex max-w-2xl w-full">
					<HeaderSearchBar />
				</div>
				<div className="flex flex-row align-middle my-auto justify-end z-[60] w-52 gap-x-2 ml-2">
					<button
						className="inline-flex relative rounded-lg bg-gradient-to-tr from-[#181424] via-buttontransparent2 to-buttontransparent border-t-[0.5px] border-[#474747] bg-transparent text-white align-middle my-auto p-2 transition hover:scale-[105%]"
						onClick={() => setMenuOpen(true)}
					>
						<ShoppingCartIcon className="w-4 h-4 sm:w-5 sm:h-5" />
						{
							(cart && cart.items.length > 0) &&
							<span className="absolute top-0 right-0 inline-flex items-center justify-center px-[5px] py-[3px] text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full">
								{cart.items.length > 999 ? "+999" : cart.items.length}
							</span>
						}
					</button>
					<Link href="/sell">
						<button className='rounded-lg bg-gradient-to-tr from-[#181424] via-buttontransparent2 to-buttontransparent border-t-[0.5px] border-[#474747] bg-transparent text-white align-middle flex my-auto p-2 transition hover:scale-[105%]'>
							<PlusCircleIcon className="w-4 h-4 sm:w-5 sm:h-5" />
						</button>
					</Link>
					<button className="inline-flex relative rounded-full bg-gradient-to-tr from-[#181424] via-buttontransparent2 to-buttontransparent border-t-[0.5px] border-[#474747] bg-transparent text-white align-middle my-auto p-[1px]" >
						{
							((!wallet.connected) && <WalletMultiButton />) || 
							((!userAccount) && <CreateAccountModal connectedWallet={wallet}/>) || 
							(<ProfileButton selfAccount={userAccount} />)
						}
					</button>
					<CartSideMenu open={menuOpen} setOpen={setMenuOpen}/>
				</div>
			</div>
			<div className="hidden relative sm:flex mx-3 flex-row bg-transparent h-10 my-3 text-white [mask:radial-gradient(ellipse_100%_75%_at_50%_25%,#00050%,#0000)]">
				<button className="bg-[#17151C] rounded-md h-10 py-2 px-3 items-center">
					<div className="flex flex-row mx-auto my-auto justify-evenly gap-2">
						<MagnifyingGlassIcon className="h-5 w-5 text-[#A9A9A9] my-auto" />
						<span className="text-[#A9A9A9] my-auto">Explore</span>
					</div>
				</button>
				<div className="border-r-[1px] border-x-[#424242] mx-3 my-[2px]" />
				<div className="overflow-x-scroll w-full flex flex-row scrollbar-none">
					{categoryTags.map((tag, indx) => (
						<button key={indx} className="bg-[#17151C] text-[#A9A9A9] rounded-md px-3 py-2 mr-4 whitespace-nowrap">
							{tag.name}
						</button>
					))}
				</div>
			</div>
		</header>
	)
}
