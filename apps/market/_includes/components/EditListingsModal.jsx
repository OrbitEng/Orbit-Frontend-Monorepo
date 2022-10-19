import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useState, useContext, useCallback, useEffect} from 'react'
import { DigitalProductFunctionalities, PhysicalProductFunctionalities, CommissionProductFunctionalities } from '@functionalities/Products';
import ProductClientCtx from '@contexts/ProductClientCtx';
import { PencilIcon } from "@heroicons/react/24/outline";
import { useDropzone } from "react-dropzone";

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

    const [mediaFiles, setMediaFiles] = useState("");

    const mediaFileCallback = useCallback((acceptedFiles) => {
		const reader = new FileReader()
		reader.onload = () => {
			setMediaFiles(reader.result)
		}
		reader.readAsDataURL(acceptedFiles[0]);
	}, [])
	const {getRootProps, getInputProps, open} = useDropzone({onDrop: mediaFileCallback});

    useEffect(()=>{
        if(!props.selectedProduct) return;
        console.log(props.selectedProduct)
        setNewQuantity(props.selectedProduct.data.quantity)
        setNewAvailability(props.selectedProduct.data.metadata.availability)
        setNewPrice(props.selectedProduct.data.metadata.price.toNumber())
        setNewCurrency(props.selectedProduct.data.metadata.currency.toString())
        setNewMedia(props.selectedProduct.data.metadata.media && props.selectedProduct.data.metadata.media)
        setNewName(props.selectedProduct.data.metadata.info && props.selectedProduct.data.metadata.info.name && props.selectedProduct.data.metadata.info.name)
        setNewDescription(props.selectedProduct.data.metadata.info && props.selectedProduct.data.metadata.info.description && props.selectedProduct.data.metadata.info.description)
    },[props.selectedProduct])


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
					
						<Dialog.Panel className="w-full max-w-xl rounded-2xl transform overflow-hidden backdrop-blur bg-gradient-to-t from-[#32254EB3] to-[#26232CE6] border-t-[0.5px] border-[#474747] shadow-xl flex flex-row justify-center">
                                <div className='flex flex-col text-white w-full max-w-lg h-fit text-center'>
                                    <div className='text-5xl font-bold my-2 mx-auto flex'>
                                        <span className='text-transparent bg-clip-text bg-gradient-to-r from-[#16C7FF] to-[#C625FF]'> Hold on! </span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span>Quantity</span>
                                        <textarea
                                            className="rounded-xl p-3 text-md text-white border-[1px] border-[#444457] bg-[#222429] placeholder:font-bold placeholder:text-[#454545]"
                                            placeholder={newQuantity?.toString()}
                                            value={newQuantity}
                                            onChange={(e) => {setNewQuantity(e.target.value)}}
                                        />
                                    </div>
                                    <div className="flex flex-col">
                                        <span>Availability</span>
                                        <textarea
                                            className="rounded-xl p-3 text-md text-white border-[1px] border-[#444457] bg-[#222429] placeholder:font-bold placeholder:text-[#454545]"
                                            placeholder={newAvailability?.toString()}
                                            value={newAvailability}
                                            onChange={(e) => {setNewAvailability(e.target.value)}}
                                        />
                                    </div>
                                    <div className="flex flex-col">
                                        <span>Price</span>
                                        <textarea
                                            className="rounded-xl p-3 text-md text-white border-[1px] border-[#444457] bg-[#222429] placeholder:font-bold placeholder:text-[#454545]"
                                            placeholder={newPrice?.toString()}
                                            value={newPrice}
                                            onChange={(e) => {setNewPrice(e.target.value)}}
                                        />
                                    </div>
                                    <div className="flex flex-col">
                                        <span>Currency</span>
                                        <textarea
                                            className="rounded-xl p-3 text-md text-white border-[1px] border-[#444457] bg-[#222429] placeholder:font-bold placeholder:text-[#454545]"
                                            placeholder={newCurrency?.toString()}
                                            value={newCurrency}
                                            onChange={(e) => {setNewCurrency(e.target.value)}}
                                        />
                                    </div>
                                    <div className="flex flex-col">
                                        <span>Media</span>
                                        <textarea
                                            className="rounded-xl p-3 text-md text-white border-[1px] border-[#444457] bg-[#222429] placeholder:font-bold placeholder:text-[#454545]"
                                            placeholder={newMedia?.toString()}
                                            value={newMedia}
                                            onChange={(e) => {setNewMedia(e.target.value)}}
                                        />
                                    </div>
                                    <div className="flex flex-col">
                                        <span>Name</span>
                                        <textarea
                                            className="rounded-xl p-3 text-md text-white border-[1px] border-[#444457] bg-[#222429] placeholder:font-bold placeholder:text-[#454545]"
                                            placeholder={newName?.toString()}
                                            value={newName}
                                            onChange={(e) => {setNewName(e.target.value)}}
                                        />
                                    </div>
                                    <div className="flex flex-col">
                                        <span>Description</span>
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