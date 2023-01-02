import { useState, Fragment } from "react";
import { EmptyProductDisplayCardHome, ProductDisplayCardHome } from "@includes/components/cards/ProductDisplayCards";
import { useEffect } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon } from "@heroicons/react/24/solid";
import DoubleRangeInput from "../inputs/DoubleRangeInput";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

const sortMethods = [
	{ key: 1, name: "Recent", value: "recent"},
	{ key: 2, name: "Price Low", value: "plow"},
	{ key: 3, name: "Price High", value: "phigh"},
];

const MIN = 0;
const MAX = 999999;
const STEP = 1;
const RTL = false;

/* this is the explore component that sits anywhere but profile page */
export function LargeProductExplorer(props) {
	const [sortMethod, setSortMethod] = useState(sortMethods[0]);
	const [prodsToDisplay, setProdsToDisplay] = useState(Array(16).fill(<EmptyProductDisplayCardHome/>));
	const [listingsExplorerCategory, setListingsExplorerCategory] = useState("all");
	const [rangePrice, setRangePrice] = useState([0,999999]); 

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
				<div className="flex flex-row justify-between w-fit border-[1px] border-[#1A191C] rounded-full bg-transparent py-2 px-3 text-[#808080] text-xs sm:gap-x-5 gap-x-2">
					<button
						className={(listingsExplorerCategory != "all" || "bg-[#2C2F36] text-white") + " rounded-full py-1 px-4 my-auto align-middle"}
						onClick={() => setListingsExplorerCategory("all")}
					>
						All
					</button>
					<button
						className={(listingsExplorerCategory != "local" || "bg-[#2C2F36] text-white") + " rounded-full py-1 px-2 my-auto align-middle"}
						onClick={() => setListingsExplorerCategory("local")}
					>
						Local
					</button>
					<button
						className={(listingsExplorerCategory != "physical" || "bg-[#2C2F36] text-white") + " rounded-full py-1 px-2 my-auto align-middle"}
						onClick={() => setListingsExplorerCategory("physical")}
					>
						Shipped
					</button>
					<button
						className={(listingsExplorerCategory != "digital" || "bg-[#2C2F36] text-white") + " rounded-full py-1 px-2 my-auto align-middle"}
						onClick={() => setListingsExplorerCategory("digital")}
					>
						Digital
					</button>
					<button
						className={(listingsExplorerCategory != "commissions" || "bg-[#2C2F36] text-white") + " rounded-full py-1 px-2 my-auto align-middle"}
						onClick={() => setListingsExplorerCategory("commissions")}
					>
						Jobs
					</button>
				</div>
				<div className="hidden sm:flex flex-row gap-x-8 sm:w-72 md:w-96 flex-nowrap overflow-visible ml-8">
					<DoubleRangeInput values={[rangePrice, setRangePrice]}/>	
					<Listbox value={sortMethod} onChange={setSortMethod}>
						<Listbox.Button className="flex flex-row text-white text-sm bg-[rgba(50,50,50,0.54)] rounded-lg px-5 py-3 align-middle my-auto gap-x-2 mx-auto">
							<span className="my-auto truncate">{sortMethod.name}</span>
							<ChevronDownIcon className="h-4 w-4 my-auto" />
						</Listbox.Button>
						<Transition
							as={Fragment}
							leave="transition ease-in duration-100"
							leaveFrom="opacity-100"
							leaveTo="opacity-0"
						>
							<Listbox.Options className="absolute right-0 mt-10 overflow-auto py-1 max-h-96 w-fit bg-[#161326BD] backdrop-blur backdrop-filter rounded-lg">
								{sortMethods.map((method) => (
									<Listbox.Option
										key={method.key}
										value={method}
										className={({ active }) => `relative cursor-default select-none py-2 pl-10 pr-4 ${
											active ? 'bg-[#504561]' : 'bg-transparent'
										}`}
									>
										{({ active, selected }) => (
											<>
												<span className={`block truncate ${active ? 'text-[#D9D9D9]' : 'text-[#878787]'}`}>{method.name}</span>
												{(selected || (method == sortMethod)) ? (
													<span className={`absolute inset-y-0 left-0 flex items-center pl-3 ${active ? 'text-[#D9D9D9]' : 'text-[#878787]'}`}>
														<CheckIcon className="h-4 w-4" />
													</span>
												) 
												: null}
											</>
										)}
									</Listbox.Option>
								))}
							</Listbox.Options>
						</Transition>
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

/* this is the explore component that sits on the profile page */
export function ProfileProductExplore(props) {
	return(null)
}