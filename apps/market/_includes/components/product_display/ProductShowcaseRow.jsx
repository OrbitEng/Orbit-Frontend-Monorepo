import { useEffect, useState } from "react";
import { Combobox } from "@headlessui/react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { 
	ProductDisplayCardHome,
	EmptyProductDisplayCardHome
} from "@includes/components/cards/ProductDisplayCards";

import Link from "next/link";

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

export function ProductShowcaseRow(props) {
	const [ query, setQuery ] = useState();
	const [ selected, setSelected ] = useState();
	const undefProdsArr = Array.of(1,2,3,4);

	const [flagColor, setFlagColor] = useState(`#FFFFFF`);

	useEffect(() => {
		console.log(props?.prod_type)
		switch(props?.prod_type) {
			case "local":
				setFlagColor(`bg-[#04DE71]`);
				break;
			case "commission":
				setFlagColor(`bg-[#875EFF]`);
				break;
			case "digital":
				setFlagColor(`bg-[#BF04DE]`);
				break;
			case "physical":
				setFlagColor(`bg-[#00A3FF]`);
				break;
		}
		console.log(flagColor)
	}, [props?.prod_type]);

	return(
		<div className="flex flex-col my-14 overflow-visible mx-3">
			<div className="flex flex-row justify-between align-middle mb-3">
				<div className="flex flex-row gap-x-4">
					<span className="relative h-3 w-3 my-auto">
						<span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${flagColor}`} />
						<span className={`absolute inline-flex h-full w-full rounded-full ${flagColor}`} />
					</span>
					<h1 className="flex text-2xl text-white align-middle my-auto">{props.title}</h1>
				</div>
				<div className="flex flex-row gap-2 justify-end">
					{ 
						props.searchable && ( 
								<div className="flex gap-1 flex-row rounded-full bg-searchbartransparent border-[1px] border-[#474747] w-96 mx-auto h-[34px] align-middle px-2 my-auto">
									<Combobox value={selected} onChange={setSelected} >
										<MagnifyingGlassIcon className="h-5 w-5 text-[#4A4A4A] my-auto"/>
										<Combobox.Input
										className="flex w-full bg-transparent text-[#888888] placeholder:text-[#4A4A4A] font-medium text-sm focus:outline-none"
										placeholder={props.search_placeholder}
										onChange={(e) => setQuery(e.target.value)} />
									</Combobox>
								</div>
						) 
					}
					<Link href={`/explore/${props.prod_type}`}>
						<button className="rounded-full bg-transparent text-[#727272] border-[1px] border-[#727272] align-middle my-auto px-3 h-[34px] text-sm">
							Explore All
						</button>
					</Link>
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
					(props.addresses && props.addresses.length) ?
						props.addresses.map((addr, index) => {
							return (
								<ProductDisplayCardHome 
									address={addr} // address of prod listing
									type = {props.prod_type}
									key = {index}
								/>
							)
						})
						:
						undefProdsArr.map((undef, ki) => {
							return <EmptyProductDisplayCardHome key={ki}/>
						})
				}
			</Carousel>
			</div>
	)
}