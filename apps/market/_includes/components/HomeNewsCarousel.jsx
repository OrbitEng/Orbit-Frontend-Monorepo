import React from 'react';
import 'react-responsive-carousel/lib/styles/carousel.min.css'; 
import { Carousel } from 'react-responsive-carousel';
import Image from 'next/image';
import Link from 'next/link';
import bannerImage from 'public/Cards/Banner.png';

export default function HomeNewsCarousel(props) {
	return(
		<div className="h-[24rem] w-screen sm:mt-32 mt-[7.5rem]">
			<Carousel
				showThumbs={false}
				showStatus={false}
			>
				<div className="flex h-[24rem] w-screen">
					<div className="flex flex-col mx-auto my-auto bg-transparent z-40">
						<span className="font-bold mb-2 sm:text-5xl text-3xl text-white whitespace-nowrap truncate">Explore Now</span>
						<span className="font-medium sm:text-lg text-md text-[#4A4A4A] max-w-sm leading-tight mb-3">Explore all Orbit listings  Local, Shipping, Jobs, and Digital Products</span>
						<Link href="/Explore">
							<button className="bg-[#24222B] rounded-lg px-4 py-2 mx-auto text-white font-bold sm:text-xl text-sm">Explore All</button>
						</Link>
					</div>
					<Image
						priority={true}
						loading='eager'
						src={bannerImage}
						layout="fill"
						objectFit="cover"
					/>
				</div>
			</Carousel>
		</div>
	)
}