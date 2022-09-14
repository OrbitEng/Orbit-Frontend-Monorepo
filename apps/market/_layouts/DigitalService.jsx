import { useState } from "react";
import {setCookie} from "cookies-next";

import { PageSearchBar } from "@includes/components/SearchBar";
import { MarketFooter } from "@includes/Footer";

import { DigitalPurchasing } from "_functionalities/Purchasing";

export function DigitalProductLayout(props){
    const {buyDigitalProd} = DigitalPurchasing();

	const [product, setProduct] = useState(props.product); // type DigitalProduct in idl
	const [vendor, setVendor] = useState(props.vendor); // type OrbitMarketAccount in idl + metadat

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