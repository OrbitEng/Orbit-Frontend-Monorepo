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
import CommissionMarketCtx from '@contexts/CommissionMarketCtx'
import CatalogCtx from '@contexts/CatalogCtx'

export function Home(props) {
	const ref = useRef();
	const searchBarVisible = useOnScreen(ref);

	const [ headerMiddle, setHeaderMiddle ] = useState(NavBar);

	const {digitalMarketClient} = useContext(DigitalMarketCtx);
	const {physicalMarketClient} = useContext(PhysicalMarketCtx);
	const {commissionMarketClient} = useContext(CommissionMarketCtx);
	const {catalogClient} = useContext(CatalogCtx);

	const [recentCommissions, setRecentCommissions] = useState();
	const [recentTemplatess, setRecentTemplatess] = useState();
	const [recentPhysicals, setRecentPhysicals] = useState();

	useEffect(() => {
		searchBarVisible ? setHeaderMiddle(<NavBar />) : setHeaderMiddle(<HeaderSearchBar />)
	}, [searchBarVisible]);

	useEffect(async ()=>{
		if(!digitalMarketClient || !physicalMarketClient || !catalogClient) return;

		let digital_catalog = await catalogClient.GetModCatalog(
			(await digitalMarketClient.GenRecentCatalog())[0]
		);
		let commission_catalog = await catalogClient.GetModCatalog(
			(await commissionMarketClient.GenRecentCatalog())[0]
		);
		let physical_catalog = await catalogClient.GetModCatalog(
			(await physicalMarketClient.GenRecentCatalog())[0]
		);

		if(!(digital_catalog && digital_catalog.data) || !(commission_catalog && commission_catalog.data) || !(physical_catalog && physical_catalog.data)) return;

		setRecentCommissions(commission_catalog.data.pubkeys);
		setRecentTemplatess(digital_catalog.data.pubkeys);
		setRecentPhysicals(physical_catalog.data.pubkeys);

	}, [digitalMarketClient, physicalMarketClient]);



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
					<TopVendorsDisplay />
					<ProductShowcaseRow title="Physical Items" prod_type="physical" addresses={recentPhysicals} searchable />
					<ProductShowcaseRow title="Digital Products" prod_type="template" addresses={recentTemplatess} searchable />
					<ProductShowcaseRow title="Services" prod_type="commission" addresses={recentCommissions} searchable />
					<NewsStand />
				</div>
				<MainFooter />
			</main>
		</div>
	)
}
