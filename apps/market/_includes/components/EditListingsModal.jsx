import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useState, useContext, useCallback } from 'react'
import ProductClientCtx from '@contexts/ProductClientCtx';
import { DigitalProductFunctionalities, PhysicalProductFunctionalities, CommissionProductFunctionalities } from '@functionalities/Products';
import { PencilIcon } from "@heroicons/react/24/outline";
import { useEffect } from 'react';

export function EditPhysicalProductModal(props){
    const {ChangeQuantity, ChangeAvailability, ChangePrice, ChangeCurrency, SetMedia, SetInfo} = PhysicalProductFunctionalities();
    const {productClient} = useContext(ProductClientCtx)

    const [newQuantity, setNewQuantity] = useState();
    const [newAvailability, setNewAvailability] = useState();
    const [newPrice, setNewPrice] = useState();
    const [newCurrency, setNewCurrency] = useState();
    const [newMedia, setNewMedia] = useState();
    const [newName, setNewName] = useState();
    const [newDescription, setNewDescription] = useState();

    useEffect(()=>{
        if(!props.selectedProduct) return;
        console.log(props.selectedProduct)
        setNewQuantity(props.selectedProduct.data.quantity)
        setNewAvailability(props.selectedProduct.data.metadata.availablity && props.selectedProduct.data.metadata.availablity)
        setNewPrice(props.selectedProduct.data.metadata.price.toNumber())
        setNewCurrency(props.selectedProduct.data.metadata.currency.toString())
        setNewMedia(props.selectedProduct.data.metadata.media && props.selectedProduct.data.metadata.media)
        setNewName(props.selectedProduct.data.metadata.info && props.selectedProduct.data.metadata.info.name && props.selectedProduct.data.metadata.info.name)
        setNewDescription(props.selectedProduct.data.metadata.info && props.selectedProduct.data.metadata.info.description && props.selectedProduct.data.metadata.info.description)
    },[props.selectedProduct, props.selectedProduct.data.metadata.availablity])


    const [isOpen, setIsOpen] = useState(false);

    function closeModal() {
        setIsOpen(false)
    }
    
    function openModal() {
        setIsOpen(true)
    }

	const handleSubmitFunction = useCallback(async () => {
        if(!props.selectedProduct) return;

        closeModal()
	}, [props.selectedProduct, productClient])

    return (
        <div>
            <button
                type="button"
                onClick={openModal}
                className="rounded-full h-fit mt-2 p-2 flex bg-gradient-to-tr from-[#181424] via-buttontransparent2 to-buttontransparent border-t-[0.5px] border-[#474747]"
            >
                <PencilIcon className="text-white h-4 w-4 my-auto stroke-2"/>
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
					
						<Dialog.Panel className="w-full max-w-xl rounded-2xl transform overflow-hidden backdrop-blur bg-gradient-to-t from-[#32254EB3] to-[#26232CE6] border-t-[0.5px] border-[#474747] shadow-xl">
							<div className='flex flex-col text-white w-full max-w-md h-fit text-center'>
                                <div className='text-5xl font-bold my-2 mx-auto flex'>
                                    <span className='text-transparent bg-clip-text bg-gradient-to-r from-[#16C7FF] to-[#C625FF]'> Hold on! </span>
                                </div>
                                <div>
                                    <textarea
                                        className="rounded-xl p-3 text-md text-white border-[1px] border-[#444457] bg-[#222429] placeholder:font-bold placeholder:text-[#454545]"
                                        placeholder={newQuantity?.toString()}
                                        value={newQuantity}
                                        onChange={(e) => {setNewQuantity(e.target.value)}}
                                    />
                                </div>
                                <div>
                                    <textarea
                                        className="rounded-xl p-3 text-md text-white border-[1px] border-[#444457] bg-[#222429] placeholder:font-bold placeholder:text-[#454545]"
                                        placeholder={newAvailability?.toString()}
                                        value={newAvailability}
                                        onChange={(e) => {setNewAvailability(e.target.value)}}
                                    />
                                </div>
                                <div>
                                    <textarea
                                        className="rounded-xl p-3 text-md text-white border-[1px] border-[#444457] bg-[#222429] placeholder:font-bold placeholder:text-[#454545]"
                                        placeholder={newPrice?.toString()}
                                        value={newPrice}
                                        onChange={(e) => {setNewPrice(e.target.value)}}
                                    />
                                </div>
                                <div>
                                    <textarea
                                        className="rounded-xl p-3 text-md text-white border-[1px] border-[#444457] bg-[#222429] placeholder:font-bold placeholder:text-[#454545]"
                                        placeholder={newCurrency?.toString()}
                                        value={newCurrency}
                                        onChange={(e) => {setNewCurrency(e.target.value)}}
                                    />
                                </div>
                                <div>
                                    <textarea
                                        className="rounded-xl p-3 text-md text-white border-[1px] border-[#444457] bg-[#222429] placeholder:font-bold placeholder:text-[#454545]"
                                        placeholder={newMedia?.toString()}
                                        value={newMedia}
                                        onChange={(e) => {setNewMedia(e.target.value)}}
                                    />
                                </div>
                                <div>
                                    <textarea
                                        className="rounded-xl p-3 text-md text-white border-[1px] border-[#444457] bg-[#222429] placeholder:font-bold placeholder:text-[#454545]"
                                        placeholder={newName?.toString()}
                                        value={newName}
                                        onChange={(e) => {setNewName(e.target.value)}}
                                    />
                                </div>
                                <div>
                                    <textarea
                                        className="rounded-xl p-3 text-md text-white border-[1px] border-[#444457] bg-[#222429] placeholder:font-bold placeholder:text-[#454545]"
                                        placeholder={newDescription?.toString()}
                                        value={newDescription}
                                        onChange={(e) => {setNewDescription(e.target.value)}}
                                    />
                                </div>
                                <div className='flex flex-row w-full justify-evenly pt-6 pb-2'>
									<button 
										className='flex border-[1px] border-[#5B5B5B] font-bold hover:scale-[105%] px-4 py-2 rounded-lg'
										onClick={handleSubmitFunction}
									>
										<span>Make Changes</span>
									</button>
                                    <button 
										className='flex border-[1px] border-[#5B5B5B] font-bold hover:scale-[105%] px-4 py-2 rounded-lg'
										onClick={handleSubmitFunction}
									>
										<span>Unlist</span>
									</button>
                                </div>
                            </div>
						</Dialog.Panel>
					
				</Transition.Child>
				</div>
			</div>
			</Dialog>
		</Transition>
        </div>
    )
}

export function EditDigitalProductModal(props){
    const {SetFileType, ChangeAvailability, ChangePrice, ChangeCurrency, SetMedia, SetInfo} = DigitalProductFunctionalities();
    const {productClient} = useContext(ProductClientCtx)

    const [newFileType, setNewFileType] = useState();
    const [newAvailability, setNewAvailability] = useState();
    const [newPrice, setNewPrice] = useState();
    const [newCurrency, setNewCurrency] = useState();
    const [newMedia, setNewMedia] = useState();
    const [newInfo, setNewInfo] = useState();


    const [isOpen, setIsOpen] = useState(false);

    function closeModal(){
		setIsOpen(false)
	}

    function openModal(){
        setIsOpen(true)
    }

	const handleSubmitFunction = useCallback(async () => {
		
        closeModal()
	}, [props.selectedProduct, productClient])

    return (
        <div>
            <button
                type="button"
                onClick={openModal}
                className="rounded-full h-fit my-auto p-2 flex bg-gradient-to-tr from-[#181424] via-buttontransparent2 to-buttontransparent border-t-[0.5px] border-[#474747]"
            >
                <PencilIcon className="text-white h-4 w-4 my-auto stroke-2"/>
            </button>
            <div className='flex flex-col rounded-2xl max-w-md bg-gradient-to-t from-[#32254E78] to-[#26232C9C] border-t border-x border-[#545454] border-opacity-30 py-10 px-[4rem] mx-auto w-full'>

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
                            
                                <Dialog.Panel className="w-full max-w-xl rounded-2xl transform overflow-hidden backdrop-blur bg-gradient-to-t from-[#32254EB3] to-[#26232CE6] border-t-[0.5px] border-[#474747] shadow-xl">
                                    <div className="relative top-0 right-0 flex pt-1 pr-4 justify-end">
                                        <button
                                            type="button"
                                            className="rounded-full text-white hover:text-white p-1 border-[#5b5b5b] border-[1px] focus:outline-none"
                                            onClick={() => setIsOpen(false)}
                                        >
                                            <span className="sr-only">Close panel</span>
                                        </button>
                                    </div>
                                    <div className='flex flex-col text-white w-max max-w-md h-fit text-center p-6'>
                                        <div className='text-5xl font-bold my-2 mx-auto flex'>
                                            <span className='text-transparent bg-clip-text bg-gradient-to-r from-[#16C7FF] to-[#C625FF]'> Hold on! </span>
                                        </div>
                                        <div>
                                            <textarea
                                                className="rounded-xl p-3 text-md text-white border-[1px] border-[#444457] bg-[#222429] placeholder:font-bold placeholder:text-[#454545]"
                                                placeholder="Enter FileType"
                                                value={newFileType}
                                                onChange={(e) => {setNewFileType(e.target.value)}}
                                            />
                                        </div>
                                        <div>
                                            <textarea
                                                className="rounded-xl p-3 text-md text-white border-[1px] border-[#444457] bg-[#222429] placeholder:font-bold placeholder:text-[#454545]"
                                                placeholder="Enter Availability"
                                                value={newAvailability}
                                                onChange={(e) => {setNewAvailability(e.target.value)}}
                                            />
                                        </div>
                                        <div>
                                            <textarea
                                                className="rounded-xl p-3 text-md text-white border-[1px] border-[#444457] bg-[#222429] placeholder:font-bold placeholder:text-[#454545]"
                                                placeholder="Enter Price"
                                                value={newPrice}
                                                onChange={(e) => {setNewPrice(e.target.value)}}
                                            />
                                        </div>
                                        <div>
                                            <textarea
                                                className="rounded-xl p-3 text-md text-white border-[1px] border-[#444457] bg-[#222429] placeholder:font-bold placeholder:text-[#454545]"
                                                placeholder="Enter Currency"
                                                value={newCurrency}
                                                onChange={(e) => {setNewCurrency(e.target.value)}}
                                            />
                                        </div>
                                        <div>
                                            <textarea
                                                className="rounded-xl p-3 text-md text-white border-[1px] border-[#444457] bg-[#222429] placeholder:font-bold placeholder:text-[#454545]"
                                                placeholder="Enter Media"
                                                value={newMedia}
                                                onChange={(e) => {setNewMedia(e.target.value)}}
                                            />
                                        </div>
                                        <div>
                                            <textarea
                                                className="rounded-xl p-3 text-md text-white border-[1px] border-[#444457] bg-[#222429] placeholder:font-bold placeholder:text-[#454545]"
                                                placeholder="Enter Info"
                                                value={newInfo}
                                                onChange={(e) => {setNewInfo(e.target.value)}}
                                            />
                                        </div>
                                        <div className='flex flex-row w-full justify-evenly pt-6 pb-2'>
                                            <button 
                                                className='flex border-[1px] border-[#5B5B5B] font-bold hover:scale-[105%] px-4 py-2 rounded-lg'
                                                onClick={handleSubmitFunction}
                                            >
                                                <span>Make Changes</span>
                                            </button>
                                            <button 
                                                className='flex border-[1px] border-[#5B5B5B] font-bold hover:scale-[105%] px-4 py-2 rounded-lg'
                                                onClick={handleSubmitFunction}
                                            >
                                                <span>Unlist</span>
                                            </button>
                                        </div>
                                    </div>
                                </Dialog.Panel>
                            
                        </Transition.Child>
                        </div>
                    </div>
                    </Dialog>
                </Transition>
            </div>
        </div>
    )
}