import { useState } from "react";
import Head from "next/head";

import { HeaderSearchBar } from "@includes/components/SearchBar";
import { HomeHeader } from "@includes/MarketHeader";
import { MainFooter } from "@includes/Footer";
import { DigitalProductDisplay } from "@includes/ProductPageDisplay";

export function DigitalProductLayout(props){
	const [ searchBar, setSearchBar ] = useState(<HeaderSearchBar />);

    return(
		<div className="w-full min-h-screen bg-transparent">
			<Head>
				<title>Orbit</title>
				<link rel="icon" href="orbit.png" />
			</Head>
			<main className="bg-[url('/bgWallpaper.png')]">
				<HomeHeader headerMiddle={searchBar}/>
				<div className="max-w-7xl align-center mx-auto">
					<DigitalProductDisplay
						prodInfo={props.product}
					/>
				</div>
				<MainFooter />
			</main>
		</div>
	)
}