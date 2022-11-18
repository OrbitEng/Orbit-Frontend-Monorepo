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
import { Category } from "matrix-js-sdk";

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
		<div className="row-span-1 col-span-1 my-3 mx-4">
			<div className="relative group">
				<div className="bg-[#13111C] rounded-[10px] leading-none flex flex-col items-center overflow-hidden px-3 pt-3 pb-6">
					<div className="overflow-hidden bg-[#535353] animate-pulse rounded-[9px] w-full h-[230px] mb-4" />
					<div className="w-full h-7 bg-[#535353] animate-pulse rounded-[6px] mb-2"/>
					<div className="w-[40%] h-5 bg-[#535353] animate-pulse rounded-[4px] mr-auto mb-4"/>
					<div className="w-[40%] h-9 bg-[#535353] animate-pulse rounded-[12px] mx-auto"/>
				</div>
			</div>
		</div>
	)
}

export function ProductDisplayCardHome(props) {
	const [prod, setProd] = useState();
	const [vendorUS, setVendorUS] = useState();

	let productTags = ["UX/UI", "design"]
	let categoryTag = (
		<div className="relative">
			<div className="absolute -inset-0 bg-[#875EFF] blur"/>
			<div className="relative flex flex-row py-1 px-2 rounded-[4px] bg-[#2A1D4F]">
				<span className="text-[#875EFF] my-auto text-sm">Commission</span>
				<span className="h-4"/>
			</div>
		</div>
	)
	return(
		<div className="row-span-1 col-span-1 my-3 mx-4">
			<Tilt tiltMaxAngleX={10} tiltMaxAngleY={10} glareEnable={true} glareColor="#ffffff" glareMaxOpacity={0.1} glareBorderRadius="10px" glarePosition="all">
				<div className="relative group overflow-visible">
					<div className="absolute -inset-0 -rotate-1 blur-sm" style={{background: "radial-gradient(ellipse at center, transparent, rgba(135,94,255,0.5) 90%, rgba(71,71,71,0.24) 100%)"}}/>
					<div className="relative bg-[#13111C] rounded-[10px] leading-none flex flex-col items-center overflow-hidden px-3 pt-3 pb-4">
						<div className="flex relative w-full overflow-visible">
							<div className="absolute flex flex-row gap-x-1 gradient-box -bottom-3 left-1 z-40 py-1 px-2 bg-gradient-to-br from-[#181424] via-[#2D2A35] to-[#181424] text-white rounded-lg border-t-[1.5px] border-[#3F3F3F] max-w-[50%]">
								<span className="overflow-hidden relative flex rounded-full h-6 w-6 flex-shrink-0">
									<Image
										src={vendorUS?.data.profilePic  || "https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50?d=mp&f=y"}
										layout="fill"
										objectFit="cover"
										loading="lazy"
									/>
								</span>
								<span className="my-auto text-[#EFEFEF] font-semibold text-sm truncate">{("@" + vendorUS?.address?.toString())}</span>
							</div>
							<div className="absolute flex flex-row gradient-box -bottom-3 right-1 z-40 text-white rounded-lg overflow-hidden px-2 py-1 bg-gradient-to-br from-[#181424] via-[#2D2A35] to-[#181424] max-w-[40%]">
								{/* For now I am just leaving the prices in USD but talk to indy about this... */}
								<span className="my-auto align-middle text-center truncate">{"$" + (Math.round(prod?.data?.metadata?.price) ? Math.round(prod?.data?.metadata?.price)?.toString() : "123")}</span>
								<span className="h-6"/>
							</div>
							<div className="flex relative overflow-hidden rounded-[9px] w-full h-[230px]">
								<Image
									alt="product image"
									src={"/demologos.png"}
									layout="fill"
									objectFit="cover"
									loading="lazy"
								/>
							</div>
						</div>
						<span className="text-2xl text-white font-bold truncate w-full text-left px-2 mt-4">{prod?.data?.metadata?.info?.name || "Icon Pack"}</span>
						<span
							className="text-sm font-semibold text-[#7B7B7B] underline text-left w-full px-2 cursor-pointer"
							onClick={() => {console.log("navigate using router")}}
						>
							View Listing
						</span>
						<div className="flex flex-row gap-x-2 w-full px-2 justify-start mt-3 mb-5">
							{categoryTag}
							{productTags?.map((tagName) => {
								return(
									<div className="flex flex-row py-1 px-2 bg-[#1B1B1B] rounded-[4px]">
										<span className="my-auto text-sm text-[#646464]">{tagName}</span>
									</div>
								)
							})}
						</div>
						{props?.type == "commission" ? (
							<button
								className="font-bold text-lg py-1 px-3 text-white bg-gradient-to-t from-[#000] to-[#0F1025] rounded-[12px] drop-shadow border-2 border-[#2D2D2D] border-opacity-60"
							>
								&#9889; Quick Buy
							</button>
						) : (
							<button
								className="font-bold text-lg py-1 px-3 text-white bg-gradient-to-t from-[#000] to-[#0F1025] rounded-[12px] drop-shadow border-2 border-[#2D2D2D] border-opacity-60"
							>
								&#9993;&#65039; Request
							</button>
						)}
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
			tp.data.metadata.info = await ResolveProductInfo(tp.data.metadata.info);
			tp.data.metadata.media = await ResolveProductMedia(tp.data.metadata.media);

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