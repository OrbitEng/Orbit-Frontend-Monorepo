import { useEffect, useContext, useState, useCallback } from "react";
import Image from "next/image";
import { ArrowLeftIcon, ArrowRightIcon, ChevronDownIcon, InformationCircleIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useDropzone } from "react-dropzone";
import {DigitalProductFunctionalities} from "@functionalities/Products";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { PRODUCT_PROGRAM, TRANSACTION_PROGRAM } from 'orbit-clients';
import Link from "next/link";
import UserAccountCtx from "@contexts/UserAccountCtx";
import BundlrCtx from "@contexts/BundlrCtx";
import { Transaction } from "@solana/web3.js";

export function DigitalUploadForm(props) {

	const {ListProduct} = DigitalProductFunctionalities();
    const wallet = useWallet();
    const {connection} = useConnection();
    const {userAccount} = useContext(UserAccountCtx);
    const {bundlrClient} = useContext(BundlrCtx);

	const [prodName, setProdName] = useState("");
	const [price, setProdPrice] = useState();
	const [takeHomeMoney, setTakeHomeMoney] = useState();
    const [delivery, setDelivery] = useState(14);
	const [description, setDescription] = useState();
    const [listRecent, setListRecent] = useState(false);
	const [bigPreviewSrc, setBigPreviewSrc] = useState(null);
    
	//////////////////////////////////////////////////
	// Functions for managing product preview images
    
	const [previewFiles, setPreviewFiles] = useState([]);
    
    const deletePreviewFile = (filein) => {
        let index = previewFiles.indexOf(filein);
        if(index == -1){
            return;
        }
        setPreviewFiles(cf => [...cf.slice(0,index), ...cf.slice(index+1)])
    }
    
	const prevFilesCallback = (acceptedFiles) => {
        acceptedFiles.forEach((fin)=>{
            const afr = new FileReader()
            afr.onload = () => {
                setPreviewFiles(cf => [...cf, afr.result]);
            }
            afr.readAsDataURL(fin);
        });
        
        const bfr = new FileReader()
		bfr.onload = () => {
            setBigPreviewSrc(bfr.result)
            setDelFileFuncArgs(["deletePreviewFile", bfr.result]);
		}
		bfr.readAsDataURL(acceptedFiles[0]);
        
        
	}
    
	const {getRootProps: getPrevRootProps, getInputProps: getPrevInputProps, open: openPreview} = useDropzone({onDrop: prevFilesCallback});
	
    
	//////////////////////////////////////////////////
	// Functions for managing product images
	const [productFiles, setProductFiles] = useState([]);
    
	const deleteProductFile = useCallback((filein) => {
        let index = productFiles.indexOf(filein);
		if(index == -1){
            return;
		}
		setProductFiles(cf => [...cf.slice(0,index), ...cf.slice(index+1)])
	}, [productFiles])
    
    const prodFilesCallback = (acceptedFiles) => {
        acceptedFiles.forEach((fin)=>{
            const afr = new FileReader()
            afr.onload = () => {
                setProductFiles(cf => [...cf, afr.result]);
            }
            afr.readAsDataURL(fin);
        });
        
        const bfr = new FileReader()
		bfr.onload = () => {
            setBigPreviewSrc(bfr.result)
            setDelFileFuncArgs(["deleteProductFile", bfr.result]);
		}
		bfr.readAsDataURL(acceptedFiles[0]);
	}
    
	const {getRootProps: getProdRootProps, getInputProps: getProdInputProps, open: openProduct} = useDropzone({onDrop: prodFilesCallback})
    
    //////////////////////////
    const [delFileFuncArgs, setDelFileFuncArgs] = useState([]);
    const delFileFunc = useCallback(()=>{
        if(delFileFuncArgs[0] == "deletePreviewFile"){
            deletePreviewFile(delFileFuncArgs[1])
        }else{
            deleteProductFile(delFileFuncArgs[1])
        }
    }, [delFileFuncArgs, previewFiles, productFiles, deletePreviewFile, deleteProductFile])
    
    const listProductWrapper = useCallback(async ()=>{
        let vc = await PRODUCT_PROGRAM.GetListingsStruct(PRODUCT_PROGRAM.GenListingsAddress("digital"));
        let vtx = await TRANSACTION_PROGRAM.GetSellerOpenTransactions(TRANSACTION_PROGRAM.GenSellerTransactionLog("digital"));

        let latest_blockhash = await connection.getLatestBlockhash();
        let tx = new Transaction({
            feePayer: wallet.publicKey,
            ... latest_blockhash
        });

        if(!(vc || vc.data)){
            tx.add(
                await PRODUCT_PROGRAM.InitPhysicalListings(wallet, userAccount.data.metadata.voter_id)
            );
        }
        if(!(vtx || vtx.data)){
            tx.add(
                await TRANSACTION_PROGRAM.CreateSellerTransactionsLog(
                    "physical",
                    wallet
                )
            );
        }

        let [addixs, data_items] = await ListProduct(
            userAccount,
            price,
            delivery,
            prodName,
            description,
            previewFiles,
            "Image",
            listRecent,
            wallet
        );

        tx.add(...addixs);

        await wallet.signTransaction(tx);

        let sig = await wallet.sendTransaction(tx, connection);
        
        let confirmation  = await connection.confirmTransaction({
            ...latest_blockhash,
            signature: sig,
        });
        
        await bundlrClient.SendTxItems(data_items, sig);

    },[userAccount?.address, listRecent, delivery, price, prodName, description, previewFiles, wallet, PRODUCT_PROGRAM.PRODUCT_PROGRAM._provider.connection, TRANSACTION_PROGRAM.TRANSACTION_PROGRAM._provider.connection]);


	return(
        <div className="pt-14 lg:pt-32 sm:-mt-32 w-full align-center min-h-screen  place-items-center">
                <div className="flex flex-col w-full mx-auto my-auto content-center min-h-screen place-items-center">
                    <h1 className="text-white font-bold text-4xl mt-10">Create New Digital Product</h1>
                    <Link href={"/sell"}>
                    <button className="flex flex-row space-x-1 mb-10 align-middle">
                        <ArrowLeftIcon className="h-5 w-5 text-[#767676] my-auto" />
                        <div className="text-[#767676] text-xl my-auto">Back to Categories</div>
                    </button>
                    </Link>
                    
                    <div className="flex flex-row justify-between mb-12 overflow-hidden text-ellipsis gap-x-4 w-[100vh] h-full place-items-center">
                        <div className="h-full w-[20%]">
                            <div className="flex flex-col mb-2 leading-tight">
                                <h3 className="font-bold text-white text-xl">Upload Preview</h3>
                                <span className="text-[#767676] mb-2">Formats: jpg, mp4, png</span>
                            </div>
                            
                            <div className="flex flex-row">
                                <div className="flex flex-col scrollbar scrollbar-thumb-[#5B5B5B] scrollbar-track-[#8E8E8E] scrollbar-thumb-rounded-full scrollbar-track-rounded-full overflow-scroll overflow-y-scroll w-full h-96 px-2 gap-y-3">
                                    {
                                        previewFiles && previewFiles?.map((f,fi) => {
                                            return(
                                                <div className="relative shrink-0 h-[100px] w-full rounded-lg overflow-hidden border-white border-2">
                                                    <button
                                                        onClick={()=>{
                                                            setBigPreviewSrc((f));
                                                            setDelFileFuncArgs(["deletePreviewFile", f]);
                                                        }}
                                                    >
                                                        <Image
                                                            src={(f) || "/"}
                                                            layout="fill"
                                                            objectFit="cover"
                                                        />
                                                    </button>
                                                </div>
                                            )
                                        })
                                    }
                                    <button
                                        className="group flex flex-col bg-transparent border-4 rounded-2xl border-dashed border-[#3D3D3D] h-24 w-full transition duration-200 hover:border-[#8E8E8E]"
                                        onClick={()=>{openPreview()}}
                                    >
                                        <PlusIcon className="stroke-[#3D3D3D] h-8 w-8 stroke-[3px] mt-auto mx-auto align-middle group-hover:stroke-[#8E8E8E] transition duration-200" />
                                        <span className="text-[#3D3D3D] font-semibold group-hover:text-[#8E8E8E] align-middle mb-auto mx-auto transition duration-200">Add More</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="w-[60%] h-96">
                            {
                                    !(bigPreviewSrc) ? (
                                        <div {...getPrevRootProps()} className="flex flex-col border-4 border-dashed border-[#3D3D3D] rounded-2xl h-96 content-center place-items-center align-middle py-12 px-20">
                                            <input {...getPrevInputProps()}/>
                                            <div className="relative flex h-52 mx-16 w-full place-items-center">
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
                                    ) : (
                                        <div className="relative rounded-2xl overflow-hidden h-96 align-middle w-full">
                                            <div className="z-10">
                                                <Image
                                                    src={bigPreviewSrc || "/noneya"}
                                                    layout="fill"
                                                    objectFit="cover"
                                                />
                                            </div>
                                            <button className="bottom-0 right-0 absolute z-50 p-1 align-middle my-auto mx-auto basis-1/4 justify-center border-2" onClick={()=>{
                                                setBigPreviewSrc(undefined);
                                                setDelFileFuncArgs(undefined);
                                                delFileFunc()
                                            }}>
                                                <TrashIcon className="flex h-12 w-12"/>
                                            </button>
                                        </div>
                                    )
                                }
                        </div>
                        <div className="flex flex-col  w-[20%] flex-none flex-grow-0 h-full overflow-ellipsis ">
                            <div className="top-0 bg-transparent backdrop-blur-lg ">
                                <div className="flex flex-col mb-2 leading-tight items-end">
                                    <h3 className="font-bold text-white text-xl">Upload Product</h3>
                                    <span className="text-[#767676] mb-2">Formats: jpg, mp4, png</span>
                                </div>
                            </div>
                            <div className="flex flex-row">
                                <div className="flex flex-col scrollbar scrollbar-thumb-[#5B5B5B] scrollbar-track-[#8E8E8E] scrollbar-thumb-rounded-full scrollbar-track-rounded-full overflow-scroll overflow-y-scroll w-full h-96 px-2 gap-y-3">
                                    {
                                        productFiles && productFiles?.map((f,fi) => {
                                            return(
                                                <div className="relative shrink-0 h-[100px] w-full rounded-lg overflow-hidden border-white border-2">
                                                    <button
                                                        onClick={()=>{
                                                            setBigPreviewSrc((f));
                                                            setDelFileFuncArgs(["deleteProductFile", f]);
                                                        }}
                                                    >
                                                        <Image
                                                            src={(f) || "/"}
                                                            layout="fill"
                                                            objectFit="cover"
                                                        />
                                                    </button>
                                                </div>
                                            )
                                        })
                                    }
                                    <button
                                        className="group flex flex-col bg-transparent border-4 rounded-2xl border-dashed border-[#3D3D3D] h-24 w-full transition duration-200 hover:border-[#8E8E8E]"
                                        onClick={()=>{openProduct()}}
                                    >
                                        <PlusIcon className="stroke-[#3D3D3D] h-8 w-8 stroke-[3px] mt-auto mx-auto align-middle group-hover:stroke-[#8E8E8E] transition duration-200" />
                                        <span className="text-[#3D3D3D] font-semibold group-hover:text-[#8E8E8E] align-middle mb-auto mx-auto transition duration-200">Add More</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                        <form className="flex flex-col gap-y-6 w-1/3 mb-32" onSubmit={async ()=>{await listProductWrapper()}}>
                            <div className="flex flex-col">
                                <label htmlFor="title" className="text-white font-semibold text-xl">Listing Title</label>
                                <input
                                    className="rounded-lg p-3 text-lg focus:outline-0 bg-[#171717] text-[#8E8E8E] placeholder:text-[#4E4E4E]"
                                    placeholder="Enter Title"
                                    type="text"
                                    id="title"
                                    name="title"
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
                            <div className="bg-[#171717] px-6 rounded-full flex justify-center mx-auto border-t-[0.5px] border-[#474747] hover:scale-105 transition duration-200 ease-in-out">
                                <input className="text-transparent py-2 bg-clip-text font-bold bg-gradient-to-tr from-[#8BBAFF] to-[#D55CFF] mx-auto text-2xl rounded-full" type="submit" value="Upload"/>
                            </div>
                            </form>
                    </div>
            </div>
		
	)
}