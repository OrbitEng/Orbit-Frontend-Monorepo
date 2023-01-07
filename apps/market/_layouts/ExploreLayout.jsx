import Head from "next/head";
import Image from "next/image";
import { HomeHeader } from "@includes/MarketHeader";
import { MainFooter } from "@includes/Footer";
import { useState, useEffect, Fragment } from "react";

import OrbitFullLogo from "../public/OrbitLogos/OrbitFullLogo.png";
import { PageSearchBar } from "@includes/components/SearchBar";
import { LargeProductExplorer } from "@includes/components/product_display/LargeProductExplorer";
import { Transition } from "@headlessui/react";

export default function ExploreLayout(props) {
	const [listingsExplorerCategory, setListingsExplorerCategory] = useState();
	const [displayOption, setDisplayOption] = useState("Physical");

	const [physicalListings, setPhysicalListings] = useState();
	const [digitalListings, setDigitalListings] = useState();
	const [commissionListings, setCommissionListings] = useState();

	useEffect(()=>{
		switch(displayOption){
			case "Physical":
				setListingsExplorerCategory(physicalListings)
				break;
			case "Digital":
				setListingsExplorerCategory(digitalListings)
				break;
			case "Commission":
				setListingsExplorerCategory(commissionListings)
				break;
		}
	},[displayOption, physicalListings, digitalListings, commissionListings]);

	return(
		<div className="w-full min-h-screen bg-transparent">
			<Head>
				<title>Orbit</title>
				<link rel="icon" href="orbit.png" />
			</Head>
			<main className="bg-[url('/ExploreBg/Explore.svg')] bg-auto overflow-hidden bg-no-repeat min-h-screen">
				<HomeHeader />
				{/* Hero Section */}
				<div className="w-full flex h-[28rem] sm:mt-56 mt-[7.5rem]"> 
					<div className="flex flex-col sm:my-auto mx-auto w-full h-full justify-between">
						<Transition
							appear={true}
							show={true}
							as={Fragment}
							enter="transition transform transition-opacity transition-transform transition-all duration-700 ease-in-out delay-[600ms]"
							enterFrom="opacity-0 -translate-y-20"
							enterTo="opacity-100 -translate-y-0"
							leave="transform duration-200 transition ease-in-out"
							leaveFrom="opacity-100 rotate-0 scale-100"
							leaveTo="opacity-0 scale-95"
						>	
							<div className="flex relative max-w-[200px] sm:max-w-sm w-full h-1/2 mt-auto mx-auto"> 
								<div className="relative max-w-[180px] max-h-[90px] sm:max-w-sm sm:max-h-[182px] w-full h-full mt-auto mx-auto">
									<Image 
										layout="fill"
										objectFit="contain"
										src={OrbitFullLogo}
									/>
								</div>
							</div>
						</Transition>
						<div className="relative max-w-sm w-full h-1/2 mx-auto mb-auto"> 
							<PageSearchBar />
						</div>
					</div>
				</div>
				<div className="flex max-w-[100rem] mx-auto w-full px-6">
					<LargeProductExplorer displayOption={[displayOption, setDisplayOption]} items={listingsExplorerCategory} category={displayOption.toLowerCase()} />
				</div>
			</main>
		</div>
	)
}