import { useState } from "react";
import { Combobox } from "@headlessui/react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { 
	ProductDisplayCardHome,
	EmptyProductDisplayCardHome
} from "@includes/components/ProductDisplayCards";

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

function renderRow(addresses) {
	console.log(addresses)
	if(addresses !== undefined || addresses?.length === 0) {
		addresses?.map((addr, index) => {
			return (
				<ProductDisplayCardHome 
					address={addr} // address of prod listing
					type = {props.prod_type}
					key = {index}
				/>
			)
		})
	} else {
		console.log("hello there")
		let undefProdsArr = Array.of(1,2,3,4);
		undefProdsArr.map(() => {
			return <EmptyProductDisplayCardHome />
		})
	}
}

export default function ProductShowcaseRow(props) {
	const [ query, setQuery ] = useState();
	const [ selected, setSelected ] = useState();

	return(
		<div className="flex flex-col my-14">
			<div className="flex flex-row justify-between align-middle mb-3">
				<h1 className="text-4xl text-white font-bold align-middle">{props.title}</h1>
				<div className="flex flex-row gap-2 justify-end">
					{ 
						props.searchable && ( 
								<div className="flex gap-1 flex-row rounded-full bg-searchbartransparent border-[1px] border-[#474747] w-56 mx-auto h-10 align-middle px-2">
									<Combobox value={selected} onChange={setSelected} >
										<MagnifyingGlassIcon className="h-5 w-5 text-[#4A4A4A] my-auto"/>
										<Combobox.Input
										className="flex w-full bg-transparent text-[#888888] placeholder:text-[#4A4A4A] font-semibold focus:outline-none"
										placeholder="Search"
										onChange={(e) => setQuery(e.target.value)} />
									</Combobox>
								</div>
						) 
					}
					<button className="rounded-full bg-gradient-to-tr from-[#181424] via-buttontransparent2 to-buttontransparent border-t-[0.5px] border-[#474747] bg-transparent text-white align-middle flex my-auto py-2 px-4">
						View All
					</button>
				</div>
			</div>
				<Carousel 
					responsive={responsive} 
					arrows={true}
					swipeable={false}
					draggable={false}
					showDots={false}
					infinite={false}
					autoPlay={false}
					autoPlaySpeed={1000}
					keyBoardControl={true}
					transitionDuration={500}
					removeArrowOnDeviceType={["tablet", "mobile"]}
					deviceType={"desktop"}
					dotListClass="custom-dot-list-style"
					itemClass="carousel-item-padding-40px"
				>
					{
						renderRow(props?.addresses)
					}
				</Carousel>
		</div>
	)
}