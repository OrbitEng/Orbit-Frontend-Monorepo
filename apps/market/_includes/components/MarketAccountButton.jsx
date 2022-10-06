import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useState, useContext } from 'react'

import MarketAccountsCtx from '@contexts/MarketAccountsCtx';
import { MarketAccountFunctionalities } from '@functionalities/Accounts';

export default function MarketAccountButton(props) {
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
    <>
		<button
			type="button"
			onClick={openModal}
			className="px-4 py-2 text-sm font-medium text-white focus:outline-none"
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
				<div className="fixed inset-0 bg-black bg-opacity-50" />
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
					<Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-gradient-to-tr from-[#181424] via-buttontransparent2 to-buttontransparent border-t-[0.5px] border-[#474747] p-6 text-left align-middle shadow-xl transition-all">
						<Dialog.Title
							as="h3"
							className="text-lg font-medium leading-6 text-white"
						>
						Create Your Account
						</Dialog.Title>
						<div className="flex flex-col mt-2 gap-y-2">
							<p className="text-sm text-gray-500">
							Your market account is your portal to the Orbit network, it lets you buy and sell items as well as earn revenue!
							</p>
							<div className="flex flex-col">
								<label className="text-gray-500 font-bold">Nickname</label>
								<input type="text" value={nickName} onChange={(e) => {setNickName(e.target.value)}}/>
							</div>
						</div>
						<div className="mt-4">
							<button
							type="button"
							className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
							onClick={handleSubmit}
							>
								Create Account!
							</button>
						</div>
					</Dialog.Panel>
				</Transition.Child>
				</div>
			</div>
			</Dialog>
		</Transition>
    </>
  )
}