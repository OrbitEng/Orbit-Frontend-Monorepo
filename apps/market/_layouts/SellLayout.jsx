import { useState } from "react";
import { HeaderSearchBar } from "@includes/components/SearchBar";
import { HomeHeader } from "@includes/MarketHeader";
import { MainFooter } from "@includes/Footer";
import Head from "next/head";
import Image from "next/image";

export function SellLayout(props){
	const [ searchBar, setSearchBar ] = useState(<HeaderSearchBar />);
	const [ selectedCategory, setSelectedCategory ] = useState(null);

    return(
		<div className="w-full min-h-screen bg-transparent">
			<Head>
				<title>Market Home</title>
				<link rel="icon" href="orbit.png" />
			</Head>
			<main className="bg-[url('/oldbgWallpaper.png')]">
				<HomeHeader headerMiddle={searchBar}/>
				<div className="-mt-14 sm:-mt-32 max-w-7xl align-center mx-auto h-view">
					{
						(selectedCategory == null || selectedCategory == undefined) ? 
						(
							<div className="flex flex-row justify-around w-full mx-auto h-[100vh] gap-24 content-center my-auto">
								<div className="flex group relative rounded-2xl my-auto h-1/2 w-1/3">
									<div className="bg-blue-500 absolute -inset-0 bg-opacity-50 rounded-lg blur-xl" />
									<div className="flex flex-col p-4 relative bg-gradient-to-tr from-[#2c2c2c] to-[#4a4a4a] w-full h-full rounded-2xl">
										<Image
											src="/emojis/globeEmojiImage.png"
											layout="intrinsic"
											height={181}
											width={181}
										/>
									</div>
								</div>
								<div className="flex bg-black rounded-2xl h-1/2 w-1/3 my-auto">Hello</div>
								<div className="flex bg-black rounded-2xl h-1/2 w-1/3 my-auto">Hello</div>
							</div>
						) : (
							<div></div>
						)
					}
					<MainFooter />
				</div>
			</main>
		</div>
	)
}
