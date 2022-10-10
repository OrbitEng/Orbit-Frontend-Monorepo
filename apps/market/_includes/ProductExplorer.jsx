import Image from "next/image";
import { useState } from "react";
import ProductShowcaseRow from "@includes/ProductShowcaseRow";
import { ChevronDownIcon, PaperAirplaneIcon } from "@heroicons/react/24/outline";

export function LargeExplore(props) {
	const [sortMethod, setSortMethod] = useState("recent");

	return(
		<div className="flex flex-col mx-auto w-full">
			<div className="flex flex-row justify-between">
				<div className="flex flex-row w-fit rounded-xl bg-[#12171D] p-1 font-bold text-white">
					<button
						className={(sortMethod != "recent" || "bg-[#2C2F36]") + " rounded-full py-1 px-2"}
					>
						Recent
					</button>
					<button
						className={(sortMethod != "high" || "bg-[#2C2F36]") + " rounded-full py-1 px-2"}
					>
						Price High
					</button>
					<button
						className={(sortMethod != "low" || "bg-[#2C2F36]") + " rounded-full py-1 px-2"}
					>
						Price Low
					</button>
				</div>
				<div className="flex flex-row gap-x-2">
					<button className="p-2 bg-[#13171D] rounded-lg">
						<PaperAirplaneIcon className="h-5 w-5 text-white"/>
					</button>
					<button className="flex flex-row gap-x-2 align-middle py-1 px-3 bg-[#13171D] rounded-lg" disabled>
						<span className="my-auto text-white font-semibold text-lg">Filter</span>
						<ChevronDownIcon className="h-3 w-3 text-white my-auto stroke-2"/>
					</button>
				</div>
			</div>
		</div>
	)
}