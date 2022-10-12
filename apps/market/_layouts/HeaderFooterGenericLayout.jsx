import { useContext, useState } from "react";
import Head from "next/head";

import DigitalMarketCtx from "@contexts/DigitalMarketCtx";
import MarketAccountsCtx from "@contexts/MarketAccountsCtx";

import { HeaderSearchBar } from "@includes/components/SearchBar";
import { HomeHeader } from "@includes/MarketHeader";
import { MainFooter } from "@includes/Footer";
import { ProductDisplay } from "@includes/ProductPageDisplay";

export function GenericLayout(props){
	const [ searchBar, setSearchBar ] = useState(<HeaderSearchBar />);

    return(
		<div className="w-full min-h-screen bg-transparent">
			<Head>
				<title>Orbit</title>
				<link rel="icon" href="/orbit.png" />
			</Head>
			<main className="bg-[url('/bgWallpaper.png')] min-h-screen">
				<HomeHeader headerMiddle={searchBar}/>
				<div className="max-w-7xl align-center mx-auto">
					{props.children}
				</div>
				<MainFooter />
			</main>
		</div>
	)
}