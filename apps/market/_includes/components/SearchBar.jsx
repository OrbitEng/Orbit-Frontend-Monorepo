import React, { useState, Fragment } from 'react';
import { Combobox, Listbox, Transition } from '@headlessui/react';
import { CheckIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

const searchCategories = [
	{ key: 1, name: "All", value: "all"},
	{ key: 2, name: "Local", value: "local"},
	{ key: 3, name: "Shipped", value: "shipped"},
	{ key: 4, name: "Digital", value: "digital"}
]

export function HeaderSearchBar(props) {
	const [ selected, setSelected ] = useState();
	const [ query, setQuery ] = useState();
	const [ selectedProductSearchCat, setSelectedProductSearchCat ] = useState(searchCategories[0]);

	return(
		<div className="flex flex-col my-auto align-middle justify-center overflow-visible w-full z-[120]">
			<Transition
				show={true}
				appear={true}
				enter="transition duration-700 ease-in-out"
				enterFrom="opacity-0 scale-75"
				enterTo="opacity-100 scale-100"
				leave="transition-opacity duration-500"
				leaveFrom="opacity-100"
				leaveTo="opacity-0"
			>
				<div className="relative flex gap-3 flex-row rounded-lg bg-[#0F0D14] border-[1px] border-[#202020] p-1 w-full max-w-2xl mx-auto align-middle">
					<Combobox value={selected} onChange={setSelected} >
						<MagnifyingGlassIcon className="h-5 w-5 text-[#393939] my-auto stroke-[1px] ml-2"/>
						<Combobox.Input
							className="flex w-full bg-transparent text-[#777777] placeholder:text-[#393939] sm:text-lg text-md font-normal focus:outline-none"
							placeholder="Find everything on Orbit"
							onChange={(e) => setQuery(e.target.value)}
						/>
					</Combobox>
					<Listbox value={selectedProductSearchCat} onChange={setSelectedProductSearchCat}>
						<Listbox.Button className="text-[#878787] border-l-[1px] border-[#424242] px-4 h-6 align-middle my-auto">
							{selectedProductSearchCat.name}
						</Listbox.Button>
						<Transition
							as={Fragment}
							leave="transition ease-in duration-100"
							leaveFrom="opacity-100"
							leaveTo="opacity-0"
						>
							<Listbox.Options className="absolute right-0 mt-10 overflow-auto py-1 max-h-96 w-fit bg-[#161326BD] backdrop-blur backdrop-filter rounded-lg">
								{searchCategories.map((category) => (
									<Listbox.Option
										key={category.key}
										value={category}
										className={({ active }) => `relative cursor-default select-none py-2 pl-10 pr-4 ${
											active ? 'bg-[#504561]' : 'bg-transparent'
										}`}
									>
										{({ active, selected }) => (
											<>
												<span className={`block truncate ${active ? 'text-[#D9D9D9]' : 'text-[#878787]'}`}>{category.name}</span>
												{selected ? (
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
			</Transition>
		</div>
	)
}


// Search bar that lives on the body of the page
// used for mobile since small header
export const PageSearchBar = React.forwardRef((props, ref) => {
	const [ selected, setSelected ] = useState({})
	const [ query, setQuery ] = useState({})

	return(
		<Transition
			appear={true}
			show={true}
			enter="transition transform transition-opacity transition-transform transition-all duration-[1200ms] ease-in-out delay-[600ms]"
			enterFrom="opacity-0 -translate-y-10"
			enterTo="opacity-100 -translate-y-0"
			leave="transform duration-200 transition ease-in-out"
			leaveFrom="opacity-100 rotate-0 scale-100 "
			leaveTo="opacity-0 scale-95"
		>
			<div ref={ref} className="flex flex-col rounded-lg p-auto w-fill mt-8 mb-56 py-auto align-middle justify-center max-w-4xl mx-auto">
				<div className="flex gap-3 flex-row rounded-full bg-searchbartransparent border-[1px] border-[#222222] p-2 w-full mx-auto py-auto align-middle">
					<Combobox value={selected} onChange={setSelected} >
						<MagnifyingGlassIcon className="h-6 w-6 text-[#4A4A4A] my-auto stroke-[2px]"/>
						<Combobox.Input
						className="flex w-full bg-transparent text-[#777777] placeholder:text-[#4A4A4A] text-2xl font-semibold focus:outline-none"
						placeholder="Search in marketplace"
						onChange={(e) => setQuery(e.target.value)} />
					</Combobox>
				</div>
				<div className="flex flex-row ml-4 gap-x-3 justify-center text-xs sm:text-base mt-4">
					<button className="font-semibold rounded-full p-2 text-[#7A7A7A] bg-gradient-to-bl from-[#181424] via-searchbuttontrans to-searchbuttontrans2 transition duration-200 border-0 hover:scale-[104%]">� Commissions</button>
					<button className="font-semibold rounded-full p-2 text-[#7A7A7A] bg-gradient-to-bl from-[#181424] via-searchbuttontrans to-searchbuttontrans2 transition duration-200 border-0 hover:scale-[104%]">�👾 Digital Products</button>
					<button className="font-semibold rounded-full p-2 text-[#7A7A7A] bg-gradient-to-bl from-[#181424] via-searchbuttontrans to-searchbuttontrans2 transition duration-200 border-0 hover:scale-[104%]">📦 Physical Products</button>
					<button className="font-semibold rounded-full p-2 text-[#7A7A7A] bg-gradient-to-bl from-[#181424] via-searchbuttontrans to-searchbuttontrans2 transition duration-200 border-0 hover:scale-[104%]">🎨 NFTs</button>
				</div>
			</div>
		</Transition>
	)
})