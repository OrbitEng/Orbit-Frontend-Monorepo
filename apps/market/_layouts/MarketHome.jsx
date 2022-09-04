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
import { useState, useEffect, useRef } from 'react'
import useOnScreen from '@hooks/useOnScreen'


export function Home(props) {
	const ref = useRef();
	const searchBarVisible = useOnScreen(ref);

	const [ headerMiddle, setHeaderMiddle ] = useState(NavBar);

	useEffect(() => {
			console.log(searchBarVisible)
			searchBarVisible ?
				setHeaderMiddle(<NavBar />) : setHeaderMiddle(<HeaderSearchBar />)
		},
		[searchBarVisible]
	)

	return(
		<div className="w-full min-h-screen bg-transparent">
			<Head>
				<title>Market Home</title>
				<link rel="icon" href="favicon.ico" />
			</Head>
			<main className="bg-[url('/bgWallpaper.png')] bg-cover">
				<HomeHeader headerMiddle={headerMiddle} />
				<div className="max-w-6xl align-center mx-auto">
					<HomeBanner />
					<PageSearchBar ref={ref}/>
					<TopVendorsDisplay />
					<ProductShowcaseRow title="Most Popular Items" />
					<ProductShowcaseRow title="Digital Products" searchable />
					<ProductShowcaseRow title="Services" searchable/>
					<NewsStand />
				</div>
				<MainFooter />
			</main>
		</div>
	)
}
