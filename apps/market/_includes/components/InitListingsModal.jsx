import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useState, useContext } from 'react'

import { MarketAccountFunctionalities } from '@functionalities/Accounts';
import Link from 'next/link';

export function PhysicalListingsModal(props){
    const {AddVendorPhysicalListings} = MarketAccountFunctionalities();

    let [isOpen, setIsOpen] = useState(true);

    const closeModal = async () => {
		setIsOpen(false)
	}
    const openModal = async() => {
        setIsOpen(true)
    }
    const handleSubmit = () => {
		AddVendorPhysicalListings()
		closeModal()
	}
    return (
        <div>
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
						<Dialog.Panel className="w-full max-w-xl transform overflow-hidden rounded-2xl bg-gradient-to-tr from-[#181424] via-buttontransparent2 to-buttontransparent border-t-[0.5px] border-[#474747] shadow-xl">
							<div className='flex flex-col text-white w-96 h-96 content-center items-center justify-center place-items-center'>
                                <div className='text-4xl font-bold my-8'>
                                    <span className='text-transparent bg-clip-text bg-gradient-to-r from-[#16C7FF] to-[#C625FF]'> Hold on! </span>
                                </div>
                                <div>
                                    Make a catalog first before you list!
                                </div>
                                <div>
                                    That way, your products can be seen by everyone
                                </div>
                                <div className='flex flex-row w-full h-[10%] justify-center gap-x-8 mt-16'>
									<div className='w-full border-2 hover:scale-[105%] ml-8'>
										<div onClick={()=>{AddVendorPhysicalListings()}}>
											<span>Create</span>
										</div>
									</div>
									<div className='w-full border-opacity-60 border-2 hover:scale-[105%] mr-8'>
											<Link href={"/"}>
												<div className='w-full'>
													<div>
													Later
													</div>
												</div>
											</Link>
									</div>
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

export function DigitalListingsModal(props){
    const {AddVendorDigitalListings} = MarketAccountFunctionalities();

    let [isOpen, setIsOpen] = useState(false);

    const closeModal = async () => {
		setIsOpen(false)
	}
    const openModal = async() => {
        setIsOpen(true)
    }
    const handleSubmit = () => {
		AddVendorDigitalListings()
		closeModal()
	}
    return (
        <div>
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

export function CommissionListingsModal(props){
    const {AddVendorCommissionListings} = MarketAccountFunctionalities();

    let [isOpen, setIsOpen] = useState(false);

    const closeModal = async () => {
		setIsOpen(false)
	}
    const openModal = async() => {
        setIsOpen(true)
    }
    const handleSubmit = () => {
		AddVendorCommissionListings()
		closeModal()
	}

    return (
        <div>
            
        </div>
    )

}