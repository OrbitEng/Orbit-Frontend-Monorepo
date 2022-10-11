import { Dialog, Transition } from "@headlessui/react"
import { useState, useContext, Fragment } from "react";
import MarketAccountsCtx from "@contexts/MarketAccountsCtx";
import { MarketAccountFunctionalities } from "@functionalities/Accounts";
import { EllipsisHorizontalIcon } from "@heroicons/react/24/outline";
import { EditModal } from "@includes/components/SignupForum";

export default function EditProfileButton(props) {
	let [isOpen, setIsOpen] = useState(false);
	const [nickName, setNickName] = useState("");
	const {marketAccountsClient, setMarketAccountsClient} = useContext(MarketAccountsCtx);

	const {SetPfp} = MarketAccountFunctionalities();

	const closeModal = async () => {
		setIsOpen(false)
	}

	const EditAccount = async () => {
		CreateAccount({nickname: nickName}, undefined, undefined);
		props.setMarketAccount(
			await marketAccountsClient.GetAccount(
				marketAccountsClient.GenAccountAddress(props.connectedWallet.publicKey)[0]
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
			className="rounded-full h-fit my-auto p-1 flex bg-gradient-to-tr from-[#181424] via-buttontransparent2 to-buttontransparent border-t-[0.5px] border-[#474747]"
		>
			<EllipsisHorizontalIcon className="text-white h-5 w-5 my-auto"/>
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
					<div>
						<div className="absolute -inset-0 w-full h-full bg-black z-0 rounded-2xl" />
						<Dialog.Panel className="w-full max-w-xl transform overflow-hidden rounded-2xl bg-gradient-to-tr from-[#181424] via-buttontransparent2 to-buttontransparent border-t-[0.5px] border-[#474747] text-left align-middle shadow-xl transition-all">
							<EditModal/>
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