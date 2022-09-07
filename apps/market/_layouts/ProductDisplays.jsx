import { useContext, useState } from "react";
import Head from "next/head";

// import MatrixClientCtx from "@contexts/MatrixClientCtx";
import DigitalMarketCtx from "@contexts/DigitalMarketCtx";
import MarketAccountsCtx from "@contexts/MarketAccountsCtx";
import { HeaderSearchBar } from "@includes/components/SearchBar";
import { HomeHeader } from "@includes/MarketHeader";
import { MainFooter } from "@includes/Footer";
import { ProductDisplay } from "@includes/ProductPageDisplay";

const dummyDescription = `We are a professional team of icon design specialists. We promise to deliver high-quality icons for whatever the required concepts are:\n\n
1. You will get professional and beautiful icons (consistent in size and style).\n
2. Icons will be purely made with original and creative ideas.\n
3. In case You are not satisfied. We provide multiple revisions with full support for our clients.\n
Order now! and get your beautiful icons designed. If you have any other questions, We are available 24/7, don't hesitate to contact us.`

export function DigitalProductLayout(props){
	const [ searchBar, setSearchBar ] = useState(<HeaderSearchBar />);

    return(
		<div className="w-full min-h-screen bg-transparent">
			<Head>
				<title>Market Home</title>
				<link rel="icon" href="orbit.png" />
			</Head>
			<main className="bg-[url('/bgWallpaper.png')] bg-cover">
				<HomeHeader headerMiddle={searchBar}/>
				<div className="max-w-7xl align-center mx-auto">
					<ProductDisplay
						description={dummyDescription}
					/>
				</div>
                <MainFooter />
			</main>
		</div>
	)
}

export function PhysicalProductLayout(props) {
	return(
		<div>
			coming soon
		</div>
	)
}

export function DigitalServiceLayout(props) {
	return(
		<div>
			coming soon
		</div>
	)
}