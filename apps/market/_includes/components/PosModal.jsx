import { Transition, Dialog, RadioGroup } from "@headlessui/react"
import { Fragment, useState } from "react"
import { ChevronDownIcon, XMarkIcon, CheckIcon, BoltIcon } from "@heroicons/react/24/outline";
import Image from "next/image"
import { useWallet } from "@solana/wallet-adapter-react";
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
	const [userName, setUserName] = useState();
	const [name, setName] = useState();
	const [bio, setBio] = useState();
	const [selectedPayment, setSelectedPayment] = useState(paymentTokens[0]);
	
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
							<div className="flex flex-col border-y-[0.5px] border-[#535353]">
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
							<div className="flex flex-row justify-between my-4">
								<RadioGroup className="mx-auto w-full" value={selectedPayment} onChange={setSelectedPayment}>
									<RadioGroup.Label className="font-bold text-[#A3A3A3] text-xl mx-auto text-center">Payment Method</RadioGroup.Label>
									<div className="space-y-2">
										{paymentTokens.map((paymentToken) => (
										<RadioGroup.Option
											key={paymentToken.name}
											value={paymentToken}
											className={({ active, checked }) =>
											`${
												active
												? 'ring-2 ring-white ring-opacity-60 ring-offset-2 ring-offset-purple-300'
												: ''
											}
											${
												checked ? 'bg-[#141619] bg-opacity-75 text-white' : 'bg-[#14161988]'
											}
												relative flex cursor-pointer rounded-lg px-5 py-4 shadow-md focus:outline-none`
											}
										>
											{({ active, checked }) => (
											<>
												<div className="flex w-full items-center justify-between">
												<div className="flex items-center">
													<div className="text-sm">
													<RadioGroup.Label
														as="p"
														className={`font-medium  ${
														checked ? 'text-white' : 'text-gray-500'
														}`}
													>
														{paymentToken.name}
													</RadioGroup.Label>
													<RadioGroup.Description
														as="span"
														className={`inline ${
														checked ? 'text-purple-100' : 'text-gray-500'
														}`}
													>
														<span>
														{paymentToken.devnetAddr.slice(0,24) + "..."}
														</span>
													</RadioGroup.Description>
													</div>
													</div>
													{checked && (
														<div className="shrink-0 text-white">
															<CheckIcon className="h-6 w-6" />
														</div>
													)}
													</div>
												</>
												)}
											</RadioGroup.Option>
										))}
									</div>
								</RadioGroup>
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