import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useContext } from "react";
import Tilt from "react-parallax-tilt";

import MarketAccountsCtx from "@contexts/MarketAccountsCtx";

import ProductCacheCtx from "@contexts/ProductCacheCtx";
import VendorCacheCtx from "@contexts/VendorCacheCtx";

import { ProductCommonUtils } from "@functionalities/Products";

import ProductClientCtx from "@contexts/ProductClientCtx";
import ArweaveCtx from "@contexts/ArweaveCtx";
import { useRouter } from "next/router";

import usdcIcon from "../../../public/Icons/usdcMarkColor.svg";
import { PlusIcon } from "@heroicons/react/24/solid";

export function EmptyProductDisplayCardHomeDep(props) {
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

export function EmptyProductDisplayCardHome(props) {
	return(
		<div className="row-span-1 col-span-1 my-3 mx-auto w-[265px] h-[440px]">
			<div className="relative group h-full w-full">
				<div className="bg-[#13111C] rounded-[10px] leading-none flex flex-col items-center overflow-hidden px-3 pt-3 pb-3 h-full w-full">
					<div className="overflow-hidden bg-[#535353] animate-pulse rounded-[9px] w-full h-[230px] mb-4" />
					<div className="w-full h-8 bg-[#535353] animate-pulse rounded-[6px] mb-3"/>
					<div className="w-[40%] h-8 bg-[#535353] animate-pulse rounded-[6px] mr-auto mb-3"/>
					<div className="w-[75%] h-8 bg-[#535353] animate-pulse rounded-[6px] mr-auto mb-5"/>
					<div className="w-full h-12 bg-[#535353] animate-pulse rounded-[9px] mx-auto"/>
				</div>
			</div>
		</div>
	)
}

export function ProductDisplayCardHome(props) {
	const [prod, setProd] = useState();
	const [vendorUS, setVendorUS] = useState();
	const router = useRouter();

	const {marketAccountsClient} = useContext(MarketAccountsCtx);
	const {productClient} = useContext(ProductClientCtx);
	const {setProductCache} = useContext(ProductCacheCtx);
	const {setVendorCache} = useContext(VendorCacheCtx);
	const {arweaveClient} = useContext(ArweaveCtx)

	let productTags = ["UX/UI", "design"];

	let categoryTagBg, categoryTagGlow, categoryTagText, categoryCardGlow, cardStyle;

	// This is maybe slow, can get spedup from memo
	switch(props?.type) {
		case "commission":
			categoryTagBg = "bg-[#1A1023] border-[#7F10EA] border-[1px]";
			categoryTagText = "text-[#7F10EA]";
			cardStyle = "commissionCard";
			break;
		case "digital":
			categoryTagBg = "bg-[#230E26] border-[#D947EF] border-[1px]";
			categoryTagText = "text-[#D947EF]";
			cardStyle = "digitalCard";
			break;
		case "local": 
			categoryTagBg = "bg-[#0E1F14] border-[#29E06D] border-[1px]";
			categoryTagText = "text-[#29E06D]";
			cardStyle = "localCard"
			break;
		case "physical":  
			categoryTagBg = "bg-[#0F1625] border-[#3F72D3] border-[1px]";
			categoryTagText = "text-[#3F72D3]";
			cardStyle = "physicalCard"
			break;
	}
 
	let categoryTag = (
		<div className="relative overflow-visible">
			<div className={`relative flex flex-row py-1 px-2 rounded-[4px] ${categoryTagBg}`}>
				<span className={`${categoryTagText} my-auto text-sm`}>{props?.type?.charAt(0).toUpperCase() + props?.type?.slice(1)}</span>
				<span className="h-4"/>
			</div>
		</div>
	);

	useEffect(async () => {
		if((props.address == "11111111111111111111111111111111") || !marketAccountsClient){
			return
		};

		let tp = undefined;
		switch(props.type){
			case "commission":
				tp = (await productClient.GetCommissionProduct(props.address));
				if(!tp){
					return;
				}
				break;
			case "digital":
				tp = (await productClient.GetDigitalProduct(props.address));
				if(!tp){
					return;
				}
				break;
			case "physical":
				tp = await productClient.GetPhysicalProduct(props.address);
				if(!tp){
					return;
				}
				break;
			default:
				break;
		};
		
		if(tp){
			tp.data.metadata.info = JSON.parse(await arweaveClient.FetchData(tp.data.metadata.info));
			tp.data.metadata.media = await arweaveClient.GetImageData(tp.data.metadata.media);

			let vendor_listings_struct = (await productClient.GetListingsStruct(tp.data.metadata.ownerCatalog)).data;
			if(!vendor_listings_struct) return;
			tp.data.metadata.availability = productClient.FindProductAvailability(tp.data, vendor_listings_struct)
			let vendor = await marketAccountsClient.GetAccount(
				marketAccountsClient.GenAccountAddress(vendor_listings_struct.listingsOwner)
			);
			vendor.data.profilePic = await arweaveClient.GetPfp(vendor.data.profilePic);
			vendor.data.metadata = await arweaveClient.GetMetadata(vendor.data.metadata);
			tp.data.metadata.seller = vendor;
			setVendorUS(vendor);
		};
		setProd(tp);
	},[productClient, marketAccountsClient, props.address])

	return(
		<div className="row-span-1 col-span-1 my-3 mx-2 w-[265px]">
			<Tilt tiltMaxAngleX={10} tiltMaxAngleY={10} glareEnable={true} glareColor="#ffffff" glareMaxOpacity={0.1} glareBorderRadius="10px" glarePosition="all">
				<div className="relative group overflow-visible" onClick={()=>{setProductCache(prod); setVendorCache(vendor)}}>
					<div className={`relative ${cardStyle} leading-none flex flex-col items-center overflow-visible`}>
						<div className="flex relative w-full overflow-visible p-2">
							<div className="flex relative overflow-hidden rounded-[9px] w-full h-[230px]">
								<Image
									alt="product image"
									src={(prod?.data?.metadata?.media && prod?.data.metadata.media[0]) || "/demobgpack.png"}
									layout="fill"
									objectFit="cover"
									loading="lazy"
								/>
							</div>
						</div>
						<div className="flex flex-row w-full justify-between px-2 mt-2">
							<div className="relative flex flex-row gap-x-1 py-1 px-2 bg-[#28253F] text-white rounded-lg max-w-[50%]">
								<span className="overflow-hidden relative flex rounded-full h-6 w-6 flex-shrink-0">
									<Image
										src={vendorUS?.data.profilePic  || "https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50?d=mp&f=y"}
										layout="fill"
										objectFit="cover"
										loading="lazy"
									/>
								</span>
								<span className="my-auto text-[#EFEFEF] text-sm truncate">{("@" + vendorUS?.address?.toString())}</span>
							</div>
							<div className="relative flex flex-row text-white rounded-lg overflow-hidden bg-[#28253F] px-2 py-1 max-w-[40%]">
								{/* For now I am just leaving the prices in USD but talk to indy about this... */}
								<span className="my-auto mr-1">
									<Image src={usdcIcon} layout="fixed" height={20} width={20} />
								</span>
								<span className="my-auto align-middle text-center truncate text-sm">{"$" + (Math.round(prod?.data?.metadata?.price) ? Math.round(prod?.data?.metadata?.price)?.toString() : "123")}</span>
							</div>							
						</div>
						<span className="text-xl text-white truncate w-full text-left px-2 mt-2">{prod?.data?.metadata?.info?.name ? (prod?.data?.metadata?.info?.name?.charAt(0).toUpperCase() + prod?.data?.metadata?.info?.name?.slice(1)) : "Icon Pack"}</span>
						<div className="flex flex-row gap-x-2 w-full px-2 justify-start mt-2 mb-5">
							{categoryTag}
							{productTags?.map((tagName) => {
								return(
									<div className="flex flex-row py-1 px-2 bg-[#23212F] rounded-[4px]">
										<span className="my-auto text-sm text-[#686868]">{tagName.charAt(0).toUpperCase() + tagName.slice(1)}</span>
									</div>
								)
							})}
						</div>
						<div className="flex w-full justify-center mb-4">
							{!(props?.type == "commission" || props?.type ==  "local") ? (
								<div className="flex flex-row flex-grow mx-2 gap-x-2">
									<button
										className="flex flex-grow basis-4/5 font-bold text-lg py-2 text-white bg-[#28252F] rounded-[10px]"
									>
										<span className="mx-auto my-auto">&#9889; Buy Now</span>
									</button>
									<button className="flex py-2 px-[10px] bg-[#2057C0] rounded-[10px]">
										<PlusIcon className="h-6 w-6 text-white my-auto mx-auto"/>
									</button>
								</div>
							) : (
								<button
									onClick={(e) => {
										e.preventDefault()
										router.push("/product/" + props?.type + "/" + props?.address?.toString())
									}}
									className="font-bold flex flex-grow text-lg py-2 bg-[#2057C0] text-white rounded-[10px] mx-2"
								>
									<span className="mx-auto my-auto">View Listing</span>
								</button>
							)}
						</div>
					</div>
				</div>
			</Tilt>
		</div>
	)
}

export function ProductDisplayCardHomeDep(props) {
	const {marketAccountsClient} = useContext(MarketAccountsCtx);
	const {productClient} = useContext(ProductClientCtx);
	const {setProductCache} = useContext(ProductCacheCtx);
	const {setVendorCache} = useContext(VendorCacheCtx);
	const {arweaveClient} = useContext(ArweaveCtx)

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
	const [vendorUS, setVendorUS] = useState();

	const {ResolveProductInfo, ResolveProductMedia} = ProductCommonUtils();

	useEffect(async ()=>{
		if((props.address == "11111111111111111111111111111111") || !marketAccountsClient){
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
				tp = (await productClient.GetCommissionProduct(props.address));
				if(!tp){
					return;
				}
				break;
			case "digital":
				tp = (await productClient.GetDigitalProduct(props.address));
				if(!tp){
					return;
				}
				break;
			case "physical":
				tp = await productClient.GetPhysicalProduct(props.address);
				if(!tp){
					return;
				}
				break;
			default:
				break;
		};
		
		if(tp){
			tp.data.metadata.info = JSON.parse(await arweaveClient.FetchData(tp.data.metadata.info));
			tp.data.metadata.media = await arweaveClient.GetImageData(tp.data.metadata.media);

			let vendor_listings_struct = (await productClient.GetListingsStruct(tp.data.metadata.ownerCatalog)).data;
			if(!vendor_listings_struct) return;
			tp.data.metadata.availability = productClient.FindProductAvailability(tp.data, vendor_listings_struct)
			let vendor = await marketAccountsClient.GetAccount(
				marketAccountsClient.GenAccountAddress(vendor_listings_struct.listingsOwner)
			);
			vendor.data.profilePic = await arweaveClient.GetPfp(vendor.data.profilePic);
			vendor.data.metadata = await arweaveClient.GetMetadata(vendor.data.metadata);
			tp.data.metadata.seller = vendor;
			setVendorUS(vendor);
		};
		setProd(tp);
	},[productClient, marketAccountsClient, props.address])

	return(
		<div className="row-span-1 col-span-1 my-3 mx-4 hover:scale-[101%] transition duration-700">
			<div className="relative group">
				<div className={glowColor + " absolute -inset-0 rounded-lg blur opacity-60 group-hover:opacity-100 transition duration-700 group-hover:duration-700 animate-tilt"} onClick={()=>{setProductCache(prod); setVendorCache(vendor)}}/>
					<Link href={"/product/" + props.type + "/" + props.address.toString()} >
						<div className={bgColor + " relative py-4 rounded-lg leading-none flex flex-col items-center overflow-hidden"}>
							<div className="flex justify-start w-[200px] px-2 gap-x-2 border-[#4F4F4F] border-2 border-opacity-30 rounded-full shadow bg-gradient-to-r to-[#120D20] from-[#19112E]">
								<div className="relative flex flex-shrink-0 h-9 w-9 overflow-hidden rounded-full my-1">
									<Image 
										alt="The profile picture of the item seller"
										src={vendorUS?.data.profilePic  || "https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50?d=mp&f=y"}
										layout="fill"
										objectFit="cover"
									/>
								</div>
								<div className="flex flex-col my-auto">
									<span className="flex text-gray-100 leading-none text-sm font-bold">{(vendorUS?.data.metadata && vendorUS.data.metadata.name) || "Jack"}</span>
									<span className="flex text-gray-300 text-xs">{(vendorUS?.address.toString().slice(0,10) + "...") || "DMgY6wi2FV..."}</span>
								</div>
							</div>
							<div className="relative mx-auto content-center my-2 overflow-visible">
								<div className={"absolute -bottom-3 -left-3 z-40 p-2  text-white font-bold bg-[#080B1A] bg-opacity-80 rounded-full border-[1px] text-ellipsis " + borderColor}>
									<span className="text-sm">{"$" + (prod?.data?.metadata?.price?.toString() || "12.345")}</span>
								</div>
								<div className="overflow-hidden rounded-lg">
									<Image
										alt="product image"
										src={(prod?.data?.metadata?.media && prod?.data.metadata.media[0]) || "/demologos.png"}
										layout="intrinsic"
										height={200}
										width={200}
										objectFit="cover"
									/>
								</div>
							</div>
							<div className="flex flex-col mt-4 justify-start w-4/5">
								<span className="font-bold text-white">{prod?.data?.metadata?.info?.name}</span>
								<div className="flex flex-row gap-1 mt-1">
									<div className="bg-[#201B31] align-middle font-semibold rounded-md drop-shadow-md p-1 text-[#8B8B8B] text-[.8rem]">
										{props.type?.charAt(0)?.toUpperCase() + "" +props.type?.slice(1).replace("Product","").replaceAll(/([A-Z])/g, (g1)=>{return ` ${g1}`})}
									</div>
								</div>
							</div>
						{prodButton}
					</div>
				</Link>
			</div>
		</div>
	)
}