import Carousel from "react-multi-carousel"
import Image from 'next/image'
import { ChevronUpIcon } from "@heroicons/react/24/outline";
import { prototype } from "events";
import { useState } from "react";
import { Transition } from "@headlessui/react";

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

export function ProductDisplay(props) {
	const [ descriptionOpen, setDescriptionOpen ] = useState(false);

	return(
		<div className="flex flex-row w-[90%] mx-auto mt-6 mb-20 h-[80vh] gap-8">
			<div className="bg-white rounded-3xl bg-opacity-5 h-full w-full content-center align-middle p-10">
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
					<div>bruh</div>		
					<div>bruh</div>		
					<div>bruh</div>		
					<div>bruh</div>		
				</Carousel>
			</div>
			<div className={"bg-white rounded-3xl bg-opacity-5 h-full w-full p-10 flex flex-col gap-y-5 text-ellipsis" + (descriptionOpen ? " overflow-scroll" : " overflow-hidden")}>
				<div className="flex w-56 items-center content-center rounded-full shadow-lg bg-gradient-to-r from-[#222222] to-selleridproductpagetrans">
					<div className="flex content-start rounded-full mx-2 py-1 pr-4 gap-2">
						<Image 
							className="rounded-full"
							alt="market profile picture"
							layout="fixed"
							src={props.sellerImg || "https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50?d=mp&f=y"}
							height={48}
							width={64}
						/>
						<div className="flex flex-col w-5/6 mx-auto align-middle my-auto">
							<span className="flex text-gray-100 leading-none font-bold">{props.seller?.sellerName || "NULL"}</span>
							<span className="flex text-gray-300 text-sm">{props.seller?.sellerAddr?.slice(0,10) + "..."}</span>
						</div>
					</div>
				</div>	
				<div className="flex flex-col mt-10 gap-y-2" >
					<h1 className="font-bold text-4xl text-white ml-3">{props.itemName || "NULL PRODUCT" }</h1>
					<div className="flex flex-row gap-3">
						<div className="rounded-full font-bold bg-[#261832] text-[#72478C] px-3 py-2">
							{"availability " + (props.stock?.toString() || "∞") }
						</div>
						<div className="rounded-full font-bold bg-[#311132] text-[#7D348F] px-3 py-2">
							{props.type ? (props.type?.charAt(0)?.toUpperCase() + "" +props.type?.slice(1)) : "Custom Product Type"}
						</div>
					</div>
					<div className="font-semibold align-top ml-3">
						<span className="text-white text-lg align-top mr-2">Price:{' '}</span>
						<span className="text-[#5a5a5a] text-4xl align-top">{(props.price || "Custom")}</span>
					</div>
				</div>
				<div className="flex flex-row w-full justify-center mt-6">
					{
						props.type === "service" ? (
							<div className="flex flex-row justify-center">
								<button className="font-semibold p-3 text-white bg-gradient-to-t from-[#000] to-[#0F1025] rounded-full drop-shadow text-lg border-2 border-[#2C2C4A]">✉️ Request</button>
							</div> 
						) : (
							<div className="flex flex-row gap-x-4">
								<button className="font-semibold p-3 text-white bg-gradient-to-t from-[#000] to-[#0F1025] rounded-full drop-shadow text-lg border-2 border-[#2C2C4A]">🛒 Add to Cart</button>
								<button className="font-semibold p-3 text-white bg-gradient-to-t from-[#000] to-[#0F1025] rounded-full drop-shadow text-lg border-2 border-[#2C2C4A]">⚡ Quick Buy</button>
							</div>
						) 
					}
				</div>
				<div className="flex flex-col bg-[#484848] bg-opacity-10 rounded-3xl p-10 w-full bottom-0">
					<button
						className="text-xl text-white font-bold flex flex-row border-b-[1px] border-[#636363] w-full"
						onClick={() => {setDescriptionOpen(!descriptionOpen)}}
					>
						Description
						<ChevronUpIcon className={"h-4 w-4 my-auto ml-auto justify-self-end stroke-[2px] transition translate" + (descriptionOpen ? " rotate-180" : " rotate-0") } />
					</button>
					<p className="text-[#838383] whitespace-pre-line">
						{
							// this is super scuffed
							descriptionOpen ? props.description : props.description.slice(0,218) + "..." 
						}
					</p>
				</div>
			</div>
		</div>
	)
}