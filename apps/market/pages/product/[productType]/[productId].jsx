import { useRouter } from "next/router";

import { 
	DigitalProductLayout,
	DigitalCommissionLayout,
	PhysicalProductLayout,
} from "@layouts/ProductDisplaysLayout";
import ProductCacheCtx from "@contexts/ProductCacheCtx";
import VendorCacheCtx from "@contexts/VendorCacheCtx";
import MarketAccountsCtx from "@contexts/MarketAccountsCtx";

import { MarketAccountFunctionalities } from "@functionalities/Accounts";

import { useState, useEffect, useContext } from "react";
import ProductClientCtx from "@contexts/ProductClientCtx";

///////////////////////////////////////////////////////////////////////////////////////////////////
// Dummy Products
// TODO: remove later
const dummyPhys = {}

const dummyCommission = {
	imageUrls: [ "/demologos.png", "/demologos.png", "/demologos.png" ],
	itemName: "10x custom logo pack",
	stock: null,
	type: "commission",
	price: {
		value: 12345.99,
		currency: "sol"
	}, 
	description: `We are a professional team of icon design specialists. We promise to deliver high-quality icons for whatever the required concepts are:\n\n
	1. You will get professional and beautiful icons (consistent in size and style).\n
	2. Icons will be purely made with original and creative ideas.\n
	3. In case You are not satisfied. We provide multiple revisions with full support for our clients.\n
	Order now! and get your beautiful icons designed. If you have any other questions, We are available 24/7, don't hesitate to contact us.`,
	seller: {
		sellerImg: null, 
		sellerName: "dummySeller",
		sellerAddr: "E5EP2qkdXmPwXA9ANzoG69Gmj86Jdqepjw2XrQDGj9sM"
	}
}

///////////////////////////////////////////////////////////////////////////////////////////////////
// Components
export default function ProductsPage(props) {
	const router = useRouter();
	const { productType, productId } = router.query;

	const {productClient} = useContext(ProductClientCtx)
	const {productCache} = useContext(ProductCacheCtx);
	const {marketAccountsClient} = useContext(MarketAccountsCtx);

	// fetch product somewhere in here from query
	const [prod, setProd] = useState();
	const [vendor, setVendor] = useState();

	const {GetPfp} = MarketAccountFunctionalities()

	useEffect(async ()=>{
		if(productCache && productCache.address.toString() == productId){
			setProd(productCache);
			return
		}
		let tp;
		
		switch (productType){
			case "commission":
				tp = await productClient.GetCommissionProduct(productId);
				break;
			case "digital":
				tp = await productClient.GetDigitalProduct(productId);
				break;
			case "physical":
				tp = await productClient.GetPhysicalProduct(productId);
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

	// here I'm just using the digital layout because it's the same for pretty much everything...
	// todo: add nfts later
	return (
		<>
			{((productType == "physical") && <DigitalProductLayout id={productId} product={dummyCommission} />) ||
			((productType == "digital") && <DigitalProductLayout id={productId} product={dummyCommission} />) ||
			(productType == "commission") && <DigitalProductLayout id={productId} product={dummyCommission} /> }
		</>
	)
}