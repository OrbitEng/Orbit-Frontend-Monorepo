import Image from "next/image";
import { Fragment, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useDropzone } from "react-dropzone";
import { CheckIcon, ChevronLeftIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { CommissionFunctionalities } from "@functionalities/Transactions";


export function CommissionRequestModal(props) {
	const [statusMessage, setStatusMessage] = useState("percent completed");
    const [openRequestModal, setOpenRequestModal] = useState(false);

	const [transactions, setTransactions] = useState(props.transactions);
	const {SellerEarlyDeclineSol, SellerEarlyDeclineSpl, SellerAcceptTransaction} = CommissionFunctionalities();


	return(
		<Transition show={props.open} as={Fragment}>
			<Dialog as="div" className="fixed z-[260]" onClose={() => props.setOpen(false)}>
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
					leave="ease-in duration-[200ms]"
					leaveFrom="opacity-100 scale-100"
					leaveTo="opacity-0 scale-95"
				>
					<Dialog.Panel className={`w-[860px] transform overflow-hidden rounded-2xl backdrop-blur bg-opacity-[56%] bg-gradient-to-t from-[#26232C] to-[#32254E] border-t-[0.5px] border-[#474747] text-left align-middle shadow-xl transition-all duration-500`}>
						<div className="flex flex-col rounded-xl py-10 px-[4rem] w-full transition duration-700  h-[80vh]">
							<div className="top-0 left-0 flex flex-row pt-1 justify-center">
								<h1 className="text-3xl text-white font-bold">Commission Request</h1>
								<div className="flex-grow"/>
								<button
									type="button"
									className="rounded-full text-white hover:text-white p-1 border-[#5b5b5b] border-[1px] focus:outline-none"
									onClick={() => props.setOpen(false)}
								>
									<span className="sr-only">Close panel</span>
									<XMarkIcon className="h-6 w-6 text-[#e2e2e2]" aria-hidden="true" />
								</button>
							</div>

							<div className="h-[60%] border-[#545454] border-[1px] bg-[#26232C] bg-opacity-[56%] rounded-lg">
								{
									transactions.map((tx)=>{
										<div className="relative flex flex-row w-[90%] h-1/3 rounded-lg bg-[#7E7E7E]">
											<div className="relative w-1/4 h-full">
												<Image 
													src={tx.data.metadata.product.data.metadata.media}
													layout="fill"
													objectFit="cover"
												/>
											</div>

											<div>
												{tx.data.metadata.product.data.metadata.name}
											</div>
											<div className="w-16 h-full bg-[#02421e]" onClick={()=>{SellerAcceptTransaction(tx.address)}}>
												<CheckIcon className="text-green-700"/>
											</div>
											<div className="w-16 h-full bg-[#54000b]" onClick={tx.data.metadata.currency.toString() == "11111111111111111111111111111111" ? ()=>{SellerEarlyDeclineSol(tx.address)} : ()=>{SellerEarlyDeclineSpl(tx.address)}}>
												<XMarkIcon className="text-green-700"/>
											</div>
										</div>
									})
								}
							</div>

						</div>
					</Dialog.Panel>
				</Transition.Child>
				</div>
			</div>
			</Dialog>
		</Transition>
	)
} 