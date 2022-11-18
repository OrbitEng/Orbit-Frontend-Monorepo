import { useEffect, useState } from "react";
import { Combobox } from "@headlessui/react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { 
	ProductDisplayCardHome,
	EmptyProductDisplayCardHome
} from "@includes/components/cards/ProductDisplayCards";

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
		<div className="flex flex-col my-14">
			<div className="flex flex-row justify-between align-middle mb-3">
				<div className="flex flex-row gap-x-4">
					<span className={`${flagColor} w-[5px] rounded-full`} />
					<h1 className="flex text-3xl text-white align-middle my-auto">{"Find " + props.title}</h1>
				</div>
				<div className="flex flex-row gap-2 justify-end">
					{ 
						props.searchable && ( 
								<div className="flex gap-1 flex-row rounded-full bg-searchbartransparent border-[0.5px] border-[#474747] w-96 mx-auto h-10 align-middle px-2">
									<Combobox value={selected} onChange={setSelected} >
										<MagnifyingGlassIcon className="h-5 w-5 text-[#4A4A4A] my-auto"/>
										<Combobox.Input
										className="flex w-full bg-transparent text-[#888888] placeholder:text-[#4A4A4A] font-semibold focus:outline-none"
										placeholder="Search in Marketplace"
										onChange={(e) => setQuery(e.target.value)} />
									</Combobox>
								</div>
						) 
					}
					<button className="rounded-[13px] bg-gradient-to-tr from-[#1F1E28] to-[#1E1B26] text-[#7E7E7E] align-middle flex my-auto py-2 px-4">
						Explore All
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
							return <ProductDisplayCardHome key={ki} type={props.prod_type}/>
						})
				}
			</Carousel>
			</div>
	)
}