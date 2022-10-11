import Image from "next/image";
import { useState } from "react";
import ProductShowcaseRow from "@includes/ProductShowcaseRow";
import { ChevronDownIcon, PaperAirplaneIcon } from "@heroicons/react/24/outline";
import { EmptyProductDisplayCardHome, ProductDisplayCardHome } from "./components/ProductDisplayCards";
import { ProductDisplay } from "./ProductPageDisplay";

export function LargeExplore(props) {
	const [sortMethod, setSortMethod] = useState("recent");

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
					<button className="p-2 bg-[#13171D] rounded-lg">
						<PaperAirplaneIcon className="h-5 w-5 text-white"/>
					</button>
					<button className="flex flex-row gap-x-2 align-middle py-1 px-3 bg-[#13171D] rounded-full" disabled>
						<span className="my-auto text-white font-semibold text-sm ">Filter View...</span>
						<ChevronDownIcon className="h-3 w-3 text-white my-auto stroke-2"/>
					</button>
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
						<EmptyProductDisplayCardHome />
						<EmptyProductDisplayCardHome />
						<EmptyProductDisplayCardHome />
						<EmptyProductDisplayCardHome />
						<EmptyProductDisplayCardHome />
						<EmptyProductDisplayCardHome />
						<EmptyProductDisplayCardHome />
						<EmptyProductDisplayCardHome />
						<EmptyProductDisplayCardHome />
						<EmptyProductDisplayCardHome />
						<EmptyProductDisplayCardHome />
						<EmptyProductDisplayCardHome />
						<EmptyProductDisplayCardHome />
						<EmptyProductDisplayCardHome />
						<EmptyProductDisplayCardHome />
						<EmptyProductDisplayCardHome />
					</div>
				)
			}
		</div>
	)
}