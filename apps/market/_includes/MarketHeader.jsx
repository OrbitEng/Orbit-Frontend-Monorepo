import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from "next/router";

import OrbitLogoFull from "../public/OrbitLogos/OrbitFullLogo.png"

import * as anchor from "@project-serum/anchor";

import { Bars3CenterLeftIcon, MagnifyingGlassIcon, PlusCircleIcon, ShoppingCartIcon } from '@heroicons/react/24/outline'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { useContext, useEffect, useState } from 'react';

const {
	BundlrClient,
	ChatClient,
	PythClient,
	ArQueryClient
} = require("data-transfer-clients");

import BundlrCtx from '@contexts/BundlrCtx';
import MatrixClientCtx from '@contexts/MatrixClientCtx';
import UserAccountCtx from '@contexts/UserAccountCtx';
import CartCtx from '@contexts/CartCtx';
import PythClientCtx from '@contexts/PythClientCtx';
import ChatCtx from '@contexts/ChatCtx';
import ArweaveCtx from '@contexts/ArweaveCtx';

import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { CreateChatModal } from './components/modals/CreateChatModal';
import { HeaderSearchBar, PageSearchBar } from './components/SearchBar';
import { ACCOUNTS_PROGRAM, PRODUCT_PROGRAM, TRANSACTIONS_PROGRAM, COMMISSION_MARKET, PHYSICAL_MARKET, DIGITAL_MARKET, SEARCH_PROGRAM, DISPUTE_PROGRAM } from 'orbit-clients';

import CreateAccountModal from '@includes/components/buttons/CreateAccountModal';
import CartSideModal from './components/modals/CartSideModal';
import ProfileButton from '@includes/components/buttons/ProfileButton';

import HeaderMenuModal from '@includes/components/modals/HeaderMenuModal';

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

	const {bundlrClient, setBundlrClient} = useContext(BundlrCtx);
	const {matrixClient, setMatrixClient} = useContext(MatrixClientCtx);
	const {userAccount, setUserAccount} = useContext(UserAccountCtx);
	const {pythClient, setPythClient} = useContext(PythClientCtx);
	const {arweaveClient, setArweaveClient} = useContext(ArweaveCtx);

	const [menuOpen, setMenuOpen] = useState(false);
	const [cartOpen, setCartOpen] = useState(false);
	const [hasChat, setHasChat] = useState(false);

	const {cart} = useContext(CartCtx);
	const {chatState, setChatState} = useContext(ChatCtx);

	useEffect(()=>{
		if(!arweaveClient){
			setArweaveClient(new ArQueryClient())
		}
	},[])
	
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
		if(!wallet.publicKey) return;
		PRODUCT_PROGRAM && PRODUCT_PROGRAM.SetProgramWallet(wallet);
		TRANSACTIONS_PROGRAM && TRANSACTIONS_PROGRAM.SetProgramWallet(wallet);
		COMMISSION_MARKET && COMMISSION_MARKET.SetProgramWallet(wallet);
		PHYSICAL_MARKET && PHYSICAL_MARKET.SetProgramWallet(wallet);
		DIGITAL_MARKET && DIGITAL_MARKET.SetProgramWallet(wallet);
		SEARCH_PROGRAM && SEARCH_PROGRAM.SetProgramWallet(wallet);
		DISPUTE_PROGRAM && DISPUTE_PROGRAM.SetProgramWallet(wallet);
	}, [wallet.publicKey])

	useEffect(async ()=>{
		if (!(wallet && wallet.publicKey && arweaveClient)) return;
		if((userAccount && userAccount.data.wallet) && (wallet.publicKey.toString() == userAccount.data.wallet.toString())) return;

		try{
			let account_address = (ACCOUNTS_PROGRAM.GenAccountAddress(wallet.publicKey));
			let account = await ACCOUNTS_PROGRAM.GetAccount(account_address);
			account.data.profilePic = await arweaveClient.GetPfp(account.data.profilePic);
			account.data.metadata = await arweaveClient.GetMetadata(account.data.metadata);
			
			// account.data.disputeDiscounts = 2;
			setUserAccount(account)
			console.log(account)
		}catch(e){
			console.log(e)
			setUserAccount(undefined)
		}
	},[wallet.publicKey, arweaveClient, userAccount])

	useEffect( async ()=>{
		if(!(userAccount && arweaveClient)) return;
		if(!(wallet.connected && wallet.publicKey)){
			setMatrixClient(undefined);
			return;
		}
		if((matrixClient) && (matrixClient.auth_keypair.publicKey.toString() == wallet.publicKey.toString())){
			return
		}
		try{
			let chat_client = new ChatClient(wallet, arweaveClient, userAccount);
			setMatrixClient(chat_client)
			await chat_client.initialize();
			if(await chat_client.Login()){
				setHasChat(true)
			};
		}catch(e){
			console.log(e);
			setHasChat(false);
		}
	}, [arweaveClient, userAccount, wallet.publicKey])

	return(
		<header className="mx-auto max-w-[100rem] h-28 sm:h-32 top-0 inset-x-0 fixed flex flex-col justify-between backdrop-filter backdrop-blur z-[100] overflow-visible w-full">
			<div className="flex flex-row mt-5 justify-between sm:mr-3 mx-3">
				<div className="relative flex py-auto w-52 cursor-pointer justify-start">
					<button
						className="text-white sm:hidden flex mr-1"
						onClick={(e) => {
							e.preventDefault();
							setMenuOpen(true);
						}}
					>
						<Bars3CenterLeftIcon className="text-white h-7 w-7 my-auto"/>
					</button>
					<HeaderMenuModal open={menuOpen} setOpen={setMenuOpen} />
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
				<div className="flex flex-row align-middle my-auto justify-end z-[120] w-52 gap-x-2 ml-2">
					<button
						className="inline-flex relative rounded-lg bg-gradient-to-tr from-[#181424] via-buttontransparent2 to-buttontransparent border-t-[0.5px] border-[#474747] bg-transparent text-[#d9d9d9] align-middle my-auto p-2 transition hover:scale-[105%]"
						onClick={() => setCartOpen(true)}
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
						<button className='rounded-lg bg-gradient-to-tr from-[#181424] via-buttontransparent2 to-buttontransparent border-t-[0.5px] border-[#474747] bg-transparent text-[#d9d9d9] align-middle flex my-auto p-2 transition hover:scale-[105%]'>
							<PlusCircleIcon className="w-4 h-4 sm:w-5 sm:h-5" />
						</button>
					</Link>
					<div className="inline-flex relative rounded-full bg-gradient-to-tr from-[#181424] via-buttontransparent2 to-buttontransparent border-t-[0.5px] border-[#474747] bg-transparent text-[#d9d9d9] align-middle my-auto p-[1px]" >
						{
							((!wallet.connected) && <WalletMultiButton />) || 
							((!userAccount) && <CreateAccountModal connectedWallet={wallet}/>) || 
							(<ProfileButton selfAccount={userAccount} />)
						}
					</div>
					<CartSideModal open={cartOpen} setOpen={setCartOpen}/>
				</div>
			</div>
			<div className="hidden relative sm:flex mx-3 flex-row bg-transparent h-8 my-auto text-white z-[60]">
				<button className="bg-[#17151C] rounded-md h-8 py-1 px-3 items-center">
					<div className="flex flex-row mx-auto my-auto justify-evenly gap-2">
						<MagnifyingGlassIcon className="h-4 w-4 text-[#878787] my-auto" />
						<span className="text-[#878787] my-auto text-sm">Explore</span>
					</div>
				</button>
				<div className="border-r-[1px] border-x-[#424242] mx-3 my-[2px]" />
				<div className="overflow-x-scroll w-full flex flex-row scrollbar-none z-[60]">
					{categoryTags.map((tag, indx) => (
						<button key={indx} className="bg-[#17151C] text-[#878787] rounded-md text-sm px-3 py-1 mr-4 whitespace-nowrap z-[60]">
							{tag.name}
						</button>
					))}
				</div>
			</div>
			<div className="relative flex sm:hidden my-auto mx-4">
				<HeaderSearchBar />
			</div>
		</header>
	)
}
