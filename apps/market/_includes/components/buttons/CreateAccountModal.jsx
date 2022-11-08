import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useState, useContext } from 'react'
import {SignupForm} from '@includes/components/forms/SignupForm';

export default function CreateAccountModal(props) {
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
			className="px-4 py-2 text-sm whitespace-nowrap font-medium text-white focus:outline-none"
		>
			Create Account
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
				<div className="fixed inset-0 backdrop-blur-lg" />
			</Transition.Child>
			<div className="fixed inset-0 overflow-y-auto bg-transparent">
				<div className="flex min-h-full items-center justify-center p-4 text-center bg-transparent">
				<Transition.Child
					as={Fragment}
					enter="ease-out duration-300"
					enterFrom="opacity-0 scale-95"
					enterTo="opacity-100 scale-100"
					leave="ease-in duration-200"
					leaveFrom="opacity-100 scale-100"
					leaveTo="opacity-0 scale-95"
				>
					<Dialog.Panel className="w-full bg-transparent max-w-[30rem] transform overflow-hidden rounded-2xl text-left align-middle transition-all">
						<SignupForm setOpen={setIsOpen} />
					</Dialog.Panel>
				</Transition.Child>
				</div>
			</div>
			</Dialog>
		</Transition>
    </div>
  )
}