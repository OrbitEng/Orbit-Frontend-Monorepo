import { useState, useEffect, useContext } from "react";
import { HeaderSearchBar } from "@includes/components/SearchBar";
import { HomeHeader } from "@includes/MarketHeader";
import { MainFooter } from "@includes/Footer";
import Head from "next/head";
import Image from "next/image";
import { ArrowLeftIcon, ArrowRightIcon, ChevronDownIcon, InformationCircleIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useDropzone } from "react-dropzone";
import { Listbox } from "@headlessui/react";

import {CommissionProductFunctionalities} from "@functionalities/Products";
import { CatalogWarnModal } from "@includes/components/InitListingsModal";
import ProductClientCtx from "@contexts/ProductClientCtx";
import TransactionClientCtx from "@contexts/TransactionClientCtx";
import { useWallet } from "@solana/wallet-adapter-react";
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

export function CommissionUploadForm(props) {
    const [ searchBar, setSearchBar ] = useState(<HeaderSearchBar />);
	const wallet = useWallet();
    
	const {ListProduct} = CommissionProductFunctionalities();
	const [vendorCommissionCatalog, setVendorCommissionCatalog] = useState();
	const [vendorCommissionTx, setVendorCommissionTx] = useState();

	const {productClient} = useContext(ProductClientCtx);
	const {transactionClient} = useContext(TransactionClientCtx);

	useEffect(async()=>{
        if(!(productClient && productClient.wallet.publicKey && transactionClient && transactionClient.wallet.publicKey && wallet.connected))return;
		try{
			let vc = await productClient.GetListingsStruct(productClient.GenListingsAddress("commission"));
			if(vc && vc.data){
				setVendorCommissionCatalog(vc);
			}
		}catch(e){
            console.log("init listing render err: ", e)
		}
		try{
			let vtx = await transactionClient.GetSellerOpenTransactions(transactionClient.GenSellerTransactionLog("commission"));
			if(vtx && vtx.data){
				setVendorCommissionTx(vtx);
			}
		}catch(e){
			console.log("init logs render err: ", e)	
		}
	}, [transactionClient, productClient, wallet && wallet.connected])

	return(
        <div className="w-full min-h-screen bg-transparent">
			{((vendorCommissionCatalog == undefined) || (vendorCommissionTx == undefined)) && <CatalogWarnModal category={"commission"} setCatalog={vendorCommissionCatalog ? undefined : setVendorCommissionCatalog} setTxLog={vendorCommissionTx ? undefined : setVendorCommissionTx}/>}
            <Head>
				<title>Orbit</title>
				<link rel="icon" href="orbit.png" />
			</Head>
            <main className="bg-[url('/oldbgWallpaper.png')] bg-cover min-h-screen">
            <HomeHeader headerMiddle={searchBar}/>
            <div className="w-full min-h-screen">
                SHIT GOES HERE
            </div>
            </main>
        </div>
    )
}