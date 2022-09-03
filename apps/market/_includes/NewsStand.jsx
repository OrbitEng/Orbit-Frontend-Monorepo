import { useState } from "react";
import { Combobox } from "@headlessui/react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

// this is just a temp placeholder
// we want to get the NewsCards here instead
import { ProductDisplayCardHome } from "@includes/components/ProductDisplayCards";

import Carousel from "react-multi-carousel";
import 'react-multi-carousel/lib/styles.css'

const responsive = {
	desktop: {
	  breakpoint: { max: 3000, min: 1024 },
	  items: 4,
	  slidesToSlide: 4
	},
	tablet: {
	  breakpoint: { max: 1024, min: 464 },
	  items: 3,
	  slidesToSlide: 3
	},
	mobile: {
	  breakpoint: { max: 464, min: 0 },
	  items: 2,
	  slidesToSlide: 2
	}
};

export default function NewsStand(props) {
	const [ query, setQuery ] = useState()
	const [ selected, setSelected] = useState()

	return(
		<div className="flex flex-col my-28">
			<div className="flex flex-col justify-start align-middle mb-8">
				<h1 className="text-4xl text-white font-bold align-middle">News and Blogs</h1>
				<p className="font-bold text-[#797979]">Learn and discover more about OrbitLabs</p>
			</div>
				<Carousel 
					responsive={responsive} 
					arrows={false}
					swipeable={false}
					draggable={true}
					showDots={false}
					infinite={false}
					autoPlay={props.deviceType !== "mobile" ? true : false}
					autoPlaySpeed={1000}
					keyBoardControl={true}
					transitionDuration={500}
					removeArrowOnDeviceType={["tablet", "mobile"]}
					deviceType={"desktop"}
					dotListClass="custom-dot-list-style"
					itemClass="carousel-item-padding-40px"
				>
					<ProductDisplayCardHome />
					<ProductDisplayCardHome />
					<ProductDisplayCardHome />
					<ProductDisplayCardHome />
					<ProductDisplayCardHome />
					<ProductDisplayCardHome />
					<ProductDisplayCardHome />
				</Carousel>
		</div>
	)
}