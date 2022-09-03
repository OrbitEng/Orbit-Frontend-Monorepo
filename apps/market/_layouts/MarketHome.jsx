import { HomeBanner } from '@includes/CardCarousel'
import { ProductDisplayCard } from '@includes/components/ProductDisplayCards'
import { PageSearchBar } from '@includes/components/SearchBar'
import { HomeProductExplorer } from '@includes/HomeProductExplorer'
import { HomeHeader } from '@includes/MarketHeader'
import ProductShowcaseRow from '@includes/ProductShowcaseRow'
import TopVendorsDisplay from '@includes/TopVendorsDisplay'
import NewsStand from '@includes/NewsStand'
import Head from 'next/head'

export function Home(props) {
	return(
		<div className="w-full min-h-screen bg-transparent">
			<Head>
				<title>Market Home</title>
				<link rel="icon" href="favicon.ico" />
			</Head>
			<main className="bg-[url('/bgWallpaper.png')] bg-cover">
				<HomeHeader/>
				<div className="max-w-5xl align-center mx-auto">
					<HomeBanner />
					<PageSearchBar />
					<TopVendorsDisplay />
					<ProductShowcaseRow title="Most Popular Items" />
					<ProductShowcaseRow title="Digital Products" searchable />
					<ProductShowcaseRow title="Services" searchable/>
					<NewsStand />
				</div>
			</main>
		</div>
	)
}
