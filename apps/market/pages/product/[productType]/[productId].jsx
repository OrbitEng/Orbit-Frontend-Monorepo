import { useRouter } from "next/router";

import { 
	DigitalProductLayout,
	DigitalServiceLayout,
	PhysicalProductLayout,
} from "@layouts/ProductDisplays";
import DigitalMarketCtx from "@contexts/DigitalMarketCtx";
import PhysicalMarketCtx from "@contexts/PhysicalMarketCtx";
import ProductCacheCtx from "@contexts/ProductCacheCtx";
import VendorCacheCtx from "@contexts/VendorCacheCtx";
import { useState, useEffect, useContext } from "react";

///////////////////////////////////////////////////////////////////////////////////////////////////
// Dummy Products
// TODO: remove later
const dummyPhys = {}

const dummyService = {
	imageUrls: [ "/demologos.png", "/demologos.png", "/demologos.png" ],
	itemName: "10x custom logo pack",
	stock: null,
	type: "service",
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

async function ResolveArweaveImages(medialink){
	let arclient = new ArQueryClient();
	let media = (await arclient.FetchData(medialink)).split("~~");
	let desc = "";
	if(media.length == 2){
		desc = media[1];
	}
	media = media[0].split("||");
	

	return [(
		await Promise.all(
			media.map((block)=>{
				return new Promise((fulfill, reject) => {
					let reader = new FileReader();
					reader.onerror = reject;
					reader.onload = (e) => fulfill(reader.result);
					reader.readAsDataURL(new Blob([Buffer.from(stou(block))]));
				})
			})
		)
	), desc];
}

///////////////////////////////////////////////////////////////////////////////////////////////////
// Components
export default function ProductsPage(props) {
	const router = useRouter();
	const { productType, productId } = router.query;

	const {digitalMarketClient} = useContext(DigitalMarketCtx);
	const {physicalMarketClient} = useContext(PhysicalMarketCtx);
	const {productCache} = useContext(ProductCacheCtx);
	const {marketAccountsClient} = useContext(MarketAccountsCtx);
	const {setVendorCache} = useContext(VendorCacheCtx);

	// fetch product somewhere in here from query
	const [prod, setProd] = useState();
	const [vendor, setVendor] = useState();

	useEffect(async ()=>{
		if(productCache && productCache.address.toString() == productId){
			setProd(productCache);
			return
		}
		let tp = "";

		switch (productType){
			case "commission":
			case "template":
				tp = await digitalMarketClient.GetDigitalProduct(productId);
				break;
			case "physical":
				tp = await physicalMarketClient.GetPhysicalProduct(productId);
				break;
			case "nft":
				break;
			default:
				break;
		};

		[tp.data.images, tp.data.description] = ResolveArweaveImages(tp.data.metadata.media);
		setProd(tp);
		setVendor(await marketAccountsClient.GetAccount(tp.data.metadata.seller));
	},[])

	// here I'm just using the digital layout because it's the same for pretty much everything...
	// todo: add nfts later
	return (
		<>
			{ productType === "physical" && <DigitalProductLayout id={productId} product={dummyService} /> }
			{ productType === "template" && <DigitalProductLayout id={productId} product={dummyService} /> }
			{ productType === "commission" && <DigitalProductLayout id={productId} product={dummyService} /> }
		</>
	)
}