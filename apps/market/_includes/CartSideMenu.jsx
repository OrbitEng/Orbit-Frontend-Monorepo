import { Fragment, useContext, useEffect, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { BoltIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { CartFunctionalities } from '@functionalities/Cart';
import PythClientCtx from "@contexts/PythClientCtx";
import Image from "next/image";
import PosModal from './components/modals/PosModal';
import CartCtx from '@contexts/CartCtx';

export default function CartSideMenu(props) {
	const [openPos, setOpenPos] = useState(false);
	const [solPrice, setSolPrice] = useState();
	const {pythClient} = useContext(PythClientCtx);

	useEffect(async ()=>{
		if(!pythClient)return
		setSolPrice((await pythClient.GetSolUsd()).aggregate.price);
	},[pythClient])

	const {DeleteItem} = CartFunctionalities();
	const {cart, setCart} = useContext(CartCtx);

	useEffect(() => {
		let tmpTotal = 0;
		cart?.items?.map((item) => {
			tmpTotal += item.data.metadata.price.toNumber();
		})
		setCart(cart => ({items: cart.items, total: tmpTotal}))
	}, [cart?.items?.length]);

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
					<div className="fixed inset-0 bg-opacity-100 transition-opacity backdrop-blur-xl" />
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
									<div className="flex h-[90%] w-[85%] flex-col overflow-hidden bg-gradient-to-t from-[#32254E78] to-[#26232C9C] border-t border-x border-[#545454] border-opacity-30 py-6 shadow-xl my-auto px-5 rounded-xl">
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
											<button
												className="flex flex-row bg-transparent text-[#2581EC] font-semibold align-baseline"
												onClick={() => {
													setCart({
														items:[],
														total: 0
													})
												}}
											>
												<XMarkIcon className="h-4 w-4 mt-auto mb-1 stroke-2" />
												<span className="mt-auto">Clear</span>
											</button>
										</div>
										<div className="relative mt-6 flex-1 px-4 sm:px-6">
											{/* Replace with your content */}
											<div className="absolute inset-0 px-4 sm:px-6">
												<div className="h-full scrollbar overflow-scroll flex flex-col px-4" aria-hidden="true" >
													<div className="flex flex-col pb-auto h-full mb-4 border-y-[0.5px] border-[#535353] py-3">
														{
															cart?.items?.map((item, index) => {
																return(
																	<div key={index} className="flex flex-row rounded-md justify-between my-2">
																		<div className="flex flex-row flex-shrink-0 mr-8">
																			<div className="relative flex flex-shrink-0 h-12 w-12 rounded-md mr-3">
																				<button 
																					onClick={() => {
																						DeleteItem(index)
																					}}
																					className="inline-flex z-[120] absolute font-serif bg-red-500 bg-opacity-80 -top-1 -right-1 h-4 w-4 rounded-full justify-center items-center text-xs"
																				>
																					<XMarkIcon className="h-3 w-3 text-white stroke-[3px]"/>
																				</button>
																				<Image 
																					className="rounded-md"
																					layout="fill"
																					src={(item?.data?.metadata?.media?.length && item.data.metadata.media[0]) || "/demologos.png"}
																					objectFit="contain"
																				/>
																			</div>
																			<div className="flex flex-col justify-start my-auto">
																				<span className="text-white font-bold -mb-1">{item.data.metadata.info.name}</span>
																				<span className="text-[#868686] text-xs">{item.data.metadata.seller.data.metadata.name}</span>
																			</div>
																		</div>
																		<div className="flex flex-col justify-self-end text-center w-fit truncate">
																			<span className="text-white font-bold -mb-1 truncate">{(item.data.metadata.price/solPrice).toFixed(9) + " SOL"}</span>
																			<span className="text-white font-bold text-xs truncate">${item.data.metadata.price.toNumber()}</span>
																		</div>
																	</div>
																)
															})
														}
													</div>
													<div className="flex flex-col">
														<div className="rounded-lg flex flex-row justify-between px-8 py-3 border-[1px] border-[#5F5F5F] text-white font-bold text-xl">
															<span>Total</span>
															<span>{(cart.total > 0 ? (cart.total/solPrice).toFixed(4) : "--") + " SOL"}</span>
														</div>
														<button
															onClick={() => {
																setOpenPos(true)
															}}
															className="py-4 z-[120] flex flex-row justify-center bg-gradient-to-tr from-[#464255A6] via-[#2D2A35A6] to-[#2D2A35A6] rounded-lg mt-4"
														>
															<span className="text-transparent bg-clip-text bg-gradient-to-t from-[#19B500] to-white font-bold flex flex-row my-auto">
																<BoltIcon className="h-4 w-4 text-[#7fff6b] stroke-2 my-auto mr-1 " />
																Buy Now
															</span>
														</button>
														<PosModal openPos={openPos} setOpenPos={setOpenPos} cart={cart} setCart={setCart} solPrice={solPrice}/>
													</div>
												</div>
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
