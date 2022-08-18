import { HomeBanner } from '@includes/CardCarousel'
import { HomeHeader } from '@includes/MarketHeader'
import Head from 'next/head'
import { FC } from 'react'

export const Home: FC = ({}) => {
	return(
		<div className="bg-[#070513] w-full min-h-screen">
			<Head>
				<title>Market Home</title>
				<link rel="icon" href="favicon.ico" />
			</Head>
			<main className="">
				<HomeHeader/>
			</main>
		</div>
	)
}
