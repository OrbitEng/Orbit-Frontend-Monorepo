import { Dialog, Transition, Listbox } from '@headlessui/react'
import Image from "next/image";
import { Fragment, useState, useContext, useCallback, useEffect} from 'react'
import { DigitalProductFunctionalities, PhysicalProductFunctionalities, CommissionProductFunctionalities } from '@functionalities/Products';
import ProductClientCtx from '@contexts/ProductClientCtx';
import { PencilIcon } from "@heroicons/react/24/outline";
import { ArrowLeftIcon, ArrowRightIcon, ChevronDownIcon, InformationCircleIcon, PlusIcon, XCircleIcon } from "@heroicons/react/24/outline";
import { useDropzone } from "react-dropzone";


export function EditPhysicalProductModal(props){
    const {ChangeQuantity, ChangeAvailability, ChangePrice, SetMedia, SetInfo} = PhysicalProductFunctionalities();
    const {productClient} = useContext(ProductClientCtx);

    const [newQuantity, setNewQuantity] = useState(0);
    const [newAvailability, setNewAvailability] = useState(false);
    const [newPrice, setNewPrice] = useState(0);
    const [newMedia, setNewMedia] = useState([]);
    const [newName, setNewName] = useState("");
    const [newDescription, setNewDescription] = useState("");

    useEffect(()=>{
        if(!props.selectedProduct) return;
        console.log(props.selectedProduct)
        setNewQuantity(props.selectedProduct.data.quantity && props.selectedProduct.data.quantity)
        setNewAvailability(props.selectedProduct.data.metadata.availability && props.selectedProduct.data.metadata.availability)
        setNewPrice(props.selectedProduct.data.metadata.price && props.selectedProduct.data.metadata.price.toNumber && props.selectedProduct.data.metadata.price.toNumber())
        setNewMedia(props.selectedProduct.data.metadata.media ? props.selectedProduct.data.metadata.media : [])
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

    const onDrop = (acceptedFiles) => {
        acceptedFiles.forEach((fin)=>{
            const afr = new FileReader()
            afr.onload = () => {
                setNewMedia(cf => [...cf, afr.result]);
            }
            afr.readAsDataURL(fin);
        });
	}
	const {getRootProps, getInputProps, open} = useDropzone({onDrop});

	const deleteFile = (filein)=>{
		let index = newMedia.indexOf(filein);
		if(index == -1){
			return;
		}
		setNewMedia(cf => [...cf.slice(0,index), ...cf.slice(index+1)]);
	}

    const handleUnlistFunction = useCallback(async () => {
        await productClient.UnlistProduct(
            props.selectedProduct.address,
            props.selectedProduct.data.metadata.ownerCatalog
        );
        closeModal()
	}, [props.selectedProduct, productClient])

	const handleSubmitFunction = useCallback(async () => {
        if(!props.selectedProduct) return;
        if (newQuantity != props.selectedProduct.data.quantity){
            await ChangeQuantity(props.selectedProduct.address, newQuantity)
        }
        if (newAvailability != props.selectedProduct.data.metadata.availability){
            await ChangeAvailability(props.selectedProduct.address, newAvailability)
        }
        if (newPrice != props.selectedProduct.data.metadata.price.toNumber()){
            await ChangePrice(props.selectedProduct.address, newPrice)
        }
        if ((newMedia.length > 0) && (newMedia != props.selectedProduct.data.metadata.media)){
            await SetMedia(props.selectedProduct.address, newMedia)
        }
        if ((newName != props.selectedProduct.data.metadata.info.name) || (newDescription != props.selectedProduct.data.metadata.info.description)){
            await SetInfo(props.selectedProduct.address, newName, newDescription)
        }
        closeModal()
	}, [props.selectedProduct, productClient, newQuantity, newAvailability, newPrice, newMedia, newName, newDescription])

    return (
        <div>
            <button
                type="button"
                onClick={openModal}
                className="rounded-full h-fit mt-2 p-2 flex bg-gradient-to-tr from-[#181424] via-buttontransparent2 to-buttontransparent border-t-[0.5px] border-[#474747]"
            >
                <span className='px-2 text-white '>Edit Listing</span>
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
						<Dialog.Panel className="w-full flex flex-col max-w-xl rounded-2xl transform overflow-hidden backdrop-blur bg-gradient-to-t from-[#32254EB3] to-[#26232CE6] border-t-[0.5px] border-[#474747] shadow-xl flex flex-row justify-center">
                                <div className='flex flex-col h-full w-full place-items-center'>
                                    <div className='text-5xl font-bold my-2 mx-auto flex'>
                                        <span className='text-transparent bg-clip-text bg-gradient-to-r from-[#16C7FF] to-[#C625FF] w-full text-center'> Hold on! </span>
                                    </div>
                                    <div className='flex flex-col h-24 w-4/5 my-2'>
                                        <label htmlFor="quantity" className="text-white font-semibold text-xl">Quantity</label>
                                        <div className="flex flex-row gap-x-5 bg-[#171717] text-white place-items-center h-full rounded-lg">
                                            <input
                                                type="number"
                                                className="px-3 pt-3 text-lg focus:outline-0 bg-[#171717] text-[#8E8E8E] placeholder:text-[#4E4E4E] rounded-lg grow"
                                                name="quantity"
                                                id="quantity"
                                                placeholder={newQuantity?.toString()}
                                                value={newQuantity}
                                                onChange={(e) => {setNewQuantity(e.target.value)}}
                                            />
                                            <div className="flex flex-col h-full w-1/4 place-items-center">
                                                <label htmlFor="availability" className="text-white font-semibold text-sm">Availability</label>
                                                <Listbox value={newAvailability} onChange={setNewAvailability} id="availability">
                                                    <div className="flex flex-col relative w-3/4 text-xl h-1/2 justify-end">
                                                        <Listbox.Button className="w-full h-full rounded-lg justify-center">
                                                            <div className='w-full bg-[#242424] rounded-lg overflow-hidden h-4/5 ring-1 ring-inset ring-blue-200'>
                                                                {(newAvailability && newAvailability.toString()) || ""}
                                                            </div>
                                                        </Listbox.Button>
                                                        <Listbox.Options className="w-full text-center absolute -bottom-8 transition rounded-b">
                                                            {
                                                                [true, false].filter(ct => ct!= newAvailability).map((category, id)=>(
                                                                    <Listbox.Option
                                                                        key={id}
                                                                        value = {category}
                                                                        className="w-full bg-[#242424] rounded-lg overflow-hidden h-4/5 ring-1 ring-inset ring-blue-200"
                                                                    >
                                                                        {category.toString()}
                                                                    </Listbox.Option>
                                                                ))
                                                            }
                                                        </Listbox.Options>
                                                    </div>
                                                </Listbox>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-col h-full w-4/5">
                                        <label htmlFor="price" className="text-white font-semibold text-xl">Price</label>
                                        <div className="flex flex-row gap-x-5 bg-[#171717] text-white place-items-center h-full rounded-lg">
                                            <div className="p-3 flex flex-col focus:outline-0 grow">
                                                <input
                                                    className="px-3 pt-3 text-lg focus:outline-0 bg-[#171717] text-[#8E8E8E] placeholder:text-[#4E4E4E] rounded-lg grow"
                                                    placeholder="0.00"
                                                    type="number"
                                                    min="0"
                                                    id="price"
                                                    name="price"
                                                    onChange={(e)=>{
                                                        setNewPrice(e.target.value)
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-col w-4/5 text-white">
                                        <span>Name</span>
                                        <textarea
                                            className="rounded-xl p-3 text-md text-white border-[1px] border-[#444457] bg-[#222429] placeholder:font-bold placeholder:text-[#454545]"
                                            placeholder={newName?.toString()}
                                            value={newName}
                                            onChange={(e) => {setNewName(e.target.value)}}
                                        />
                                    </div>
                                    <div className="flex flex-col w-4/5 text-white">
                                        <span>Description</span>
                                        <textarea
                                            className="rounded-xl p-3 text-md text-white border-[1px] border-[#444457] bg-[#222429] placeholder:font-bold placeholder:text-[#454545]"
                                            placeholder={newDescription?.toString()}
                                            value={newDescription}
                                            onChange={(e) => {setNewDescription(e.target.value)}}
                                        />
                                    </div>
                                    
                                    <span className='text-white'>Media</span>
                                    <div className="flex flex-row text-white py-2 relative">
                                        {
                                            newMedia && newMedia.map((f,fi) => {
                                                return(
                                                    <div className="relative group shrink-0 h-[138px] w-[138px] rounded-sm overflow-hidden border-white border-2" key={fi}>
                                                        <Image
                                                            src={(f) || "/"}
                                                            layout="fill"
                                                            objectFit="cover"
                                                        />
                                                        <XCircleIcon onClick={()=>{deleteFile(f)}} className="absolute top-0 right-0 opacity-0 w-[30px] h-[30px] group-hover:opacity-100 text-red-200"/>
                                                    </div>
                                                )
                                            })
                                        }
                                        <button
                                            className="group flex flex-col bg-transparent border-4 rounded-2xl border-dashed border-[#3D3D3D] h-[138px] w-[138px] transition duration-200 hover:border-[#8E8E8E]"
                                            onClick={open}
                                        >
                                                <PlusIcon className="stroke-[#3D3D3D] h-8 w-8 stroke-[3px] mt-auto mx-auto align-middle group-hover:stroke-[#8E8E8E] transition duration-200" />
                                            <span className="text-[#3D3D3D] font-semibold group-hover:text-[#8E8E8E] align-middle mb-auto mx-auto transition duration-200">Add More</span>
                                        </button>
                                    </div>
                                    <div className='flex flex-row w-full justify-evenly pt-6 pb-2 text-white'>
                                        <button 
                                            className='flex border-[1px] border-[#5B5B5B] font-bold hover:scale-[105%] px-4 py-2 rounded-lg'
                                            onClick={handleSubmitFunction}
                                        >
                                            <span>Make Changes</span>
                                        </button>
                                        <button 
                                            className='flex border-[1px] border-[#5B5B5B] font-bold hover:scale-[105%] px-4 py-2 rounded-lg text-white'
                                            onClick={handleUnlistFunction}
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