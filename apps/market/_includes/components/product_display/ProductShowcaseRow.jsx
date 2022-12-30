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
	  breakpoint: { max: 3000, min: 768 },
	  items: 4,
	  slidesToSlide: 1
	},
	tablet: {
	  breakpoint: { max: 768, min: 640 },
	  items: 3,
	  slidesToSlide: 1
	},
	mobile: {
	  breakpoint: { max: 640, min: 0 },
	  items: 2,
	  slidesToSlide: 1
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
		<div className="flex flex-col my-14 overflow-hidden">
			<div className="flex flex-row justify-between align-middle mb-3 mx-3">
				<div className="flex flex-row sm:gap-x-4 gap-x-3">
					<span className="relative sm:h-3 sm:w-3 h-2 w-2 my-auto">
						<span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${flagColor}`} />
						<span className={`absolute inline-flex h-full w-full rounded-full ${flagColor}`} />
					</span>
					<h1 className="flex sm:text-2xl text-xl text-white align-middle my-auto">{props.title}</h1>
				</div>
				<div className="flex flex-row gap-2 justify-end">
					{ 
						props.searchable && ( 
								<div className="hidden md:flex gap-1 flex-row rounded-full bg-searchbartransparent border-[1px] border-[#474747] w-96 mx-auto h-[34px] align-middle px-2 my-auto">
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
						<button className="rounded-full bg-transparent text-[#727272] border-[1px] border-[#727272] align-middle my-auto sm:px-3 sm:h-[34px] px-2 h-7 sm:text-sm text-xs">
							Explore All
						</button>
					</Link>
				</div>
			</div>
			<div className="w-[35rem] sm:w-[55rem] md:w-[72rem] ml-3 sm:mx-0 -mt-3">
				<Carousel 
					responsive={responsive} 
					arrows={true}
					swipeable={true}
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
					itemClass="mx-auto"
				>
					{
						(props.addresses && props.addresses.length) ?
							props.addresses.map((addr, index) => {
								return (
									<ProductDisplayCardHome 
										address={addr} // address of prod listing
										type={props.prod_type}
										key={index}
									/>
								)
							})
							:
							undefProdsArr.map((undef, ki) => {
								return ( 
									<ProductDisplayCardHome 
										address={"1111111111111111"} // address of prod listing
										type={props.prod_type}
										key={ki}
									/>
								)
							})
					}
				</Carousel>
			</div>
		</div>
	)
}