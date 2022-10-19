import { Dialog, Transition } from "@headlessui/react"
import { useState, useContext, Fragment } from "react";
import MarketAccountsCtx from "@contexts/MarketAccountsCtx";
import { MarketAccountFunctionalities } from "@functionalities/Accounts";
import { PencilIcon } from "@heroicons/react/24/outline";
import { EditModal } from "@includes/components/SignupForm";

export default function EditProfileButton(props) {
	let [isOpen, setIsOpen] = useState(false);

	const closeModal = async () => {
		setIsOpen(false)
	}
	const openModal = async() => {
		setIsOpen(true)
	}

  return (
    <div>
		<button
			type="button"
			onClick={openModal}
			className="rounded-full h-fit my-auto p-2 flex bg-gradient-to-tr from-[#181424] via-buttontransparent2 to-buttontransparent border-t-[0.5px] border-[#474747]"
		>
			<PencilIcon className="text-white h-4 w-4 my-auto stroke-2"/>
		</button>
		<Transition appear show={isOpen} as={Fragment}>
			<Dialog as="div" className="relative z-[100]" onClose={closeModal}>
			<Transition.Child
				as={Fragment}
				enter="ease-out duration-300"
				enterFrom="opacity-0"
				enterTo="opacity-100"
				leave="ease-in duration-200"
				leaveFrom="opacity-100"
				leaveTo="opacity-0"
			>
				<div className="fixed inset-0 backdrop-blur-xl" />
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
					<Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl text-left align-middle shadow-xl transition-all">
						<EditModal currentAccount={props.currentAccount}/>
					</Dialog.Panel>
				</Transition.Child>
				</div>
			</div>
			</Dialog>
		</Transition>
    </div>
  )
}