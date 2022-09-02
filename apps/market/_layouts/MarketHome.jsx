import { HomeBanner } from '@includes/CardCarousel'
import { PageSearchBar } from '@includes/components/SearchBar'
import { HomeProductExplorer } from '@includes/HomeProductExplorer'
import { HomeHeader } from '@includes/MarketHeader'
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
					<HomeProductExplorer />
				</div>
			</main>
		</div>
	)
}
