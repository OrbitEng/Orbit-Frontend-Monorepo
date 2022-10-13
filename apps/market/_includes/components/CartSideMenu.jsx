import { Fragment, useEffect, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { BoltIcon, XMarkIcon } from '@heroicons/react/24/outline';
import Image from "next/image";
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import PosModal from './PosModal';

export default function CartSideMenu(props) {
	const [cartTotal, setCartTotal] = useState(0);
	const [openPos, setOpenPos] = useState(false);

	useEffect(() => {
		setCartTotal(0);
		props?.cartItems?.map((item) => {
			setCartTotal(t => t + item.price)
		})
	}, [props.cartItems.length])

	return (
		<Transition.Root show={props.open} as={Fragment}>
			<Dialog as="div" className="relative z-[100]" onClose={props.setOpen}>
				<Transition.Child
				as={Fragment}
				enter="ease-in-out duration-500"
				enterFrom="opacity-0"
				enterTo="opacity-100"
				leave="ease-in-out duration-500"
				leaveFrom="opacity-100"
				leaveTo="opacity-0"
				>
					<div className="fixed inset-0 bg-opacity-100 transition-opacity backdrop-blur" />
				</Transition.Child>
				<div className="fixed inset-0 overflow-hidden">
					<div className="absolute inset-0 overflow-hidden">
						<div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
							<Transition.Child
								as={Fragment}
								enter="transform transition ease-in-out duration-500 sm:duration-700"
								enterFrom="translate-x-full"
								enterTo="translate-x-0"
								leave="transform transition ease-in-out duration-500 sm:duration-700"
								leaveFrom="translate-x-0"
								leaveTo="translate-x-full"
							>
								<Dialog.Panel className="pointer-events-auto relative w-screen max-w-lg flex">
									<div className="flex h-[90%] w-[85%] flex-col overflow-hidden bg-gradient-to-tr from-[#0F0E20] to-[#2E2C42] py-6 shadow-xl my-auto px-5 rounded-xl">
										<div className="relative top-0 right-0 flex pt-1 pr-4 justify-end">
											<button
												type="button"
												className="rounded-full text-white hover:text-white p-1 border-[#5b5b5b] border-[1px] focus:outline-none"
												onClick={() => props.setOpen(false)}
											>
												<span className="sr-only">Close panel</span>
												<XMarkIcon className="h-6 w-6 text-[#e2e2e2]" aria-hidden="true" />
											</button>
										</div>
										<div className="flex flex-row justify-between align-baseline px-4 sm:px-6 mt-3 sm:mt-5">
											<Dialog.Title className="text-4xl font-bold text-white">Cart</Dialog.Title>
											<button className="flex flex-row bg-transparent text-[#2581EC] font-semibold align-baseline">
												<XMarkIcon className="h-4 w-4 my-auto stroke-2" />
												<span className="my-auto">Clear</span>
											</button>
										</div>
										<div className="relative mt-6 flex-1 px-4 sm:px-6">
											{/* Replace with your content */}
											<div className="absolute inset-0 px-4 sm:px-6">
												<div className="h-full scrollbar overflow-scroll flex flex-col" aria-hidden="true" >
												{
													props?.cartItems?.map((item, index) => {
														return(
															<div key={index} className="flex flex-row rounded-md justify-between my-1">
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
												<div className="rounded-lg mt-auto flex flex-row justify-between px-8 py-3 border-[1px] border-[#5F5F5F] text-white font-bold text-xl">
													<span>Total</span>
													<span>{cartTotal/LAMPORTS_PER_SOL + " SOL"}</span>
												</div>
												<button
													onClick={() => {
														setOpenPos(true)
													}}
													className="py-4 z-[120] flex flex-row justify-center bg-gradient-to-tr from-[#464255] via-[#2D2A35] to-[#2D2A35] rounded-lg mt-4 border-t-[1px] border-x-[1px] border-[#5F5F5F]"
												>
													<span className="text-transparent bg-clip-text bg-gradient-to-t from-[#19B500] to-white font-bold flex flex-row my-auto">
														<BoltIcon className="h-4 w-4 text-[#7fff6b] stroke-2 my-auto mr-1 " />
														Buy Now
													</span>
												</button>
												</div>
												<PosModal openPos={openPos} setOpenPos={setOpenPos} cartItems={props.cartItems} cartTotal={cartTotal} />
											</div>
											{/* /End replace */}
										</div>
									</div>
								</Dialog.Panel>
							</Transition.Child>
						</div>
					</div>
				</div>
			</Dialog>
		</Transition.Root>
	)
}
