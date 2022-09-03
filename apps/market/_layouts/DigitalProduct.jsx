import { useContext, useState } from "react";

// import MatrixClientCtx from "@contexts/MatrixClientCtx";
import DigitalMarketCtx from "@contexts/DigitalMarketCtx";
import MarketAccountsCtx from "@contexts/MarketAccountsCtx";
import { PageSearchBar } from "@includes/components/SearchBar";
import { MarketFooter } from "@includes/Footer";

export function DigitalProductLayout(props){


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