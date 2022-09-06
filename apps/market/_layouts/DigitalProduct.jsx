import { useState } from "react";
import {setCookie} from "cookies-next";

import { PageSearchBar } from "@includes/components/SearchBar";
import { MarketFooter } from "@includes/Footer";
import { useCallback } from "react";

import { DigitalPurchasing } from "_functionalities/Purchasing";

export function DigitalProductLayout(props){

	const [product, setProduct] = useState(props.product); // type DigitalProduct in idl
	const [vendor, setVendor] = useState(props.vendor); // type OrbitMarketAccount in idl + metadat

	const {buyDigitalProd} = DigitalPurchasing();

	const addToCart = useCallback(()=>{
		setCookie(product.address.toString(), JSON.stringify({type: "digital", product: product, vendor: vendor}));
	},[]);


    return(
		<div className="w-full min-h-screen bg-transparent">
			<Head>
				<title>Market Home</title>
				<link rel="icon" href="favicon.ico" />
			</Head>
			<main className="bg-[url('/bgWallpaper.png')] bg-cover">
				<HomeHeader headerMiddle={PageSearchBar}/>
				<div className="max-w-5xl align-center mx-auto">
					
				</div>
                <MarketFooter />
			</main>
		</div>
	)
}