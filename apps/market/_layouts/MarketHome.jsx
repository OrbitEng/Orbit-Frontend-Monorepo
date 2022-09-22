import { HomeBanner } from '@includes/CardCarousel'
import { ProductDisplayCard } from '@includes/components/ProductDisplayCards'
import { PageSearchBar, HeaderSearchBar } from '@includes/components/SearchBar'
import { HomeProductExplorer } from '@includes/HomeProductExplorer'
import { HomeHeader } from '@includes/MarketHeader'
import ProductShowcaseRow from '@includes/ProductShowcaseRow'
import TopVendorsDisplay from '@includes/TopVendorsDisplay'
import NewsStand from '@includes/NewsStand'
import Head from 'next/head'
import { NavBar } from '@includes/components/NavBar'
import { MainFooter } from '@includes/Footer';
import { useState, useEffect, useRef, useContext } from 'react'
import useOnScreen from '@hooks/useOnScreen'

import DigitalMarketCtx from '@contexts/DigitalMarketCtx'
import PhysicalMarketCtx from '@contexts/PhysicalMarketCtx'
import CatalogCtx from '@contexts/CatalogCtx'

export function Home(props) {
	const ref = useRef();
	const searchBarVisible = useOnScreen(ref);

	const [ headerMiddle, setHeaderMiddle ] = useState(NavBar);

	const {digitalMarketClient} = useContext(DigitalMarketCtx);
	const {physicalMarketClient} = useContext(PhysicalMarketCtx);
	const {catalogClient} = useContext(CatalogCtx);

	const [recentCommissions, setRecentCommissions] = useState();
	const [recentTemplatess, setRecentTemplatess] = useState();
	const [recentPhysicals, setRecentPhysicals] = useState();

	useEffect(() => {
		searchBarVisible ? setHeaderMiddle(<NavBar />) : setHeaderMiddle(<HeaderSearchBar />)
	}, [searchBarVisible]);

	useEffect(async ()=>{
		if(!digitalMarketClient || !physicalMarketClient) return;

		let digital_template_catalog = await catalogClient.GetModCatalog(
			(await digitalMarketClient.GenRecentCatalogTemplate())[0]
		);
		let digital_commission_catalog = await catalogClient.GetModCatalog(
			(await digitalMarketClient.GenRecentCatalogCommission())[0]
		);
		let physical_catalog = await catalogClient.GetModCatalog(
			(await physicalMarketClient.GenRecentCatalog())[0]
		);

		if(!(digital_template_catalog && digital_template_catalog.data) || !(digital_commission_catalog && digital_commission_catalog.data) || !(physical_catalog && physical_catalog.data)) return;

		setRecentCommissions(digital_commission_catalog.data.pubkeys);
		setRecentTemplatess(digital_template_catalog.data.pubkeys);
		setRecentPhysicals(physical_catalog.data.pubkeys);

	}, [digitalMarketClient, physicalMarketClient]);



	return(
		<div className="w-full min-h-screen bg-transparent">
			<Head>
				<title>Market Home</title>
				<link rel="icon" href="orbit.png" />
			</Head>
			<main className="bg-[url('/bgWallpaper.png')] bg-cover">
				<HomeHeader headerMiddle={headerMiddle} />
				<div className="max-w-6xl align-center mx-auto">
					<HomeBanner />
					<PageSearchBar ref={ref}/>
					<TopVendorsDisplay />
					<ProductShowcaseRow title="Physical Items" prod_type="physical" addresses={recentPhysicals} searchable />
					<ProductShowcaseRow title="Digital Products" prod_type="template" addresses={recentTemplatess} searchable />
					<ProductShowcaseRow title="Services" prod_type="commission" addresses={recentCommissions} searchable />
					<NewsStand />
					<MainFooter />
				</div>
			</main>
		</div>
	)
}
