import { useState, useContext, useEffect, useCallback } from "react";
import Image from "next/image";
import { ArrowLeftIcon, ArrowRightIcon, ChevronDownIcon, InformationCircleIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useDropzone } from "react-dropzone";
import { Listbox } from "@headlessui/react";
import { PRODUCT_PROGRAM, TRANSACTION_PROGRAM } from "orbit-clients";

import {PhysicalProductFunctionalities} from "@functionalities/Products";
import Link from "next/link";

import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import UserAccountCtx from "@contexts/UserAccountCtx";
import { Transaction } from "@solana/web3.js";


export function PhysicalUploadForm(props) {
    const wallet = useWallet();
    const {connection} = useConnection();

	const {ListProduct} = PhysicalProductFunctionalities();
    const {userAccount} = useContext(UserAccountCtx);

	const [price, setProdPrice] = useState();
	const [takeHomeMoney, setTakeHomeMoney] = useState();
	const [prodName, setProdName] = useState("");
    const [delivery, setDelivery] = useState(14);
    const [quantity, setQuantity] = useState(0);
	const [description, setDescription] = useState("");
    const [listRecent, setListRecent] = useState(false);
	
	const [files, setFiles] = useState([]);
    const [fileName, setFileNames] = useState([]);
    const [bigPreviewSrc, setBigPreviewSrc] = useState(null);
    
    const listProductWrapper = useCallback(async ()=>{
        if(!(userAccount?.data?.voterId && wallet.publicKey && connection)) return;

        let latest_blockhash = await connection.getLatestBlockhash();
		let tx = new Transaction({
			feePayer: wallet.publicKey,
			... latest_blockhash
		});
        
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

        console.log("making")
        let [addixs, data_items] = await ListProduct(
            userAccount,
            price,
            delivery,
            prodName,
            description,
            quantity,
            files,
            listRecent,
            wallet
        );

        tx.add(...addixs);

        await wallet.signTransaction(tx);

        console.log("sending")
		let sig = await wallet.sendTransaction(tx, connection);
		
		let confirmation  = await connection.confirmTransaction({
			...latest_blockhash,
			signature: sig,
		});
		
		await bundlrClient.SendTxItems(data_items, sig);

    },[userAccount?.data, price, delivery, prodName, description, quantity, files, listRecent, wallet, PRODUCT_PROGRAM.PRODUCT_PROGRAM._provider.connection, TRANSACTION_PROGRAM.TRANSACTION_PROGRAM._provider.connection]);

	const onDrop = (acceptedFiles) => {
        acceptedFiles.forEach((fin)=>{
            const afr = new FileReader()
            afr.onload = () => {
                setFiles(cf => [...cf, afr.result]);
            }
            afr.readAsDataURL(fin);

            setFileNames(fn => [...fn, fin.name+fin.type]);
        });

        const bfr = new FileReader()
		bfr.onload = () => {
			setBigPreviewSrc(bfr.result)
		}
		bfr.readAsDataURL(acceptedFiles[0]);
	}
	const {getRootProps, getInputProps, open} = useDropzone({onDrop});

	const deleteFile = (filein)=>{
		let index = files.indexOf(filein);
		if(index == -1){
			return;
		}
		setFiles(cf => [...cf.slice(0,index), ...cf.slice(index+1)]);
        setFileNames(fn => [...fn.slice(0,index), ...fn.slice(index+1)]);
        
        if(bigPreviewSrc == filein) setBigPreviewSrc(undefined);
	}

	return(
        <div className="w-full min-h-screen bg-transparent">
                <div className="pt-14 lg:pt-32 sm:-mt-32 max-w-7xl align-center mx-auto min-h-view">
                    <div className="flex flex-col w-full mx-auto my-auto content-center max-w-5xl min-h-screen">
                    <h1 className="text-white font-bold text-4xl mt-10">Create New Physical Product</h1>
                    <Link href={"/sell"}>
                    <button className="flex flex-row space-x-1 mb-10 align-middle">
                        <ArrowLeftIcon className="h-5 w-5 text-[#767676] my-auto" />
                        <div className="text-[#767676] text-xl my-auto">Back to Categories</div>
                    </button>
                    </Link>
                    <div className="grid grid-flow-row grid-cols-12 grid-rows-1 justify-between mb-12 overflow-hidden text-ellipsis gap-x-10">
                            {
                                    bigPreviewSrc ? 
                                        <div className="w-full h-full col-span-7 relative flex ">
                                            <Image
                                                src={bigPreviewSrc}
                                                layout="fill"
                                                objectFit="contain"
                                            />
                                        </div>
                                        :   
                                        <div className="w-full h-full col-span-7">
                                            <div className="flex flex-col mb-2 leading-tight">
                                                <h3 className="font-bold text-white text-xl">Upload Preview</h3>
                                                <span className="text-[#767676] mb-2">Formats: jpg, mp4, png</span>
                                            </div>
                                            <div {...getRootProps()} className="flex flex-col border-4 border-dashed border-[#3D3D3D] rounded-2xl w-full h-96 content-center align-middle py-12 px-28">
                                                <input {...getInputProps()}/>
                                                    <div className="relative flex h-52 mx-16">
                                                        <Image
                                                            src="/PhotoIcon.png"
                                                            layout="fill"
                                                            objectFit="contain"
                                                        />
                                                    </div>
                                                <div className="flex flex-col">
                                                    <span className="align-middle text-center my-auto mx-auto text-2xl font-bold text-white">Drag & Drop Files</span>	
                                                    <span className="align-middle mx-auto text-[#AD61E8] font-bold">Or import png,svg,mp4,gif</span>
                                                </div>
                                            </div>
                                        </div>
                        }
                        <div className="flex flex-col col-span-5 flex-none flex-grow-0 h-full overflow-ellipsis">
                            <div className="top-0 bg-transparent backdrop-blur-lg">
                                <div className="flex flex-col mb-2 leading-tight">
                                    <h3 className="font-bold text-white text-xl">Import Content</h3>
                                    <span className="text-[#767676] mb-2">Formats: jpg, mp4, png</span>
                                </div>
                                <div className="flex justify-center bg-[#171717] rounded-2xl py-4 mx-auto w-full shadow-lg">
                                    <button className="bg-[#383838] font-bold text-white rounded-full mx-auto w-1/2 p-2" onClick={open}>
                                        Choose File
                                    </button>
                                </div>
                            </div>
                                
                            <div className="flex flex-col w-full h-76 my-4 gap-y-4 overflow-scroll scrollbar scrollbar-thumb-[#5B5B5B] scrollbar-track-[#8E8E8E] scrollbar-thumb-rounded-full scrollbar-track-rounded-full">
                                {
                                    files && files?.map((f,fi) => {
                                        return(
                                            <div className="flex flex-row flex-none w-full bg-[#171717] rounded-full py-3 px-2 justify-around truncate" key={f.name + fi}>
                                                <span className="flex flex-none justify-center flex-row gap-x-1 text-white font-semibold basis-3/4 align-middle mx-auto my-auto truncate" onClick={()=>{setBigPreviewSrc(f)}}>
                                                    Uploaded file:
                                                    <span className="font-semibold basis-1/2 flex-none text-[#AD61E8] truncate">{fileName[fi]}</span>
                                                </span>
                                                <button className="flex flex-grow-0 p-1 align-middle my-auto mx-auto basis-1/4 justify-center" onClick={()=>{
                                                    deleteFile(f);
                                                }}>
                                                    <TrashIcon className="flex text-white h-6 w-6"/>
                                                </button>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col gap-y-6 mb-32">
                        <div className="flex flex-col">
                            <label htmlFor="title" className="text-white font-semibold text-xl">Listing Title</label>
                            <input
                                className="rounded-lg p-3 text-lg focus:outline-0 bg-[#171717] text-[#8E8E8E] placeholder:text-[#4E4E4E]"
                                placeholder="Enter Title"
                                type="text"
                                id="title"
                                name="title"
                                onChange={(e)=>{setProdName(e.target.value)}}
                            />
                        </div>
                        <div className="flex flex-col h-full">
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
                                            setProdPrice(e.target.value)
                                            setTakeHomeMoney((e.target.value*95)/100)
                                        }}
                                    />
                                    <div className="px-3 text-[#8E8E8E] align-middle my-auto">{(takeHomeMoney || "0.00")}</div>
                                </div>
                            </div>
                            <div className="flex flex-row gap-x-1 align-middle mt-1">
                                <InformationCircleIcon className="h-5 w-5 text-yellow-400 my-auto" />
                                <span className="font-semibold text-[#767676] align-middle my-auto">Sale Fee: 5%</span>
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <label htmlFor="description" className="text-white font-semibold text-xl">Stock</label>
                            <input
                                className="rounded-lg p-3 text-lg focus:outline-0 bg-[#171717] text-[#8E8E8E] placeholder:text-[#4E4E4E]"
                                placeholder="Quantity"
                                type="number"
                                min="1"
                                id="qty"
                                name="qty"
                                onChange={(e)=>{setQuantity(e.target.value)}}
                            />
                        </div>
                        <div className="flex flex-col">
                            <label htmlFor="description" className="text-white font-semibold text-xl">Delivery</label>
                            <input
                                className="rounded-lg p-3 text-lg focus:outline-0 bg-[#171717] text-[#8E8E8E] placeholder:text-[#4E4E4E]"
                                placeholder="Delivery ETA"
                                type="number"
                                min="1"
                                id="delivery"
                                name="delivery"
                                onChange={(e)=>{setDelivery(e.target.value)}}
                            />
                        </div>
                        <div className="flex flex-col">
                            <label htmlFor="description" className="text-white font-semibold text-xl">Description</label>
                            <textarea
                                className="p-3 h-96 text-lg focus:outline-0 bg-[#171717] text-[#8E8E8E] placeholder:text-[#4E4E4E] rounded-lg"
                                id="description"
                                name="description"
                                placeholder="What are you selling?"
                                onChange={(e)=>{setDescription(e.target.value)}}
                            />
                        </div>
                        <div className="w-full flex flex-row text-white justify-center" onClick={()=>{setListRecent(!listRecent)}}>
                            <input type={"checkbox"} checked={listRecent}  onChange={()=>{setListRecent(!listRecent)}} className=""/>
                            <span className="mx-8">have product displayed in "recent listings" on the front page</span>
                        </div>
                        <div className="bg-[#A637F0] bg-opacity-[15%] px-8 mt-4 rounded-full flex justify-center mx-auto hover:scale-105 transition duration-200 ease-in-out">
                            <button className="text-transparent py-3 bg-clip-text font-bold bg-gradient-to-tr from-[#8BBAFF] to-[#D55CFF] mx-auto text-3xl rounded-full" onClick={async ()=>{
                                await listProductWrapper()   
                            }}>
                                List Item
                            </button>
                        </div>	
                    </div>
                    </div>
                </div>
            </div>
    )
}