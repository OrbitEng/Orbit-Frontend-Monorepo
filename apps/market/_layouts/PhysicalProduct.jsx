import { useState } from "react";
import {setCookie} from "cookies-next";

import { PageSearchBar } from "@includes/components/SearchBar";
import { MarketFooter } from "@includes/Footer";
import { useCallback } from "react";

import { Purchasing } from "@functionalities/Purchasing";

export function PhysicalProductLayout(props){

	const [product, setProduct] = useState(props.product); // type PhysicalProduct in idl
	const [vendor, setVendor] = useState(props.vendor); // type OrbitMarketAccount in idl + metadat

	const {buyPhysicalProd} = PhysicalPurchasing();

	const addToCart = useCallback(()=>{
		setCookie(product.address.toString(), JSON.stringify({type: "physical", product: product, vendor: vendor}));
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