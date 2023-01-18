import { PageSearchBar, HeaderSearchBar } from '@includes/components/SearchBar'
import { HomeHeader } from '@includes/MarketHeader'
import {ProductShowcaseRow} from '@includes/components/product_display/ProductShowcaseRow'
import Head from 'next/head'
import { MainFooter } from '@includes/Footer';
import { useState, useEffect, useRef, useContext } from 'react'
import { PRODUCT_PROGRAM } from 'orbit-clients';
import useOnScreen from '@hooks/useOnScreen'

import HomeNewsCarousel from '@includes/components/HomeNewsCarousel';
import HoloGrayButton from '@includes/components/buttons/HoloGrayButton';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';


export function Home(props) {
	const ref = useRef();
	const wallet = useWallet();
	const {connection} = useConnection();
	const searchBarVisible = useOnScreen(ref);

	const [recentCommissions, setRecentCommissions] = useState([]);
	const [recentDigitals, setRecentDigitals] = useState([]);
	const [recentPhysicals, setRecentPhysicals] = useState([]);

	// todo: split this up

	useEffect(async ()=>{
		if (!PRODUCT_PROGRAM.PRODUCT_PROGRAM.provider.connection){
			return;
		}
		let digital_catalog = await PRODUCT_PROGRAM.GetRecentMarketListings(
			PRODUCT_PROGRAM.GenRecentListings("digital")
		);
		let commission_catalog = await PRODUCT_PROGRAM.GetRecentMarketListings(
			PRODUCT_PROGRAM.GenRecentListings("commission")
		);
		let physical_catalog = await PRODUCT_PROGRAM.GetRecentMarketListings(
			PRODUCT_PROGRAM.GenRecentListings("physical")
		);
		
		digital_catalog.data.pubkeys = digital_catalog.data.pubkeys.filter( pk => pk.toString() != "11111111111111111111111111111111");
		commission_catalog.data.pubkeys = commission_catalog.data.pubkeys.filter( pk => pk.toString() != "11111111111111111111111111111111");
		physical_catalog.data.pubkeys = physical_catalog.data.pubkeys.filter( pk => pk.toString() != "11111111111111111111111111111111");


		if(!(digital_catalog.data.pubkeys.length && commission_catalog.data.pubkeys.length && physical_catalog.data.pubkeys.length)) return;

		setRecentCommissions(commission_catalog.data.pubkeys);
		setRecentDigitals(digital_catalog.data.pubkeys);
		setRecentPhysicals(physical_catalog.data.pubkeys);

	}, [wallet.connected, PRODUCT_PROGRAM.PRODUCT_PROGRAM.provider.connection]);

	return(
		<div className="w-full min-h-screen bg-transparent">
			<Head>
				<title>Orbit</title>
				<link rel="icon" href="orbit.png" />
			</Head>
			<main className="bg-[#0B090E] overflow-hidden">
				<HomeHeader />
				<HomeNewsCarousel />
				<div className="max-w-6xl align-center mx-auto overflow-hidden">
					<ProductShowcaseRow title="Find Local Products" prod_type="local" addresses={recentPhysicals} searchable search_placeholder="Search in Local products"/>
					<ProductShowcaseRow title="Find Shipped Products" prod_type="physical" addresses={recentPhysicals} searchable search_placeholder="Search in Shipped products"/>
					<ProductShowcaseRow title="Find Digital Products" prod_type="digital" addresses={recentDigitals} searchable search_placeholder="Search in Digital products" />
					<ProductShowcaseRow title="Book Commissions" prod_type="commission" addresses={recentCommissions} searchable search_placeholder="Search in Commissions" />
				</div>
				<MainFooter />
			</main>
		</div>
	)
}
