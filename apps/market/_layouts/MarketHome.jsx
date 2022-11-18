import { HomeBanner } from '@includes/CardCarousel'
import { ProductDisplayCard } from '@includes/components/cards/ProductDisplayCards'
import { PageSearchBar, HeaderSearchBar } from '@includes/components/SearchBar'
import { HomeHeader } from '@includes/MarketHeader'
import {ProductShowcaseRow} from '@includes/components/product_display/ProductShowcaseRow'
import TopVendorsDisplay from '@includes/TopVendorsDisplay'
import NewsStand from '@includes/NewsStand'
import Head from 'next/head'
import { NavBar } from '@includes/components/NavBar'
import { MainFooter } from '@includes/Footer';
import { useState, useEffect, useRef, useContext } from 'react'
import useOnScreen from '@hooks/useOnScreen'

import DigitalMarketCtx from '@contexts/DigitalMarketCtx'
import PhysicalMarketCtx from '@contexts/PhysicalMarketCtx'
import CommissionMarketCtx from '@contexts/CommissionMarketCtx'
import ProductClientCtx from '@contexts/ProductClientCtx'
import { ChatWidget } from '@includes/ChatWidget'

export function Home(props) {
	const ref = useRef();
	const searchBarVisible = useOnScreen(ref);

	const [ headerMiddle, setHeaderMiddle ] = useState(NavBar);

	const {digitalMarketClient} = useContext(DigitalMarketCtx);
	const {physicalMarketClient} = useContext(PhysicalMarketCtx);
	const {commissionMarketClient} = useContext(CommissionMarketCtx);
	const {productClient} = useContext(ProductClientCtx);

	const [recentCommissions, setRecentCommissions] = useState([]);
	const [recentDigitals, setRecentDigitals] = useState([]);
	const [recentPhysicals, setRecentPhysicals] = useState([]);

	useEffect(() => {
		searchBarVisible ? setHeaderMiddle(<NavBar />) : setHeaderMiddle(<HeaderSearchBar />)
	}, [searchBarVisible]);

	useEffect(async ()=>{
		if(!digitalMarketClient || !physicalMarketClient || !productClient) return;

		let digital_catalog = await productClient.GetRecentMarketListings(
			productClient.GenRecentListings("digital")
		);
		let commission_catalog = await productClient.GetRecentMarketListings(
			productClient.GenRecentListings("commission")
		);
		let physical_catalog = await productClient.GetRecentMarketListings(
			productClient.GenRecentListings("physical")
		);
		
		digital_catalog.data.pubkeys = digital_catalog.data.pubkeys.filter( pk => pk.toString() != "11111111111111111111111111111111");
		commission_catalog.data.pubkeys = commission_catalog.data.pubkeys.filter( pk => pk.toString() != "11111111111111111111111111111111");
		physical_catalog.data.pubkeys = physical_catalog.data.pubkeys.filter( pk => pk.toString() != "11111111111111111111111111111111");


		if(!(digital_catalog.data.pubkeys.length) || !(commission_catalog.data.pubkeys.length) || !(physical_catalog.data.pubkeys.length)) return;

		setRecentCommissions(commission_catalog.data.pubkeys);
		setRecentDigitals(digital_catalog.data.pubkeys);
		setRecentPhysicals(physical_catalog.data.pubkeys);

	}, [digitalMarketClient, physicalMarketClient, commissionMarketClient]);

	return(
		<div className="w-full min-h-screen bg-transparent">
			<Head>
				<title>Orbit</title>
				<link rel="icon" href="orbit.png" />
			</Head>
			<main className="bg-[url('/bgWallpaper.png')] bg-cover">
				<HomeHeader headerMiddle={headerMiddle} />
				<div className="max-w-6xl align-center mx-auto">
					<HomeBanner />
					<PageSearchBar ref={ref}/>
					<ProductShowcaseRow title="Local Products" prod_type="local" addresses={recentPhysicals} searchable />
					<ProductShowcaseRow title="Physical Items" prod_type="physical" addresses={recentPhysicals} searchable />
					<ProductShowcaseRow title="Digital Products" prod_type="digital" addresses={recentDigitals} searchable />
					<ProductShowcaseRow title="Commissions" prod_type="commission" addresses={recentCommissions} searchable />
					<NewsStand />
					<ChatWidget />
				</div>
				<MainFooter />
			</main>
		</div>
	)
}
