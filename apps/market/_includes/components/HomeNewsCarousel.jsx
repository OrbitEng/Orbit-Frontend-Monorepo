import React from 'react';
import 'react-responsive-carousel/lib/styles/carousel.min.css'; 
import { Carousel } from 'react-responsive-carousel';
import Image from 'next/image';
import Link from 'next/link';
import bannerImage from 'public/Cards/Banner.png';

export default function HomeNewsCarousel(props) {
	return(
		<div className="h-[26rem] w-screen mt-32">
			<Carousel
				showThumbs={false}
				showStatus={false}
			>
				<div className="flex h-[26rem] w-screen">
					<div className="flex flex-col mx-auto my-auto bg-transparent z-40">
						<span className="font-bold mb-2 text-5xl text-white whitespace-nowrap truncate">Explore Now</span>
						<span className="font-medium text-lg text-[#4A4A4A] max-w-sm leading-tight mb-3">Explore all Orbit listings  Local, Shipping, Jobs, and Digital Products</span>
						<Link href="/Explore">
							<button className="bg-[#24222B] rounded-lg px-4 py-2 mx-auto text-white font-bold text-xl">Explore All</button>
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