import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useState, useContext } from 'react'

import MarketAccountsCtx from '@contexts/MarketAccountsCtx';
import { MarketAccountFunctionalities } from '@functionalities/Accounts';
import {SignupForm} from '@includes/components/SignupForm';

export default function CreateAccountButton(props) {
	let [isOpen, setIsOpen] = useState(false);
	const [nickName, setNickName] = useState("");
	const {marketAccountsClient, setMarketAccountsClient} = useContext(MarketAccountsCtx);

	const {CreateAccount} = MarketAccountFunctionalities();

	const closeModal = async () => {
		setIsOpen(false)
	}

	const createAccount = async () => {
		CreateAccount({nickname: nickName}, undefined, undefined);
		props.setMarketAccount(
			await marketAccountsClient.GetAccount(
				marketAccountsClient.GenAccountAddress(props.connectedWallet.publicKey)
			)
		)
	}

	const handleSubmit = () => {
		createAccount()
		closeModal()
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
					<div>
						<div className="absolute -inset-0 w-full h-full bg-black z-0 rounded-2xl" />
						<Dialog.Panel className="w-full max-w-xl transform overflow-hidden rounded-2xl bg-gradient-to-tr from-[#181424] via-buttontransparent2 to-buttontransparent border-t-[0.5px] border-[#474747] text-left align-middle shadow-xl transition-all">
							<SignupForm/>
						</Dialog.Panel>
					</div>
				</Transition.Child>
				</div>
			</div>
			</Dialog>
		</Transition>
    </div>
  )
}