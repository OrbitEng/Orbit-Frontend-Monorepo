import { useContext, useState } from "react";
import Head from "next/head";


import { HeaderSearchBar } from "@includes/components/SearchBar";
import { HomeHeader } from "@includes/MarketHeader";
import { MainFooter } from "@includes/Footer";
import { ChatWidget } from "@includes/ChatWidget";

export function GenericLayout(props){
	const [ searchBar, setSearchBar ] = useState(<HeaderSearchBar />);
	console.log(props.children)

    return(
		<div className="min-h-screen relative">
			<Head>
				<title>Orbit</title>
				<link rel="icon" href="/orbit.png" />
			</Head>
			<main className="w-full h-full relative bg-[url('/bgWallpaper.png')] bg-cover overflow-hidden">
				<HomeHeader />
				<div className="relative sm:mt-32 mt-[7.5rem]">
					{props.children}
				</div>
				{props?.chat && <ChatWidget />}
				<MainFooter />
			</main>
		</div>
	)
}

export function WideGenericLayout(props){
	const [ searchBar, setSearchBar ] = useState(<HeaderSearchBar />);

    return(
		<div className="w-full min-h-screen bg-transparent">
			<Head>
				<title>Orbit</title>
				<link rel="icon" href="/orbit.png" />
			</Head>
			<main className="bg-[url('/bgWallpaper.png')] min-h-screen bg-cover">
				<HomeHeader headerMiddle={searchBar}/>
				<div className="max-w-[100rem] align-center mx-auto">
					{props.children}
				</div>
				{props?.chat && <ChatWidget />}
				<MainFooter />
			</main>
		</div>
	)
}
