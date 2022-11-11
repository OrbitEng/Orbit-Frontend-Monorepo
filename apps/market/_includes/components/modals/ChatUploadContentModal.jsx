import { Fragment, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { ChevronLeftIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { Wallet } from "@project-serum/anchor";
import { CommissionFunctionalities, DigitalFunctionalities, PhysicalFunctionalities } from "@functionalities/Transactions";


export default function ChatUploadContentModal(props) {
	const {CommitPreview, ProposeRate} = CommissionFunctionalities();

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
					<Dialog.Panel className={`max-w-xl w-full transform overflow-hidden rounded-2xl backdrop-blur bg-gradient-to-t from-[#32254EB3] to-[#26232CE6] border-t-[0.5px] border-[#474747] text-left align-middle shadow-xl transition-all duration-500`}>
						<div className="flex flex-col rounded-xl py-10 px-[4rem] w-full transition duration-700">
							<div className="relative top-0 left-0 flex pt-1 pr-1 justify-end">
								<button
									type="button"
									className="rounded-full text-white hover:text-white p-1 border-[#5b5b5b] border-[1px] focus:outline-none"
									onClick={() => props.setOpen(false)}
								>
									<span className="sr-only">Close panel</span>
									<XMarkIcon className="h-6 w-6 text-[#e2e2e2]" aria-hidden="true" />
								</button>
							</div>
							<div className="flex flex-col mt-3 mb-4 mr-auto">
								<h1 className="text-3xl text-white font-bold">Commission Request</h1>
								{
									props?.walletAddr ? 
									<span className="text-md text-[#9C9C9C] font-bold">{"Wallet:" + props.wallet}</span> :
									<div className="bg-[#535353] animate-pulse h-4 w-48 rounded" />
								}
							</div>
							<div className="flex flex-col border-[#545454] border-[1px] bg-[#3C3C3C] bg-opacity-[44%] h-60 rounded-xl">
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
