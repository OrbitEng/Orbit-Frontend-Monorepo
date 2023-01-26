import { useState, useEffect, useContext } from "react";

import {CommissionProductFunctionalities} from "@functionalities/Products";
import { useWallet } from "@solana/wallet-adapter-react";
import Link from "next/link";
import { PRODUCT_PROGRAM, TRANSACTION_PROGRAM} from 'orbit-clients';

export function CommissionUploadForm(props) {
	const wallet = useWallet();
    
	const {ListProduct} = CommissionProductFunctionalities();
	const [vendorCommissionCatalog, setVendorCommissionCatalog] = useState("");
	const [vendorCommissionTx, setVendorCommissionTx] = useState("");


	useEffect(async()=>{
		try{
			let vc = await PRODUCT_PROGRAM.GetListingsStruct(PRODUCT_PROGRAM.GenListingsAddress("commission"));
			if(vc && vc.data){
				setVendorCommissionCatalog(vc);
			}else{
				setVendorCommissionCatalog()
			}
		}catch(e){
            console.log("init listing render err: ", e);
			setVendorCommissionCatalog()
		}
		try{
			let vtx = await TRANSACTION_PROGRAM.GetSellerOpenTransactions(TRANSACTION_PROGRAM.GenSellerTransactionLog("commission"));
			if(vtx && vtx.data){
				setVendorCommissionTx(vtx);
			}else{
				setVendorCommissionTx()
			}
		}catch(e){
			console.log("init logs render err: ", e);
			setVendorCommissionTx()
		}
	}, [TRANSACTION_PROGRAM.TRANSACTION_PROGRAM._provider.connection, PRODUCT_PROGRAM.PRODUCT_PROGRAM._provider.connection, wallet && wallet.connected])

	return(
        <div className="w-full min-h-screen bg-transparent">
			SHIT GOES HERE
        </div>
    )
}