import { useRouter } from "next/router";
import { useState, useContext, useEffect, useRef, useCallback, Fragment } from "react";
import { ArrowLeftIcon, ArrowRightIcon, ChevronDownIcon, InformationCircleIcon, PlusIcon, TrashIcon, CheckIcon, CameraIcon, PlusCircleIcon} from "@heroicons/react/24/outline";
import { PRODUCT_PROGRAM, TRANSACTION_PROGRAM } from "orbit-clients";
import { CommissionProductFunctionalities, DigitalProductFunctionalities, PhysicalProductFunctionalities } from "@functionalities/Products";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { Transaction } from "@solana/web3.js";
import { Transition, Listbox } from "@headlessui/react";
import { useDropzone } from "react-dropzone";
import { PhysicalProductForm, DigitalProductForm, CommissionProductForm } from "@includes/components/forms/SellTypesForm";
import onClickOutside from "@hooks/onClickOutside";
import UserAccountCtx from "@contexts/UserAccountCtx";
import Link from "next/link";
import Image from "next/image";

const token_addresses = {
	mainnet: {
		"solana": "11111111111111111111111111111111",
		"usdc": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"
	},
	devnet: {
		"solana": "11111111111111111111111111111111",
		"usdc":"4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU"
	}
}

export function SellLayout(props){
	const router = useRouter();
	const wallet = useWallet();
    const {connection} = useConnection();

	const {ListPhysicalProduct} = PhysicalProductFunctionalities();
	const {ListDigitalProduct} = DigitalProductFunctionalities();
	const {ListCommissionProduct} = CommissionProductFunctionalities();
    const {userAccount} = useContext(UserAccountCtx);

	const [price, setProdPrice] = useState();
	const [prodName, setProdName] = useState("");
    const [delivery, setDelivery] = useState(14);
	const [description, setDescription] = useState("");
    const [listRecent, setListRecent] = useState(false);
	
	const [files, setFiles] = useState([]);
    const [fileName, setFileNames] = useState([]);
    
    const [listingType, setListingType] = useState("physical");

	const [subtypeObject, setSubtypeObject] = useState({});
	const [tags, setTags] = useState([]);
	const [additionalInfo, setAdditionalInfo] = useState([]);

	const [tagInput, setTagInput] = useState(false);
	const [newTagValue, setNewTagValue] = useState("");

	const [extraInfo, setExtraInfo] = useState([]);
	const [extraInfoText, setExtraInfoText] = useState("");

	const onInputDeselect = useRef();
	const tagDeselectHandler = useCallback(()=>{
		if((newTagValue.length > 0) && (tags.indexOf(newTagValue) == -1)){
			setTags(cts => [...cts, newTagValue]);
		}
		setTagInput(false);
		setNewTagValue("");
	},[tags, newTagValue])

	const onExtraneousDeselect = useRef();
	const extraneousDeselectHandler = useCallback(()=>{
		if(extraInfoText.length > 0 && (extraInfo.indexOf(extraInfoText) == -1)){
			setExtraInfo(exinf => [...exinf, extraInfoText])
		};
		setExtraInfoText("");
	},[extraInfoText, extraInfo]);

	onClickOutside(onInputDeselect, tagDeselectHandler);
	onClickOutside(onExtraneousDeselect, extraneousDeselectHandler);

	const changeTypeHandler = useCallback((newType)=>{
		setListingType(newType);
		setTags([]);
		setExtraInfo([]);
		setAdditionalInfo([]);
	},[])

    const listProductHandler = useCallback(async ()=>{
        if(!(userAccount?.data?.voterId && wallet.publicKey && connection)) return;

        let latest_blockhash = await connection.getLatestBlockhash();
		let tx = new Transaction({
			feePayer: wallet.publicKey,
			... latest_blockhash
		});
        

		switch(listingType){
			case "physical":
				if(!userAccount.data.physicalListings){
					tx.add(
						await PRODUCT_PROGRAM.InitPhysicalListings(
							wallet,
							userAccount
						)
					);
				}
				if(!userAccount.data.sellerPhysicalTransactions){
					tx.add(
						await TRANSACTION_PROGRAM.CreatePhysicalSellerTransactionsLog(
							wallet,
							userAccount
						)
					);
				}
				break;
			case "digital":
				if(!userAccount.data.digitalListings){
					tx.add(
						await PRODUCT_PROGRAM.InitDigitalListings(
							wallet,
							userAccount
						)
					);
				}
				if(!userAccount.data.sellerDigitalTransactions){
					tx.add(
						await TRANSACTION_PROGRAM.CreateDigitalSellerTransactionsLog(
							wallet,
							userAccount
						)
					);
				}
				break;
			case "commission":
				if(!userAccount.data.commissionListings){
					tx.add(
						await PRODUCT_PROGRAM.InitCommissionListings(
							wallet,
							userAccount
						)
					);
				}
				if(!userAccount.data.sellerCommissionTransactions){
					tx.add(
						await TRANSACTION_PROGRAM.CreateCommissionSellerTransactionsLog(
							wallet,
							userAccount
						)
					);
				}
				break;
		}

        let [addixs, data_items] = await (async ()=>{
			switch(listingType){
				case "physical":
					return ListPhysicalProduct(
						userAccount,
						price,
						delivery,
						prodName,
						description,
						quantity,
						files,
						listRecent,
						wallet
					)
				case "digital":
					return ListDigitalProduct(
						userAccount,
						price,
						delivery,
						prodName,
						description,
						files,
						"Image",
						listRecent,
						wallet
					)
				case "commission":
					return ListCommissionProduct(
						userAccount,
						price,
						delivery,
						prodName,
						description,
						files,
						listRecent,
						wallet
					)
				}
			}
		)();

        tx.add(...addixs);

        await wallet.signTransaction(tx);

        console.log("sending")
		let sig = await wallet.sendTransaction(tx, connection);
		
		let confirmation  = await connection.confirmTransaction({
			...latest_blockhash,
			signature: sig,
		});
		
		await bundlrClient.SendTxItems(data_items, sig);

    },[userAccount?.data, listingType, price, delivery, prodName, description, files, listRecent, wallet, PRODUCT_PROGRAM.PRODUCT_PROGRAM._provider.connection, TRANSACTION_PROGRAM.TRANSACTION_PROGRAM._provider.connection]);

	const addFile = (acceptedFiles) => {
        acceptedFiles.forEach((fin)=>{
            const afr = new FileReader()
            afr.onload = () => {
                setFiles(cf => [...cf, afr.result]);
            }
            afr.readAsDataURL(fin);

            setFileNames(fn => [...fn, fin.name+fin.type]);
        });
	}

	const deleteFile = (filein)=>{
		let index = files.indexOf(filein);
		if(index == -1){
			return;
		}
		setFiles(cf => [...cf.slice(0,index), ...cf.slice(index+1)]);
        setFileNames(fn => [...fn.slice(0,index), ...fn.slice(index+1)]);
	}

	const {getRootProps, getInputProps, open} = useDropzone({onDrop: addFile});


    return(
		<div className="flex flex-col justify-around max-w-6xl w-full h-full content-center gap-y-6 align-center my-auto  mx-auto min-h-view">
			<h1 className="text-white font-bold text-4xl mt-10">Create Listing</h1>
			<button onClick={() => router.back()} className="flex flex-row space-x-1 mb-10 align-middle">
				<ArrowLeftIcon className="h-5 w-5 text-[#767676] my-auto" />
			</button>
				<div className="flex flex-col gap-y-6 ">
					<label htmlFor="title" className="text-white font-semibold text-xl">Listing Title</label>
					<input
						className="rounded-lg p-3 text-lg focus:outline-0 bg-[#100e13] ring-2 ring-inset ring-[#1b1a1a] text-[#8E8E8E] placeholder:text-[#4E4E4E]"
						placeholder="Enter Title"
						type="text"
						id="title"
						name="title"
						onChange={(e)=>{setProdName(e.target.value)}}
					/>
				</div>
				<div className="flex flex-col gap-y-6 w-full">
					<div className="text-white font-semibold text-xl">Listing Images</div>
					<div {...getRootProps()} className="grid grid-cols-6 gap-x-2 overflow-x-auto w-full h-52 p-6 bg-[#100e13] rounded-lg ring-2 ring-inset ring-[#1b1a1a]">
						<input {...getInputProps()}/>
						{
							files && files.map((fileDataUrl)=>(
								<div className="relative flex flex-col items-center overflow-hidden rounded-2xl" onClick={()=>{deleteFile(fileDataUrl)}}>
									<Image
										src={fileDataUrl}
										layout="fill"
										objectFit="cover"
									/>
								</div>
							))
						}
						<div className="relative flex flex-col items-center justify-center border-4 border-dashed border-[#5e5e5e] rounded-2xl">
							<div className="w-1/2 h-1/2">
								<CameraIcon className="text-[#5e5e5e]"/>
							</div>
							<span className="align-middle text-center text-sm font-bold text-[#5e5e5e]">Upload Media</span>
						</div>
					</div>
				</div>
				<div className="flex flex-col gap-y-6 w-full">
					<label htmlFor="title" className="text-white font-semibold text-xl">Category</label>
					<Listbox value={listingType} onChange={changeTypeHandler}>
						<div className="flex flex-col bg-[#100e13] text-lg rounded-lg overflow-hidden">
							<Listbox.Button className="flex flex-row text-[#D9D9D9] px-4 py-2">
								<div className="grow text-left">
									{listingType}
								</div>
								<ChevronDownIcon className="h-8"/>
							</Listbox.Button>
							<Transition
								as={Fragment}
								leave="transition ease-in duration-100"
								leaveFrom="opacity-100"
								leaveTo="opacity-0"
							>
								<Listbox.Options className="overflow-auto py-1 max-h-96 bg-[#181424] backdrop-blur backdrop-filter rounded-lg">
									<Listbox.Option
										value={"physical"}
										className="relative cursor-default select-none py-2 pl-10 pr-4"
									>
										{({ active, selected }) => (
											<span className={`block truncate ${active ? 'text-[#D9D9D9]' : 'text-[#878787]'}`}>{"physical"}</span>
										)}
									</Listbox.Option>
									<Listbox.Option
										value={"digital"}
										className="relative cursor-default select-none py-2 pl-10 pr-4"
									>
										{({ active, selected }) => (
											<span className={`block truncate ${active ? 'text-[#D9D9D9]' : 'text-[#878787]'}`}>{"digital"}</span>
										)}
									</Listbox.Option>
									<Listbox.Option
										value={"commission"}
										className="relative cursor-default select-none py-2 pl-10 pr-4"
									>
										{({ active, selected }) => (
											<span className={`block truncate ${active ? 'text-[#D9D9D9]' : 'text-[#878787]'}`}>{"commission"}</span>
										)}
									</Listbox.Option>
								</Listbox.Options>
							</Transition>
						</div>
					</Listbox>
				</div>
				{
					((listingType == "physical") && <PhysicalProductForm setMetaInf={setSubtypeObject}/>) ||
					((listingType == "digital") && <DigitalProductForm setMetaInf={setSubtypeObject}/>) ||
					((listingType == "commission") && <CommissionProductForm setMetaInf={setSubtypeObject}/>)
				}
				<div className="flex flex-col h-full">
					<label htmlFor="price" className="text-white font-semibold text-xl">Price</label>
					<input
						className="rounded-lg p-3 text-lg text-right focus:outline-0 bg-[#100e13] ring-2 ring-inset ring-[#1b1a1a] text-[#8E8E8E] placeholder:text-[#4E4E4E]"
						placeholder="0.00"
						type="number"
						min="0"
						id="price"
						name="price"
						onChange={(e)=>{
							setProdPrice(e.target.value)
						}}
					/>
					<div className="flex flex-row pt-2 my-auto text-[#777777] ">
						<span className="text-sm pr-1">Selling Fee</span>
						<InformationCircleIcon className="h-5 w-5 text-yellow-400 pt-1" />
						<span className="grow text-right pr-3">{((price * 0.05) || "0.00")}</span>
					</div>
					<div className="flex flex-row align-middle mt-1 text-[#8E8E8E] ">
						<span className="text-sm pr-1">You Earn</span>
						<span className="grow text-right pr-3">{((price * 0.95) || "0.00")}</span>
					</div>
				</div>
				
				<div className="flex flex-col gap-y-6">
					<label htmlFor="description" className="text-white font-semibold text-xl">Description</label>
					<textarea
						className="p-3 h-96 text-lg focus:outline-0 bg-[#171717] text-[#8E8E8E] placeholder:text-[#4E4E4E] rounded-lg"
						id="description"
						name="description"
						placeholder="What are you selling?"
						onChange={(e)=>{setDescription(e.target.value)}}
					/>
				</div>
				<div className="flex flex-col gap-y-6">
					<label htmlFor="description" className="text-white font-semibold text-xl">Tags</label>
					<div className="flex flex-row gap-x-2 text-white align-center">
						{
							tagInput ? <input ref={onInputDeselect}
							onChange={(e)=>{setNewTagValue(e.target.value)}}
							onKeyDown={(e)=>{
								if(e.key == "Enter"){
									tagDeselectHandler()
								}
							}}
							type="text" 
							className="rounded-lg px-2 focus:outline-0 ring-2 ring-inset bg-[#100e13] ring-[#1b1a1a] text-[#8E8E8E]" /> : <></>
						}
						{
							tags?.map((tag, tagind)=>{
							return <div
									className="py-2 px-3 text-lg rounded-3xl outline-0 bg-[#100e13] ring-2 ring-inset ring-[#1b1a1a] text-[#8E8E8E]"
									key={"tag"+tagind}
									onClick={()=>{
										let ind  = tags.indexOf(tag);
										setTags( ct => ct.slice(0, ind).concat(ct.slice(ind+1)));
									}}
									>
									{tag}
									</div>
							})
						}
						<div className="h-8 w-8 my-auto grid-cols-1 rounded-3xl overflow-hidden bg-[#1b1630]" onClick={()=>{setTagInput(true)}}>
							<PlusIcon className="text-[#836ae8] w-6 h-6 m-1"/>
						</div>
					</div>
				</div>
				<div className="flex flex-col gap-y-6">
					<label htmlFor="description" className="text-white font-semibold text-xl">Other Properties</label>
					<div className="flex flex-row gap-x-2">
						{
							extraInfo && 
							extraInfo.map((extrainf, extraind)=>(
								<div
									className="flex flex-row bg-[#171717] text-[#575059] rounded-md ring-2 ring-inset ring-[#1b1a1a] py-1 px-2 align-center"
									key={extraind+"extraneous"}
									onClick={()=>{
										let ind  = extraInfo.indexOf(extrainf);
										setExtraInfo( ct => ct.slice(0, ind).concat(ct.slice(ind+1)));
									}}
								>
								{extrainf}
								</div>
							))
						}

						<div
							className="w-28 flex flex-row bg-[#171717] text-[#575059] rounded-md ring-2 ring-inset ring-[#1b1a1a] py-1 px-2 align-center"
						>
							<input
								onChange={(e)=>{
									setExtraInfoText(e.target.value)
								}}
								ref = {onExtraneousDeselect}
								onKeyDown={(e)=>{
									if(e.key == "Enter"){
										extraneousDeselectHandler()
									}
								}}
								value={extraInfoText}
								className="bg-[#171717] placeholder:text-[#2b282f] outline-0 w-20"
								placeholder="extra info"
							/>
							<div className="rounded-3xl bg-[#100e13] text-[#8E8E8E] my-1">
								<PlusIcon className="text-[#8E8E8E] w-4 h-4"/>
							</div>
						</div>
					</div>
				</div>
				<div className="w-full flex flex-row text-white justify-center" onClick={()=>{setListRecent(!listRecent)}}>
					<input type={"checkbox"} checked={listRecent}  onChange={()=>{setListRecent(!listRecent)}} className=""/>
					<span className="mx-8">have product displayed in "recent listings" on the front page</span>
				</div>
				<div className="bg-[#A637F0] bg-opacity-[15%] px-8 mt-4 rounded-full flex justify-center mx-auto hover:scale-105 transition duration-200 ease-in-out">
					<button className="text-transparent py-3 bg-clip-text font-bold bg-gradient-to-tr from-[#8BBAFF] to-[#D55CFF] mx-auto text-3xl rounded-full" onClick={async ()=>{
						await listProductHandler()   
					}}>
						List Item
					</button>
				</div>
		</div>
	)
}