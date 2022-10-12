import MarketAccountsCtx from "@contexts/MarketAccountsCtx";
import ProductClientCtx from "@contexts/ProductClientCtx";
import { useContext, useEffect, useState } from "react";
import { ArQueryClient } from "data-transfer-clients";
import { enc_common } from "browser-clients";
import { verifySignature } from "matrix-js-sdk/lib/crypto/olmlib";
import Image from 'next/image';

function handleVendor(vendorArr) {
	for(let i=1;i<6;i++) {
		<Vendor vendor={vendorArr[i] || undefined} index={i} rank={i}/>
	}
}

export default function TopVendorsDisplay(props) {

	const {marketAccountsClient} = useContext(MarketAccountsCtx);
	const {productClient} = useContext(ProductClientCtx);

	const [topVendors, setTopVendors] = useState();

	useEffect(async ()=>{
		if(!(marketAccountsClient && productClient)){
			return
		}

		let top_vendors_addrs = await catalogClient.GetParty(
			await productClient.GenTopVendorsAddress()
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
				sales: vendor?.transactions.toNumber(),
				profilepic: enc_common.utos(vendor?.profilePic)
			}
		}))
	}, []);

	let undefVendorsArr = Array.of(1,2,3,4,5,6)
	// fetch the top 8 vendors and display here
	return(
		<div className="flex flex-col justify-center mx-auto w-full m-28">
			<div className="text-white w-full font-bold text-4xl text-center mb-10">Popular Vendors 🛍️</div>
			<div className="grid grid-flow-row grid-rows-2 grid-cols-3 gap-x-5 gap-y-8 w-full">
			{
				(topVendors == undefined || topVendors.length == 0) ? 
					undefVendorsArr?.map((number, index) => {
						return(<Vendor rank={number} key={number} />)
					})
					: (handleVendor(topVendors))
			}
			</div>
		</div>
	)
}

function Vendor(props) {
	return(
		<div className="flex flex-row bg-[#171717] rounded-xl px-auto py-5 justify-around" key={props.rank}>
			<span className="text-white text-xl align-middle my-auto font-bold">
				{"#" + props?.rank}
			</span>
			<div className="relative h-12 w-12 rounded-full overflow-hidden z-10">
				<Image 
					layout="fill"
					src={props?.vendor?.profilepic || "https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50?d=mp&f=y"}
					objectFit="contain"
				/>
			</div>
			{
				props.vendor ? (
					<>
						<div className="text-white font-bold text-xl align-middle my-auto flex flex-col justify-start">
							<span className={"-mb-[6px]"}>{props?.vendor?.nickname}</span>
							<span className="text-[#535353] text-sm font-normal">{props?.sellerAddr?.slice(0,10) + "..."}</span>
						</div>
						<div className="text-white text-sm align-middle my-auto flex flex-col justify-start">
							<span className="-mb-[3px]">Total Sales</span>
							<span className="text-[#535353] text-xs">{props?.vendor?.sales}</span>
						</div>
					</>
				) :  (
					<>
						<div className="text-white font-bold text-xl align-middle my-auto flex flex-col justify-start basis-1/2">
							<span className="-mb-[6px] bg-[#535353] h-4 animate-pulse rounded my-2"/>
							<span className="bg-[#535353] text-sm font-normal animate-pulse rounded h-4 my-2"/>
						</div>
					</>
				)
			}
		</div>
	)
}