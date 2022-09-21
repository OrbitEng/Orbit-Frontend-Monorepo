import MarketAccountsCtx from "@contexts/MarketAccountsCtx";
import CatalogCtx from "@contexts/CatalogCtx";
import { useContext, useEffect, useState } from "react";
import { ArQueryClient } from "data-transfer-clients";
import { enc_common } from "browser-clients";
import { verifySignature } from "matrix-js-sdk/lib/crypto/olmlib";
import Image from 'next/image';

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
			await catalogClient.GenTopVendorsAddress()
		);

		let top_vendors = await marketAccountsClient.GetMultipleMarketAccounts(
			top_vendors_addrs
		);

		let metadatas = await Promise.all(top_vendors.map((vendor) =>{
			return ArQueryClient.FetchData(enc_common.utos(vendor.metadata));
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
		address: "E5EP2qkdXmPwXA9ANzoG69Gmj86Jdqepjw2XrQDGj9sM",
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
					undefVendorsArr?.map((number, index) => {
						return(<Vendor vendor={dummyVendor} rank={number} key={number} />)
					})
					: topVendors?.map((vendor, index) => {
						return(vendor ?
							<Vendor vendor={vendor} rank={index + 1} key={index + 1}/>: 
							<Vendor vendor={dummyVendor} rank={number} key={number} />
						) 
					})
			}
			</div>
		</div>
	)
}

function Vendor(props) {
	return(
		<div className="flex flex-row bg-[#171717] rounded-xl px-auto py-5 justify-around" key={props.rank}>
			<span className="text-white text-xl align-middle my-auto font-bold">{"#" + props.rank}</span>
			<div className="relative h-12 w-12 rounded-full overflow-hidden z-10">
				<Image 
					layout="fill"
					src={props.vendor.profilepic}
					objectFit="contain"
				/>
			</div>
			<div className="text-white font-bold text-xl align-middle my-auto flex flex-col justify-start">
				<span className="-mb-[6px]">{props.vendor.nickname}</span>
				<span className="text-[#535353] text-sm font-normal">{props.sellerAddr?.slice(0,10) + "..."}</span>
			</div>
			<div className="text-white text-sm align-middle my-auto flex flex-col justify-start">
				<span className="-mb-[3px]">Total Sales</span>
				<span className="text-[#535353] text-xs">{props.vendor.sales}</span>
			</div>
		</div>
	)
}