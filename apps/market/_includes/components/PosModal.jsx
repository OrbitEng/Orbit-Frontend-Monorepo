import { Transition, Dialog, RadioGroup } from "@headlessui/react"
import { Fragment, useState, useEffect, useContext } from "react"
import { ChevronDownIcon, XMarkIcon, CheckIcon, BoltIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import Image from "next/image"
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";

const paymentTokens = [
	{
	  name: 'Solana',
	  mainnetAddr: '11111111111111111111111111111111',
	  devnetAddr: '11111111111111111111111111111111'
	},
	{
	  name: 'USDC',
	  mainnetAddr: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
	  devnetAddr: '4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU'
	},
  ]

export default function PosModal(props) {
	let wallet = useWallet();
	let connection = useConnection()
	const [balance, setBalance] = useState(0)

	/* this is the shit for shipping and cart context
		const [ cart, setCart ] = useContext(CartCtx);
		const [ shipping, setShipping ] = useContext(ShippingCtx);
	*/

	const shipping = 0;
	const cart = 0;

	useEffect(async () => {
		setBalance(await connection.connection.getBalance(wallet.publicKey))
	}, [connection])	
	
	return(
		<Transition appear show={props.openPos} as={Fragment}>
			<Dialog as="div" className="relative z-[120]" onClose={() => props.setOpenPos(false)}>
			<Transition.Child
				as={Fragment}
				enter="ease-out duration-300"
				enterFrom="opacity-0"
				enterTo="opacity-100"
				leave="ease-in duration-200"
				leaveFrom="opacity-100"
				leaveTo="opacity-0"
			>
				<div className="fixed inset-0 backdrop-blur" />
			</Transition.Child>
			<div className="fixed inset-0 overflow-y-auto">
				<div className="flex min-h-full items-center justify-center p-4 text-center">
				<Transition.Child
					as={Fragment}
					enter="ease-out duration-300"
					enterFrom="opacity-0 scale-95"
					enterTo="opacity-100 scale-100"
					leave="ease-in duration-200"
					leaveFrom="opacity-100 scale-100"
					leaveTo="opacity-0 scale-95"
				>
					<Dialog.Panel className="w-full max-w-lg transform overflow-hidden rounded-2xl backdrop-blur bg-gradient-to-t from-[#32254EB3] to-[#26232CE6] border-t-[0.5px] border-[#474747] text-left align-middle shadow-xl transition-all">
						<div className="flex flex-col rounded-xl max-w-lg py-10 px-[4rem] mx-auto w-max">
							<div className="relative top-0 right-0 flex pt-1 pr-4 justify-end">
								<button
									type="button"
									className="rounded-full text-white hover:text-white p-1 border-[#5b5b5b] border-[1px] focus:outline-none"
									onClick={() => props.setOpenPos(false)}
								>
									<span className="sr-only">Close panel</span>
									<XMarkIcon className="h-6 w-6 text-[#e2e2e2]" aria-hidden="true" />
								</button>
							</div>
							<div className="flex flex-col mb-8">
								<h1 className="text-3xl text-white font-bold">Order Summary</h1>
								<span className="text-[#848484] font-bold truncate w-1/2">
									{"Wallet: " + wallet.publicKey}
								</span>
							</div>
							<div className="flex flex-col px-4">
								<div className="flex flex-row justify-between align-middle">
									<span className="my-auto text-xl font-bold text-[#E7E7E7]">{"ITEMS(" + (props?.cartItems?.length || 0) + ")"}</span>
									<ChevronDownIcon className="text-[#797979] h-4 w-4 stroke-[4px]" />
								</div>
							</div>
							<div className="flex flex-col border-y-[0.5px] border-[#535353] px-4">
							{
								props?.cartItems?.map((item, index) => {
									return(
										<div key={index} className="flex flex-row rounded-md justify-between my-2">
											<div className="flex flex-row flex-shrink-0 mr-8">
												<div className="relative flex flex-shrink-0 h-12 w-12 rounded-md mr-3">
													<div className="inline-flex z-[120] absolute font-serif bg-red-500 bg-opacity-80 -top-1 -right-1 h-4 w-4 rounded-full justify-center items-center text-xs">
														<XMarkIcon className="h-3 w-3 text-white stroke-[3px]"/>
													</div>
													<Image 
														className="rounded-md"
														layout="fill"
														src={item.image}
														objectFit="contain"
													/>
												</div>
												<div className="flex flex-col justify-start my-auto">
													<span className="text-white font-bold -mb-1">{item.name}</span>
													<span className="text-[#868686] text-xs">{item.vendorUserName}</span>
												</div>
											</div>
											<div className="flex flex-col justify-self-end text-center w-fit truncate">
												<span className="text-white font-bold -mb-1 truncate">{item.price/LAMPORTS_PER_SOL + " SOL"}</span>
												<span className="text-white font-bold text-xs truncate">{"$----"}</span>
											</div>
										</div>
									)
								})
							}	
							</div>
							<div className="rounded-lg flex flex-row px-4 py-2 bg-[#5F5F5F] bg-opacity-30 mt-3 align-middle justify-between">
								<div
									className="flex flex-row gap-x-2 group cursor-pointer group basis-1/2 overflow-hidden"
								>
									<div className="flex flex-row gap-x-2 absolute transition duration-300 opacity-0 group-hover:opacity-100">
										<button onClick={() => wallet.disconnect()} className="hover:bg-opacity-40 text-md font-semibold z-50 text-white truncate bg-[#5F5F5F] bg-opacity-20 py-1 px-2 rounded-lg w-fit text-center my-2 transition duration-300">Disconnect</button>
										<button onClick={() => navigator.clipboard.writeText(wallet.publicKey.toString())} className="hover:bg-opacity-40 text-md font-semibold z-50 text-white truncate bg-[#5F5F5F] bg-opacity-20 py-1 px-2 rounded-lg w-fit text-center my-2 transition duration-300">Copy</button>
									</div>
									<div className="relative flex flex-shrink-0 h-9 w-9 overflow-hidden my-2 group-hover:opacity-0 transition duration-300">
										<Image
											src={wallet.wallet.adapter.icon}
											width={50}
											height={50}
											objectFit="contain"
										/>
									</div>
									<div className="flex flex-col align-middle my-auto group-hover:opacity-0 transition duration-300 flex-grow-0">
										<span className="text-[#A4A4A4] truncate text-xs">{wallet.wallet.adapter.name}</span>
										<span className="font-semibold text-white truncate text-sm -mt-1">{wallet.publicKey.toString()}</span>
									</div>
								</div>
								<div className="align-middle bg-[#5F5F5F] backdrop-blur bg-opacity-20 flex flex-row gap-x-[6px] rounded px-2 my-auto basis-6/10">
									<span className="font-semibold text-[#989898] text-sm">Connected Wallet</span>
									<div className="bg-green-500 rounded-full my-auto">
										<div className="bg-green-500 rounded-full h-2 w-2 my-auto animate-ping" />
									</div>
								</div>
							</div>
							<div className="rounded-lg flex flex-row px-4 py-4 bg-[#5F5F5F] bg-opacity-30 mt-3 align-middle justify-around overflow-hidden">
								<div className="flex flex-col align-middle basis-2/5 flex-grow-0">
									<h3 className="font-bold text-white">Name</h3>
									<span className="text-[#BDBDBD] text-xs truncate">{shipping?.name || "bruhplaceholder"}</span>
								</div>
								<div className="flex flex-col align-middle basis-2/5 flex-grow-0">
									<h3 className="font-bold text-white">Address</h3>
									<span className="text-[#BDBDBD] text-xs truncate">{shipping?.name || "bruhplaceholder"}</span>
								</div>
								<div className="flex flex-col align-middle basis-1/5 flex-grow-0 my-auto">
									<div className="flex flex-row justify-center">
										<button className="rounded bg-[#212121] mx-1 p-1">
											<PencilIcon className="h-4 w-4 text-white"/>
										</button>
										<button className="rounded bg-[#212121] mx-1 p-1">
											<TrashIcon className="h-4 w-4 text-red-500"/>
										</button>
									</div>
								</div>
							</div>
							<div className="rounded-lg flex flex-col mt-4 justify-between px-8 border-[1px] border-[#5F5F5F] text-white font-bold divide-y-[1px] divide-[#5F5F5F]">
								<div className="flex flex-row justify-between py-3">
									<span>Balance:</span>
									<span>{(balance / LAMPORTS_PER_SOL).toString().slice(0,5) + " SOL"}</span>
								</div>
								<div className="flex flex-row justify-between py-3">
									<span>Amount Due:</span>
									<span>{(props.cartTotal/LAMPORTS_PER_SOL || 0) + " SOL"}</span>
								</div>
							</div>
							<button
								className="py-4 px-8 z-[120] flex flex-row justify-center bg-[#008C1F2c] rounded-full mt-4 w-fit mx-auto"
							>
								<span className="text-transparent bg-clip-text bg-gradient-to-t from-[#19B500] to-white font-bold flex flex-row my-auto">
									<BoltIcon className="h-4 w-4 text-[#7fff6b] stroke-2 my-auto mr-1 " />
									Confirm Purchase
								</span>
							</button>
						</div>
					</Dialog.Panel>
				</Transition.Child>
				</div>
			</div>
			</Dialog>
		</Transition>
	)
}