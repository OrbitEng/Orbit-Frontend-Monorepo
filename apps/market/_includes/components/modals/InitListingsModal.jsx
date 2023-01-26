import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useState, useContext, useCallback } from 'react'
import { MarketAccountFunctionalities } from '@functionalities/Accounts';
import Link from 'next/link';
import { useWallet } from '@solana/wallet-adapter-react';
import { PRODUCT_PROGRAM, TRANSACTION_PROGRAM } from 'orbit-clients';

export function CatalogWarnModal(props){
    const {
		AddVendorPhysicalListings, AddVendorCommissionListings, AddVendorDigitalListings,
		AddSellerPhysicalTransactions, AddSellerDigitalTransactions, AddSellerCommissionTransactions
	} = MarketAccountFunctionalities();
	const wallet = useWallet();

    const [isOpen, setIsOpen] = useState(true);

    const closeModal = async () => {
		setIsOpen(false)
	}

    const openModal = async() => {
        setIsOpen(true)
    }

	const handleSubmitFunction = useCallback(async () => {
		switch(props.category) {
			case "physical":
				if(props.setCatalog){
					await AddVendorPhysicalListings();
					await props.setCatalog(
						await PRODUCT_PROGRAM.GetListingsStruct(PRODUCT_PROGRAM.GenListingsAddress("physical"))
					)
				}

				if(props.setTxLog){
					await AddSellerPhysicalTransactions();
					await props.setTxLog(
						await TRANSACTION_PROGRAM.GetSellerOpenTransactions(TRANSACTION_PROGRAM.GenSellerTransactionLog("physical"))
					)
				}

				break;
			case "digital":
				if(props.setCatalog){
					await AddVendorDigitalListings();
					await props.setCatalog(
						await PRODUCT_PROGRAM.GetListingsStruct(PRODUCT_PROGRAM.GenListingsAddress("digital"))
					)
				}

				if(props.setTxLog){
					await AddSellerDigitalTransactions();
					await props.setTxLog(
						await TRANSACTION_PROGRAM.GetSellerOpenTransactions(TRANSACTION_PROGRAM.GenSellerTransactionLog("digital"))
					)
				}
				break;
			case "commission":
				if(props.setCatalog){
					await AddVendorCommissionListings();
					await props.setCatalog(
						await PRODUCT_PROGRAM.GetListingsStruct(PRODUCT_PROGRAM.GenListingsAddress("commission"))
					)
				}
				
				if(props.setTxLog){
					await AddSellerCommissionTransactions();
					await props.setTxLog(
						await TRANSACTION_PROGRAM.GetSellerOpenTransactions(TRANSACTION_PROGRAM.GenSellerTransactionLog("commission"))
					)
				}
				break;
		}
        closeModal()
	}, [props.setCatalog, props.setTxLog, props.category, PRODUCT_PROGRAM.PRODUCT_PROGRAM._provider.connection, TRANSACTION_PROGRAM.TRANSACTION_PROGRAM._provider.connection, wallet])

    return (
        <div>
            <Transition appear show={isOpen} as={Fragment}>
			<Dialog as="div" className="relative z-[100]" onClose={() => {}} static={true}>
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
                                    Make a catalog first before you list!
                                </span>
                                <span>
                                    That way, your products can be seen by everyone
                                </span>
                                <div className='flex flex-row w-full justify-evenly pt-6 pb-2'>
									<button 
										className='flex border-[1px] border-[#5B5B5B] font-bold hover:scale-[105%] px-4 py-2 rounded-lg'
										onClick={handleSubmitFunction}
									>
										<span>Create</span>
									</button>
									<Link href={"/"}>
										<div className='flex border-[1px] border-[#5B5B5B] font-bold hover:scale-[105%] px-4 py-2 rounded-lg'>
												Later
										</div>
									</Link>
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