import Image from "next/image";
import { useState } from "react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { EmptyProductDisplayCardHome, ProductDisplayCardHome } from "@includes/components/cards/ProductDisplayCards";
import { useEffect } from "react";
import { Listbox } from "@headlessui/react";

export function LargeProductExplorer(props) {
	const [sortMethod, setSortMethod] = useState("recent");

	const [prodsToDisplay, setProdsToDisplay] = useState(Array(16).fill(<EmptyProductDisplayCardHome/>));

	const [listingsExplorerCategory, setListingsExplorerCategory] = useState();
	const [displayOption, setDisplayOption] = props.displayOption;

	useEffect(()=>{
		if(!(props.items && props.category)) return;
		let a = props.items.map((elem)=>(
			<div>
				<ProductDisplayCardHome
					address = {elem.address}
					type = {props.category}
					key = {elem.address}
				/>
			</div>
		));
		setProdsToDisplay(a.length < 16 ? a.concat(Array(16-props.items.length).fill(<EmptyProductDisplayCardHome/>)) : a)
	}, [props.items, props.category])

	return(
		<div className="flex flex-col mx-auto w-full mt-6">
			<div className="flex flex-row justify-between">
				<div className="flex flex-row justify-between w-fit rounded-xl bg-[#12171D] p-1 font-bold text-white text-sm">
					<button
						className={(sortMethod != "recent" || "bg-[#2C2F36]") + " rounded-full py-1 px-2"}
						onClick={() => setSortMethod("recent")}
					>
						Recent
					</button>
					<button
						className={(sortMethod != "high" || "bg-[#2C2F36]") + " rounded-full py-1 px-2"}
						onClick={() => setSortMethod("high")}
					>
						Price High
					</button>
					<button
						className={(sortMethod != "low" || "bg-[#2C2F36]") + " rounded-full py-1 px-2"}
						onClick={() => setSortMethod("low")}
					>
						Price Low
					</button>
				</div>
				<div className="flex flex-row gap-x-2">
					<Listbox value={displayOption} onChange={setDisplayOption}>
						<Listbox.Button className="relative flex flex-row gap-x-2 align-middle py-1 px-3 bg-[#13171D] rounded-full">
							<span className="my-auto text-white font-semibold text-sm ">{displayOption}</span>
							<ChevronDownIcon className="h-3 w-3 text-white my-auto stroke-2"/>
							<Listbox.Options className="flex flex-col text-center absolute transition bg-[#13171D] z-50 rounded-xl py-1 -ml-3">
								{
									["Physical","Digital","Commission"].map((category, id)=>(
										<Listbox.Option
											key={id}
											value = {category}
											className={({active})=>{
												return `py-1 px-2 w-full text-sm text-white font-bold ${active? "bg-[#2c2c2c] rounded-sm" : ""}`
											}}
										>
											{category}
										</Listbox.Option>
									))
								}
							</Listbox.Options>
						</Listbox.Button>
					</Listbox>
				</div>
			</div>
			{
				(props?.items == undefined || props?.items?.length == 0) ? 
				(
					<div className="flex flex-col my-56 mx-auto text-center">
						<h2 className="text-center text-5xl font-semibold text-white my-4 mx-auto">No Listings</h2>
						<span className="text-[#5B5B5B] font-semibold text-lg mx-auto w-9/12 mb-2">No items to display. Create some listings or browse others!</span>
						<div className="flex flex-row gap-x-3 content-center mx-auto">
							<button className="text-white font-bold bg-[#13171D] border-[1px] border-[#515151] rounded-lg px-3 py-2">Create</button>
							<button className="text-white font-bold bg-[#13171D] border-[1px] border-[#515151] rounded-lg px-3 py-2">Explore</button>
						</div>
					</div>
				):(
					<div className="grid grid-flow-row grid-cols-4 mt-4 mb-28">
						{prodsToDisplay}
					</div>
				)
			}
		</div>
	)
}