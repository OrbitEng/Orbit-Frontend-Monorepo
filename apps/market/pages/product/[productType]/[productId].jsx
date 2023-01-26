import { useRouter } from "next/router";
import Head from "next/head";
import { HomeHeader } from "@includes/MarketHeader";
import { MainFooter } from "@includes/Footer";

import {DigitalProductLayout} from "@layouts/ProductLayouts/DigitalProductLayout";
import {CommissionProductLayout} from "@layouts/ProductLayouts/CommissionProductLayout";
import {PhysicalProductLayout} from "@layouts/ProductLayouts/PhysicalProductLayout";
import { PRODUCT_PROGRAM, TRANSACTION_PROGRAM } from "orbit-clients";
import ProductCacheCtx from "@contexts/ProductCacheCtx";
import VendorCacheCtx from "@contexts/VendorCacheCtx";

import { ProductCommonUtils } from "@functionalities/Products";

import { useState, useEffect, useContext } from "react";
import { PublicKey } from "@solana/web3.js";
import ArweaveCtx from "@contexts/ArweaveCtx";
import { GenericLayout } from "@layouts/HeaderFooterGenericLayout";

///////////////////////////////////////////////////////////////////////////////////////////////////
// Dummy Products
// TODO: remove later
const dummyPhys = {}

const dummyCommission = {
	address: "11111111111111111111111111111111",
	data: {
		metadata: {
			media: [ "/demologos.png", "/demologos.png", "/demologos.png" ],
			info: {
				name: "10x custom logo pack",
				description: `We are a professional team of icon design specialists. We promise to deliver high-quality icons for whatever the required concepts are:\n\n
				1. You will get professional and beautiful icons (consistent in size and style).\n
				2. Icons will be purely made with original and creative ideas.\n
				3. In case You are not satisfied. We provide multiple revisions with full support for our clients.\n
				Order now! and get your beautiful icons designed. If you have any other questions, We are available 24/7, don't hesitate to contact us.`
			},
			price: 12345.99,
			seller: {
				address: "E5EP2qkdXmPwXA9ANzoG69Gmj86Jdqepjw2XrQDGj9sM",
				data: {
					profilePic: "https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50?d=mp&f=y", 
					metadata: {
						name: "dummySeller",
						bio: "autobiography here lorem ipsum all abt the dollarsss"
					},
				},
				type: "MarketAccount"
			}
		},
		quantity: "812",
		digitalFileType: {Image: {}}
	},
	type: "CommissionProduct"
}

///////////////////////////////////////////////////////////////////////////////////////////////////
// Components
export default function ProductsPage(props) {
	const router = useRouter();
	const { productType, productId } = router.query;

	const {productCache} = useContext(ProductCacheCtx);
	const {arweaveClient} = useContext(ArweaveCtx);
	const {ResolveProductInfo, ResolveProductMedia} = ProductCommonUtils();

	// fetch product somewhere in here from query
	const [prod, setProd] = useState();
	const [vendor, setVendor] = useState();

	useEffect(async ()=>{
		if(productCache && productCache.address.toString() == productId){
			console.log("cached", productCache)
			setProd(productCache);
			return
		}
		let tp;
		if(!productId || (productId == "11111111111111111111111111111111")) return;
		
		switch (productType){
			case "commission":
				try{
					tp = await PRODUCT_PROGRAM.GetCommissionProduct(productId);
					if(!tp){
						return;
					}
				}catch(e){
					console.log("error", e)
				}
				
				break;
			case "digital":
				try{
					tp = await PRODUCT_PROGRAM.GetDigitalProduct(productId);
					if(!tp){
						return;
					}
				}catch(e){
					console.log("error", e)
				}
				
				break;
			case "physical":
				try{
					tp = await PRODUCT_PROGRAM.GetPhysicalProduct(productId);
					if(!tp){
						return;
					}
				}catch(e){
					console.log("error", e)
				}
				
				break;
			default:
				break;
		};

		if(tp){
			tp.data.metadata.info = JSON.parse(await arweaveClient.FetchData(tp.data.metadata.info));
			tp.data.metadata.media = await arweaveClient.GetImageData(tp.data.metadata.media);
			let vendor_listings_struct = (await PRODUCT_PROGRAM.GetListingsStruct(tp.data.metadata.ownerCatalog)).data;
			if(!vendor_listings_struct) return;
			tp.data.metadata.availability = PRODUCT_PROGRAM.FindProductAvailability(tp.data, vendor_listings_struct);
			let vendor = await ACCOUNTS_PROGRAM.GetAccount(
				ACCOUNTS_PROGRAM.GenAccountAddress(vendor_listings_struct.listingsOwner)
			);
			vendor.data.profilePic = await arweaveClient.GetPfp(vendor.data.profilePic);
			vendor.data.metadata = await arweaveClient.GetMetadata(vendor.data.metadata)
			tp.data.metadata.seller = vendor;
			setVendor(vendor);
		};
		setProd(tp);
	},[productType, productId, productCache, PRODUCT_PROGRAM.PRODUCT_PROGRAM._provider.connection, ACCOUNTS_PROGRAM.MARKET_ACCOUNTS_PROGRAM._provider.connection, arweaveClient])

	// here I'm just using the digital layout because it's the same for pretty much everything...
	// todo: add nfts later
	return (
		<GenericLayout>
			<div className="max-w-7xl align-center mx-auto">
				{((productType == "physical") && <PhysicalProductLayout prodInfo={prod ? prod : dummyCommission} />) ||
				((productType == "digital") && <DigitalProductLayout prodInfo={prod ? prod : dummyCommission} />) ||
				(productType == "commission") && <CommissionProductLayout prodInfo={prod ? prod : dummyCommission} /> }
			</div>
		</GenericLayout>
	)
}