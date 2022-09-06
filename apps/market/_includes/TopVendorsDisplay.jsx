import MarketAccountsCtx from "@contexts/MarketAccountsCtx";
import CatalogCtx from "@contexts/CatalogCtx";
import { useContext, useEffect, useState } from "react";
import { ArQueryClient } from "data-transfer-clients";
import { enc_common } from "browser-clients";
import { Vendor } from "./components/VendorDisplayCards";

export default function TopVendorsDisplay(props) {

	const {marketAccountsClient} = useContext(MarketAccountsCtx);
	const {catalogClient} = useContext(CatalogCtx);

	const [topVendors, setTopVendors] = useState();

	useEffect(async ()=>{
		if(!(marketAccountsClient && catalogClient)){
			return
		}

		// add temp logic here 
		setTopVendors([]);

		let top_vendors_addrs = await catalogClient.GetParty(
			await marketAccountsClient.GetTopVendorsAddress()
		);

		let top_vendors = await marketAccountsClient.GetMultipleMarketAccounts(
			top_vendors_addrs
		);

		let aqc = new ArQueryClient();

		let metadatas = await Promise.all(top_vendors.map((vendor) =>{
			return aqc.FetchData(enc_common.utos(vendor.metadata));
		}));

		// idk what metadata looks like yet in terms of json struct
		setTopVendors(top_vendors?.map((vendor, index) =>{
			return {
				name: JSON.parse(metadatas[index]).nickname,
				address: top_vendors_addrs[index].toString(),
				sales: vendor.transactions.toNumber(),
				profilepic: enc_common.utos(vendor.profilePic)
			}
		}))
	}, []);

	// this is just to show how I want to fetch vendors
	const dummyVendor = {
		nickname: "Name",
		address: "walletAddr....",
		sales: "123456789",
		profilepic: "https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50?d=mp&f=y",
	}

	let undefVendorsArr = []
	for(let i=1; i<7; i++) {
		undefVendorsArr.push(i)
	}

	// fetch the top 8 vendors and display here
	return(
		<div className="flex flex-col justify-center mx-auto w-full m-28">
			<div className="text-white w-full font-bold text-4xl text-center mb-10">Top Vendor Profiles 🛍️</div>
			<div className="grid grid-flow-row grid-rows-2 grid-cols-3 gap-x-5 gap-y-8 w-full">
			{
				topVendors == undefined ? 
					undefVendorsArr.map((number, index) => {
						return(<Vendor vendor={dummyVendor} rank={number} key={number} />)
					})
					: topVendors?.map((vendor, index) => {
						return(<Vendor vendor={vendor} rank={index + 1} key={index + 1}/>)
					})
			}
			</div>
		</div>
	)
}