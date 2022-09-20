import { useState } from "react";
import { HeaderSearchBar } from "@includes/components/SearchBar";
import { HomeHeader } from "@includes/MarketHeader";
import { MainFooter } from "@includes/Footer";
import Head from "next/head";
import Image from "next/image";
import { ArrowRightIcon } from "@heroicons/react/24/outline";

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
								<div className="flex group relative rounded-2xl my-auto h-1/2 w-1/3 hover:scale-[103%] transition duration-700">
									<div className="bg-[#26308F] absolute -inset-0 bg-opacity-70 rounded-lg blur-xl group-hover:bg-opacity-100 transition duration-700" />
									<div className="flex flex-col py-4 px-8 relative bg-gradient-to-tr from-[#2c2c2c] to-[#4a4a4a] w-full h-full rounded-2xl">
										<div className="relative flex w-1/2 h-1/2 mx-auto">
											<Image
												src="/emojis/globeEmojiImage.png"
												layout="fill"
												objectFit="contain"
												width={50}
											/>
										</div>
										<h1 className="text-3xl font-bold text-white mx-auto text-center">Physical</h1>
										<p className="text-xl text-[#6A6A6A] mx-auto justify-center mt-4 leading-tight text-center">
											Sell shoes, clothes tech, and much more with orbit, it's just a few clicks away!
										</p>
										<div className="rounded-full p-2 my-auto h-14 w-14 bg-gradient-to-tr from-[#0E0C15] to-[#18171D] via-[#161320] mx-auto content-center align-middle">
											<ArrowRightIcon className="h-10 w-10 text-[#3F46FF] m-auto stroke-2" />
										</div>
									</div>
								</div>
								<div className="flex group relative rounded-2xl my-auto h-1/2 w-1/3 hover:scale-[103%] transition duration-700">
									<div className="bg-[#4E268F] absolute -inset-0 bg-opacity-70 rounded-lg blur-xl group-hover:bg-opacity-100 transition duration-700" />
									<div className="flex flex-col py-4 px-8 relative bg-gradient-to-tr from-[#2c2c2c] to-[#4a4a4a] w-full h-full rounded-2xl">
										<div className="relative flex w-1/2 h-1/2 mx-auto">
											<Image
												src="/emojis/filesEmojiImage.png"
												layout="fill"
												objectFit="contain"
												width={50}
											/>
										</div>
										<h1 className="text-3xl font-bold text-white mx-auto text-center">Services</h1>
										<p className="text-xl text-[#6A6A6A] mx-auto justify-center mt-4 leading-tight text-center">
											Freelance and take comissions through Orbit, start your custom content adventures!
										</p>
										<div className="rounded-full p-2 my-auto h-14 w-14 bg-gradient-to-tr from-[#0E0C15] to-[#18171D] via-[#161320] mx-auto content-center align-middle">
											<ArrowRightIcon className="h-10 w-10 text-[#4E268F] m-auto stroke-2" />
										</div>
									</div>
								</div>
								<div className="flex group relative rounded-2xl my-auto h-1/2 w-1/3 hover:scale-[103%] transition duration-700">
									<div className="bg-[#81268F] absolute -inset-0 bg-opacity-70 rounded-lg blur-xl group-hover:bg-opacity-100 duration-700 transition" />
									<div className="flex flex-col py-4 px-8 relative bg-gradient-to-tr from-[#2c2c2c] to-[#4a4a4a] w-full h-full rounded-2xl">
										<div className="relative flex w-1/2 h-1/2 mx-auto">
											<Image
												src="/emojis/wrenchEmojiImage.png"
												layout="fill"
												objectFit="contain"
												width={50}
											/>
										</div>
										<h1 className="text-3xl font-bold text-white mx-auto text-center">Digital</h1>
										<p className="text-xl text-[#6A6A6A] mx-auto justify-center mt-4 leading-tight text-center">
											Get paid for your digital art, premade designs, beatpacks, private content and more!
										</p>
										<div className="rounded-full p-2 my-auto h-14 w-14 bg-gradient-to-tr from-[#0E0C15] to-[#18171D] via-[#161320] mx-auto content-center align-middle">
											<ArrowRightIcon className="h-10 w-10 text-[#FB3FFF] m-auto stroke-2" />
										</div>
									</div>
								</div>
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
