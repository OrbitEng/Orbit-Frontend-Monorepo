import React, { FC, useState, Fragment } from 'react';
import { Combobox, Transition } from '@headlessui/react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

export function HeaderSearchBar(props) {
	const [ selected, setSelected ] = useState()
	const [ query, setQuery ] = useState()

	return(
		<div className="flex flex-col px-12 lg:px-36 my-auto py-auto align-middle justify-center w-full overflow-visible">
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
				<div className="bg-black absolute -inset-2 rounded-lg blur-2xl" />
				<div className="relative flex gap-3 flex-row rounded-full bg-searchbartransparent border-2 border-[#333333] p-1 w-full mx-auto py-auto align-middle">
					<Combobox value={selected} onChange={setSelected} >
						<MagnifyingGlassIcon className="h-6 w-6 text-[#4A4A4A] my-auto stroke-[2px] ml-2"/>
						<Combobox.Input
						className="flex w-full bg-transparent text-[#777777] placeholder:text-[#4A4A4A] text-lg font-semibold focus:outline-none"
						placeholder="Search in marketplace"
						onChange={(e) => setQuery(e.target.value)} />
					</Combobox>
				</div>
				<div className="relative flex flex-row ml-4 gap-x-3 justify-center text-xs sm:text-base mt-2">
					<button className="font-bold rounded-full p-1 text-xs text-[#7A7A7A] bg-gradient-to-bl from-[#181424] via-searchbuttontrans to-searchbuttontrans2 transition hover:scale-[104%] duration-200 ease-in-out">🔮 Commissions</button>
					<button className="font-bold rounded-full p-1 text-xs text-[#7A7A7A] bg-gradient-to-bl from-[#181424] via-searchbuttontrans to-searchbuttontrans2 transition hover:scale-[104%] duration-200 ease-in-out">👾 Digital Products</button>
					<button className="font-bold rounded-full p-1 text-xs text-[#7A7A7A] bg-gradient-to-bl from-[#181424] via-searchbuttontrans to-searchbuttontrans2 transition hover:scale-[104%] duration-200 ease-in-out">📦 Physical Products</button>
					<button className="font-bold rounded-full p-1 text-xs text-[#7A7A7A] bg-gradient-to-bl from-[#181424] via-searchbuttontrans to-searchbuttontrans2 transition hover:scale-[104%] duration-200 ease-in-out">🎨 NFTs</button>
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
		<div ref={ref} className="flex flex-col rounded-lg p-auto w-fill mt-28 py-auto align-middle justify-center max-w-4xl mx-auto">
			<div className="flex gap-3 flex-row rounded-full bg-searchbartransparent border-2 border-[#222222] p-2 w-full mx-auto py-auto align-middle">
				<Combobox value={selected} onChange={setSelected} >
					<MagnifyingGlassIcon className="h-6 w-6 text-[#4A4A4A] my-auto stroke-[2px]"/>
					<Combobox.Input
					className="flex w-full bg-transparent text-[#777777] placeholder:text-[#4A4A4A] text-2xl font-semibold focus:outline-none"
					placeholder="Search in marketplace"
					onChange={(e) => setQuery(e.target.value)} />
				</Combobox>
			</div>
			<div className="flex flex-row ml-4 gap-x-3 justify-center text-xs sm:text-base mt-4">
				<button className="font-semibold rounded-full p-2 text-[#7A7A7A] bg-gradient-to-bl from-[#181424] via-searchbuttontrans to-searchbuttontrans2 transition duration-200 border-0 hover:scale-[104%]">🔮 Commissions</button>
				<button className="font-semibold rounded-full p-2 text-[#7A7A7A] bg-gradient-to-bl from-[#181424] via-searchbuttontrans to-searchbuttontrans2 transition duration-200 border-0 hover:scale-[104%]">👾 Digital Products</button>
				<button className="font-semibold rounded-full p-2 text-[#7A7A7A] bg-gradient-to-bl from-[#181424] via-searchbuttontrans to-searchbuttontrans2 transition duration-200 border-0 hover:scale-[104%]">📦 Physical Products</button>
				<button className="font-semibold rounded-full p-2 text-[#7A7A7A] bg-gradient-to-bl from-[#181424] via-searchbuttontrans to-searchbuttontrans2 transition duration-200 border-0 hover:scale-[104%]">🎨 NFTs</button>
			</div>
		</div>
	)
})