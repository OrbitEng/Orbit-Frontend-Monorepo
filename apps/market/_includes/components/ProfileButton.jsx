import { useContext, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import MarketAccountsCtx from "@contexts/MarketAccountsCtx";
import { Menu, Popover, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { ArrowRightOnRectangleIcon, ChevronRightIcon, StarIcon, TruckIcon, UserCircleIcon, UsersIcon } from "@heroicons/react/24/outline";
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { LAMPORTS_PER_SOL } from "@solana/web3.js";

export default function ProfileButton(props) {
	const {marketAccountsClient, setMarketAccountsClient} = useContext(MarketAccountsCtx);
	const [ balance, setBalance ] = useState(0);
	let wallet = useWallet();
	let connection = useConnection()

	useEffect(async () => {
		setBalance(await connection.connection.getBalance(wallet.publicKey))
	}, [connection])

	return(
		<Popover>
			<Popover.Button className="relative overflow-hidden h-7 w-7 rounded-full m-[5px] justify-center align-middle ">
				<Image
					src={((props?.selfAccount?.data?.profilePic?.charAt(0) == "/" || props?.selfAccount?.data?.profilePic?.slice(0,4) == "http" || props?.selfAccount?.data?.profilePic?.slice(0,4) == "data") && props.selfAccount.data.profilePic) || "https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50?d=mp&f=y"}
					w={10}
					h={10}
					layout="fill"
					objectfit="cover"
				/>
			</Popover.Button>
			<Transition
				className="backdrop-filter backdrop-blur"
				enter="transition ease-out duration-100"
				enterFrom="transform opacity-0 scale-95"
				enterTo="transform opacity-100 scale-100"
				leave="transition ease-in duration-75"
				leaveFrom="transform opacity-100 scale-100"
				leaveTo="transform opacity-0 scale-95"
			>
				<Popover.Panel className="absolute flex flex-col p-5 top-2 -right-4 bg-[#8E84FF] bg-opacity-20 rounded-lg shadow-lg w-64">
					<Popover.Group>
						<Link 
							className="m-1"
							href={"/profile/" + props?.selfAccount?.address?.toString() || ""}
						>
							<div className="flex flex-row my-auto gap-x-2 cursor-pointer group">
								<div className="relative flex flex-shrink-0 h-10 w-10 rounded-full overflow-hidden my-auto">
									<Image 
										src={((props?.selfAccount?.data?.profilePic?.charAt(0) == "/" || props?.selfAccount?.data?.profilePic?.slice(0,4) == "http" || props?.selfAccount?.data?.profilePic?.slice(0,4) == "data") && props.selfAccount.data.profilePic) || "https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50?d=mp&f=y"}
										layout="fill"
										objectfit="contain"
									/>
								</div>
								<div className="flex flex-col align-middle my-auto w-8/12">
									<span className="truncate text-[#848484]">{("@0x"+props.selfAccount?.address?.toString().slice(0,10)) || "@addr"}</span>
									<span className="truncate text-white font-bold -mt-2 text-lg">{(props.selfAccount?.data?.metadata?.name && props.selfAccount?.data?.metadata?.name) || "nickname"}</span>
								</div>
								<div className="relative flex align-middle my-auto">
									<ChevronRightIcon className="stroke-2 text-[#BEBEBE] h-7 w-7 my-1" />
								</div>
							</div>
						</Link>
					</Popover.Group>
					<div className="flex flex-col mt-5 gap-y-2 ml-2">
						<Popover.Group>
							<button className="cursor-pointer group">
								<Link href={"/profile/"+props.selfAccount?.address?.toString()}>
									<div className="flex flex-row align-middle gap-x-4">
										<UserCircleIcon className="h-6 w-6 text-white stroke-[2.5px] my-auto"/>
										<span className="text-white font-bold text-lg my-auto">Profile</span>
									</div>
								</Link>
							</button>
						</Popover.Group>
						<Popover.Group>
							<button className="cursor-pointer group">
								<Link href="/orders">
									<div className="flex flex-row align-middle gap-x-4">
										<TruckIcon className="h-6 w-6 text-white stroke-[2.5px] my-auto"/>
										<span className="text-white font-bold text-lg my-auto">Orders</span>
									</div>
								</Link>
							</button>
						</Popover.Group>
						<Popover.Group>
							<button className="cursor-pointer group">
								<Link href="/referrals">
									<div className="flex flex-row align-middle gap-x-4">
										<UsersIcon className="h-6 w-6 text-white stroke-[2.5px] my-auto"/>
										<span className="text-white font-bold text-lg my-auto">Referrals</span>
									</div>
								</Link>
							</button>
						</Popover.Group>
						<Popover.Group>
							<button className="cursor-pointer group">
								<Link href="/favorites">
									<div className="flex flex-row align-middle gap-x-4">
										<StarIcon className="h-6 w-6 text-white stroke-[2.5px] my-auto"/>
										<span className="text-white font-bold text-lg my-auto">Favorites</span>
									</div>
								</Link>
							</button>
						</Popover.Group>
					</div>
					<div className="flex flex-col rounded-lg border-[#525252] border-[1.5px] h-fill mt-5 mb-3 p-2 px-5 divide-y-[1.5px] divide-[#525252]">
							<div className="flex flex-col justify-start">
								<div className="align-middle bg-[#5F5F5F] backdrop-blur bg-opacity-20 flex flex-row gap-x-[6px] rounded px-2 w-fit mt-1">
									<span className="font-semibold text-[#989898] text-sm">Connected Wallet</span>
									<div className="bg-green-500 rounded-full my-auto">
										<div className="bg-green-500 rounded-full h-2 w-2 my-auto animate-ping" />
									</div>
								</div>
								<div
									className="flex flex-row gap-x-2 group cursor-pointer group"
								>
									<div className="flex flex-row gap-x-2 absolute transition duration-300 opacity-0 group-hover:opacity-100">
										<button onClick={() => wallet.disconnect()} className="hover:bg-opacity-40 text-md font-semibold z-50 text-white truncate bg-[#5F5F5F] bg-opacity-20 py-1 px-2 rounded-lg max-w-1/2 text-center my-2 transition duration-300">Disconnect</button>
										<button onClick={() => navigator.clipboard.writeText(wallet.publicKey.toString())} className="hover:bg-opacity-40 text-md font-semibold z-50 text-white truncate bg-[#5F5F5F] bg-opacity-20 py-1 px-2 rounded-lg max-w-1/2 text-center my-2 transition duration-300">Copy</button>
									</div>
									<div className="relative flex flex-shrink-0 h-9 w-9 overflow-hidden my-2 group-hover:opacity-0 transition duration-300 ">
										<Image
											src={wallet.wallet.adapter.icon}
											width={50}
											height={50}
											objectFit="contain"
										/>
									</div>
									<div className="flex flex-col align-middle my-auto group-hover:opacity-0 transition duration-300 w-4/5">
										<span className="text-[#A4A4A4] w-1/4 truncate text-xs">{wallet.wallet.adapter.name}</span>
										<span className="font-semibold text-white truncate text-sm max-w-full -mt-1">{wallet.publicKey.toString().slice(0,10) + "..."}</span>
									</div>
								</div>
							</div>
							<div className="flex flex-col">
								<span className="text-[#989898] mt-1">Wallet Balance</span>
								<div className="flex flex-row gap-x-2">
									<div className="relative flex flex-shrink-0 h-9 w-9 overflow-hidden my-2">
										<Image
											src={"/solanaSvgLogo.svg"}
											width={50}
											height={50}
											objectFit="contain"
										/>
									</div>
									<span className="font-semibold text-white truncate w-1/2 my-auto">{(balance / LAMPORTS_PER_SOL).toString().slice(0,5) + " SOL"}</span>
								</div>
							</div>
					</div>
					<button 
						onClick={async () => {
							await wallet.disconnect()
							setMarketAccountsClient(undefined);
							props?.setMarketAccount(undefined);
						}} 
						className="flex flex-row relative left-0 font-semibold text-[#ACACAC] align-middle justify-end"
					>
							<span className="my-auto">Logout</span>
							<ArrowRightOnRectangleIcon className="h-6 w-6 my-auto" />
					</button>
				</Popover.Panel>
			</Transition>
		</Popover>
	)
}