import { useState, useContext, useEffect } from "react";
import { HeaderSearchBar } from "@includes/components/SearchBar";
import { HomeHeader } from "@includes/MarketHeader";
import { MainFooter } from "@includes/Footer";
import Head from "next/head";
import Image from "next/image";
import { ArrowLeftIcon, ArrowRightIcon, ChevronDownIcon, InformationCircleIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useDropzone } from "react-dropzone";
import { Listbox } from "@headlessui/react";

import {PhysicalProductFunctionalities} from "@functionalities/Products";
import ProductClientCtx from "@contexts/ProductClientCtx";
import { CatalogWarnModal } from "@includes/components/InitListingsModal";
import Link from "next/link";

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

export function PhysicalUploadForm(props) {
    const [ searchBar, setSearchBar ] = useState(<HeaderSearchBar />);

	const {ListProduct} = PhysicalProductFunctionalities();
	const {productClient} = useContext(ProductClientCtx);

	const [price, setProdPrice] = useState();
	const [takeHomeMoney, setTakeHomeMoney] = useState();
	const [currency, setCurrency] = useState("solana");
	const [prodName, setProdName] = useState("");
    const [delivery, setDelivery] = useState(14);
    const [quantity, setQuantity] = useState(0);
	const [description, setDescription] = useState("");
    const [listRecent, setListRecent] = useState(false);
	
	const [files, setFiles] = useState([]);
    const [bigPreviewSrc, setBigPreviewSrc] = useState(null);

	const [vendorPhysicalCatalog, setVendorPhysicalCatalog] = useState("");

	useEffect(async()=>{
        if(!productClient)return;
		try{
			let vc = await productClient.GetListingsStruct(productClient.GenListingsAddress("physical"));
			if(vc && vc.data){
				setVendorPhysicalCatalog(vc)
			}
		}catch(e){
            console.log("init listing render err: ", e)
            setVendorPhysicalCatalog(undefined)
		}
	},[productClient])

	const tokenlist = token_addresses[process.env.NEXT_PUBLIC_CLUSTER_NAME];

	const onDrop = (acceptedFiles) => {
		setFiles(cf => [...cf, ...acceptedFiles]);
        setBigPreviewSrc(acceptedFiles[0]);
	}
	const {getRootProps, getInputProps, open} = useDropzone({onDrop});

	const deleteFile = (filein)=>{
		let index = files.indexOf(filein);
		if(index == -1){
			return;
		}
		setFiles(cf => [...cf.slice(0,index), ...cf.slice(index+1)]);
        if(bigPreviewSrc == filein) setBigPreviewSrc(undefined);
	}

	return(
        <div>
            {(vendorPhysicalCatalog == undefined) && <CatalogWarnModal category={"physical"} setCatalog={setVendorPhysicalCatalog}/>}
                <div className="w-full min-h-screen bg-transparent">
                    <Head>
                        <title>Orbit</title>
                        <link rel="icon" href="orbit.png" />
                    </Head>
                    <main className="bg-[url('/oldbgWallpaper.png')] bg-cover min-h-screen">
                    <HomeHeader headerMiddle={searchBar}/>
                    <div className={"pt-14 lg:pt-32 sm:-mt-32 max-w-7xl align-center mx-auto min-h-view"}>
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
                                                    src={URL.createObjectURL(bigPreviewSrc)}
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
                                                        Uploaded file:{" "}
                                                        <span className="font-semibold basis-1/2 flex-none text-[#AD61E8] truncate">{f.name}{f.type}</span>
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
                        <div>
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
                                    <div className="flex flex-col w-1/6 h-full justify-center">
                                        <Listbox value={currency} onChange={setCurrency}>
                                            <div className="flex relative w-3/4 text-xl h-1/2 justify-end">
                                                <Listbox.Button className="flex w-full h-full bg-[#242424] rounded-lg p-1 justify-center">{
                                                    <div className="flex flex-row align-middle">
                                                        <span className="my-auto align-middle">
                                                            <Image
                                                                layout="fixed"
                                                                src={"/" + currency + "SvgLogo.svg"}
                                                                height={16}
                                                                width={16}
                                                            />
                                                        </span>
                                                        <span className="align-middle my-auto mx-1 font-medium">{
                                                            (currency === "usdc") ?
                                                            currency.toUpperCase() :
                                                            currency?.charAt(0).toUpperCase() + currency.slice(1)
                                                        }</span>
                                                        <ChevronDownIcon className="text-white h-5 w-5 my-auto align-middle"/>
                                                    </div>
                                                }</Listbox.Button>
                                                <Listbox.Options className="w-full text-center absolute -bottom-6 transition rounded-b bg-[#242424]">
                                                    {
                                                        Object.keys(tokenlist).filter(tn => tn != currency).map((tokenname, index)=>{
                                                            return (
                                                                <Listbox.Option
                                                                    key = {index}
                                                                    value = {tokenname}
                                                                    className={({active})=>{
                                                                        `w-full py-1 ${active? "bg-[#2c2c2c] font-medium rounded-b" : ""}`
                                                                    }}
                                                                >
                                                                    {({selected})=>{
                                                                        return (
                                                                            <div className="font-medium">{
                                                                                (tokenname === "usdc") ?
                                                                                (tokenname.toUpperCase()) :
                                                                                (tokenname.charAt(0).toUpperCase() + tokenname.slice(1))
                                                                            }</div>
                                                                        )
                                                                    }}
                                                                </Listbox.Option>
                                                            )
                                                        })
                                                    }
                                                </Listbox.Options>
                                            </div>
                                        </Listbox>
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
                                <input type={"checkbox"} checked={listRecent}  className=""/>
                                <span className="mx-8">have product displayed in "recent listings" on the front page</span>
                            </div>
                            <div className="bg-[#171717] px-6 rounded-full flex justify-center mx-auto border-t-[0.5px] border-[#474747] hover:scale-105 transition duration-200 ease-in-out">
                                <button className="text-transparent py-2 bg-clip-text font-bold bg-gradient-to-tr from-[#8BBAFF] to-[#D55CFF] mx-auto text-2xl rounded-full" onClick={()=>{
                                    ListProduct(
                                        token_addresses[currency], price, delivery, prodName, description, quantity, files, listRecent
                                    )
                                }}>
                                    Upload
                                </button>
                            </div>	
                        </div>
                        </div>
                    </div>
                    </main>
                </div>
            
        </div>        
    )
}