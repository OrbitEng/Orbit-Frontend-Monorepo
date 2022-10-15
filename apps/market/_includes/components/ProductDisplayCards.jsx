import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useContext } from "react";

import MarketAccountsCtx from "@contexts/MarketAccountsCtx";

import ProductCacheCtx from "@contexts/ProductCacheCtx";
import VendorCacheCtx from "@contexts/VendorCacheCtx";

import { ProductCommonUtils } from "@functionalities/Products";
import { MarketAccountFunctionalities } from "@functionalities/Accounts";

import ProductClientCtx from "@contexts/ProductClientCtx";

export function EmptyProductDisplayCardHome(props) {
	let paymentList = ["solana", "usdc"]

	return(
		<div className="row-span-1 col-span-1 my-3 mx-4 transition duration-700">
			<div className="relative group">
					<div className="card-digital-bg relative py-4 rounded-lg leading-none flex flex-col items-center overflow-hidden">
						<div className="flex items-center content-center border-[#4F4F4F] border-2 border-opacity-30 rounded-full shadow bg-[#535353] animate-pulse w-48 py-4" />
						<div className="relative mx-auto content-center my-2 overflow-visible">
							<div className="max overflow-hidden bg-[#535353] animate-pulse rounded-lg h-[200px] w-[200px]" />
						</div>
						<div className="flex flex-col mt-4 justify-start w-4/5">
							<div className="bg-[#535353] animate-pulse w-20 h-4 rounded-md" />
							<div className="flex flex-row gap-1 mt-1 align-middle">
								<div className="w-32 h-4 bg-[#535353] align-middle font-semibold rounded-md drop-shadow-md p-1 text-[#8B8B8B] text-[.8rem] animate-pulse" />
							</div>
						</div>
						<div className="flex flex-row gap-x-2 mt-3 bg-[#535353] animate-pulse h-10 w-52 rounded-md" />
				</div>
			</div>
		</div>
	)
}

export function ProductDisplayCardHome(props) {
	const {GetPfp, GetMetadata} = MarketAccountFunctionalities();

	const {marketAccountsClient} = useContext(MarketAccountsCtx);
	const {productClient} = useContext(ProductClientCtx);
	const {setProductCache} = useContext(ProductCacheCtx);
	const {setVendorCache} = useContext(VendorCacheCtx);

	const [glowColor, setGlowColor] = useState((props.type == "commission" && "bg-[#4541EE]") || (props.type == "digital" && "bg-[#FF31B9]") || (props.type == "physical" && "bg-[#4541EE]"));
	const [borderColor, setBorderColor] = useState((props.type == "commission" && "border-[#4541EE]") || (props.type == "digital" && "border-[#FF31B9]") || (props.type == "physical" && "border-[#4541EE]"));
	const [bgColor, setBgColor] = useState((props.type == "commission" && "card-commission-bg") || (props.type == "digital" && "card-digital-bg") || (props.type == "physical" && "card-commission-bg"));
	const [prodButton, setProdButton] = useState(
		<div className="flex flex-row gap-x-2 mt-3">
			<button className="font-semibold p-3 text-white bg-gradient-to-t from-[#000] to-[#0F1025] rounded-full drop-shadow text-[.75rem] border-2 border-[#2C2C4A]">🛒 Add to Cart</button>
			<button className="font-semibold p-3 text-white bg-gradient-to-t from-[#000] to-[#0F1025] rounded-full drop-shadow text-[.75rem] border-2 border-[#2C2C4A]">⚡ Quick Buy</button>
		</div>
	)

	const [prod, setProd] = useState();
	const [vendor, setVendor] = useState();

	const {ResolveProductInfo, ResolveProductMedia} = ProductCommonUtils();

	useEffect(async ()=>{
		if(props.address == "11111111111111111111111111111111"){
			return
		};
		let tp = undefined;
		switch(props.type){
			case "commission":
				setProdButton(
					<div className="flex flex-row justify-center mt-3">
						<button className="font-semibold p-3 text-white bg-gradient-to-t from-[#000] to-[#0F1025] rounded-full drop-shadow text-[.75rem] border-2 border-[#2C2C4A]">✉️ Request</button>
					</div>
				);
				tp = (await productClient.GetDigitalProduct(props.address));
				if(!tp){
					return;
				}
				tp.data.metadata.info = await ResolveProductInfo(tp.data.metadata.info);
				tp.data.metadata.media = await ResolveProductMedia(tp.data.metadata.media);
				break;
			case "digital":
				tp = (await productClient.GetDigitalProduct(props.address));
				if(!tp){
					return;
				}
				tp.data.metadata.info = await ResolveProductInfo(tp.data.metadata.info);
				tp.data.metadata.media = await ResolveProductMedia(tp.data.metadata.media);
				break;
			case "physical":
				tp = await productClient.GetPhysicalProduct(props.address);
				if(!tp){
					return;
				}
				tp.data.metadata.info = await ResolveProductInfo(tp.data.metadata.info);
				tp.data.metadata.media = await ResolveProductMedia(tp.data.metadata.media);
				break;
			default:
				break;
		};
		
		if(tp){
			let vendor_listings_struct = (await productClient.GetListingsStruct(tp.data.metadata.ownerCatalog)).data;
			if(!vendor_listings_struct) return;
			let vendor = await marketAccountsClient.GetAccount(
				marketAccountsClient.GenAccountAddress(vendor_listings_struct.listingsOwner)
			);
			vendor.data.profilePic = await GetPfp(vendor.data.profilePic);
			vendor.data.metadata = await GetMetadata(vendor.data.metadata)
			tp.data.metadata.seller = vendor;
			setVendor(vendor);
		};
		setProd(tp);
	},[])

	return(
		<div className="row-span-1 col-span-1 my-3 mx-4 hover:scale-[101%] transition duration-700">
			<div className="relative group">
				
				<div className={glowColor + " absolute -inset-0 rounded-lg blur opacity-60 group-hover:opacity-100 transition duration-700 group-hover:duration-700 animate-tilt"} onClick={()=>{setProductCache(prod); setVendorCache(vendor)}}/>
					<Link href={"/product/" + props.type + "/" + props.address} >
						<div className={bgColor + " relative py-4 rounded-lg leading-none flex flex-col items-center overflow-hidden"}>
							<div className="flex items-center content-center border-[#4F4F4F] border-2 border-opacity-30 rounded-full shadow bg-gradient-to-r to-[#120D20] from-[#19112E]">
								<div className="flex content-start rounded-full mx-2 py-1 pr-4 gap-2">
									<Image 
										className="rounded-full flex"
										alt="market profile picture"
										src={vendor?.data.profilePic || "https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50?d=mp&f=y"}
										height={10}
										width={30}
									/>
									<div className="flex flex-col w-5/6 mx-auto">
										<span className="flex text-gray-100 leading-none text-sm font-bold">{vendor?.data.metadata.name || "Jack"}</span>
										<span className="flex text-gray-300 text-xs">{(vendor && (vendor.address.slice(0,10) + "...")) || "DMgY6wi2FV..."}</span>
									</div>
								</div>
							</div>
							<div className="relative mx-auto content-center my-2 overflow-visible">
								<div className={"absolute -bottom-3 -left-3 z-40 p-2  text-white font-bold bg-[#080B1A] bg-opacity-80 rounded-full border-[1px] text-ellipsis " + borderColor}>
									<span className="text-sm">{prod?.data.metadata.price || "12.345"}</span>
								</div>
								<div className="max overflow-hidden">
									<Image
										alt="product image"
										src={prod?.data.metadata.media[0] || "/demologos.png"}
										layout="intrinsic"
										height={200}
										width={200}
									/>
								</div>
							</div>
							<div className="flex flex-col mt-4 justify-start w-4/5">
								<span className="font-bold text-white">{prod?.data.metadata.info.name}</span>
								<div className="flex flex-row gap-1 mt-1">
									<div className="bg-[#201B31] align-middle font-semibold rounded-md drop-shadow-md p-1 text-[#8B8B8B] text-[.8rem]">
										{(props.type?.charAt(0)?.toUpperCase() + "" +props.type?.slice(1))}
									</div>
									{
										prod?.data.metadata.currency && 
										<div className="flex bg-[#201B31] rounded-md drop-shadow-md p-1 text-[#8B8B8B] text-[.8rem]" key={index}>
											<Image
												layout="fixed"
												src={"/" + prod.data.metadata.currency + "LogoSmall.png"}
												height={16}
												width={16}
											/>
										</div>
									}
								</div>
							</div>
						{prodButton}
					</div>
				</Link>
			</div>
		</div>
	)
}