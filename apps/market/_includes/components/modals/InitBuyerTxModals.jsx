import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useState, useContext, useCallback } from 'react'
import { MarketAccountFunctionalities } from '@functionalities/Accounts';
import TransactionClientCtx from "@contexts/TransactionClientCtx";
import { useWallet } from '@solana/wallet-adapter-react';

export function BuyerTxLogModal(props){
    const {
		AddBuyerPhysicalTransactions,
        AddBuyerDigitalTransactions,
        AddBuyerCommissionTransactions,
	} = MarketAccountFunctionalities();
	const {transactionClient} = useContext(TransactionClientCtx);
	const wallet = useWallet();

    const [isOpen, setIsOpen] = useState(false);

    const closeModal = async () => {
		setIsOpen(false)
	}

    const openModal = async() => {
        setIsOpen(true)
    }

	const handleSubmitFunction = useCallback(async () => {
		if(!(transactionClient && wallet.connected)) return;
		switch(props.category) {
			case "physical":
				if(props.setTxLog){
					await AddBuyerPhysicalTransactions();
					await props.setTxLog(
						await transactionClient.GetBuyerOpenTransactions(transactionClient.GenBuyerTransactionLog("physical", wallet.publicKey))
					)
				}

				break;
			case "digital":
				if(props.setTxLog){
					await AddBuyerDigitalTransactions();
					await props.setTxLog(
						await transactionClient.GetBuyerOpenTransactions(transactionClient.GenBuyerTransactionLog("digital", wallet.publicKey))
					)
				}
				break;
			case "commission":
				if(props.setTxLog){
					await AddBuyerCommissionTransactions();
					await props.setTxLog(
						await transactionClient.GetBuyerOpenTransactions(transactionClient.GenBuyerTransactionLog("commission", wallet.publicKey))
					)
				}
				break;
		}
        closeModal()
	}, [props.setTxLog, props.category, transactionClient, wallet])

    return (
        <div>
            <button
				type="button"
				onClick={openModal}
				className="rounded-full text-white h-fit my-auto p-2 flex bg-gradient-to-tr from-[#181424] via-buttontransparent2 to-buttontransparent border-t-[0.5px] border-[#474747]"
			>
				Create Logs
			</button>
            <Transition appear show={isOpen} as={Fragment}>
			<Dialog as="div" className="relative z-[100]" onClose={closeModal} static={true}>
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
						<Dialog.Panel className="w-full max-w-xl rounded-2xl transform overflow-hidden backdrop-blur bg-gradient-to-t from-[#32254EB3] to-[#26232CE6] border-t-[0.5px] border-[#474747] shadow-xl">
							<div className='flex flex-col text-white w-max max-w-md h-fit text-center p-6'>
                                <div className='text-5xl font-bold my-2 mx-auto flex'>
                                    <span className='text-transparent bg-clip-text bg-gradient-to-r from-[#16C7FF] to-[#C625FF]'> Hold on! </span>
                                </div>
                                <span>
                                    Make a Transactions Log before you buy!
                                </span>
                                <span>
                                    This is to help keep track of what orders you have open
                                </span>
                                <div className='flex flex-row w-full justify-evenly pt-6 pb-2'>
									<button 
										className='flex border-[1px] border-[#5B5B5B] font-bold hover:scale-[105%] px-4 py-2 rounded-lg'
										onClick={handleSubmitFunction}
									>
										<span>Create</span>
									</button>
									<button onClick={closeModal}>
                                        <div className='flex border-[1px] border-[#5B5B5B] font-bold hover:scale-[105%] px-4 py-2 rounded-lg'>
												Later
										</div>
                                    </button>
                                </div>
                            </div>
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