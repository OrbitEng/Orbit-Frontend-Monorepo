import { FC, useState, Fragment } from 'react';
import { Combobox, Transition } from '@headlessui/react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

export function HeaderSearchBar() {
	const [ selected, setSelected ] = useState({})
	const [ query, setQuery ] = useState({})

	return(
		<div className="flex flex-row rounded-lg bg-transparent p-auto w-full mx-auto py-auto align-middle justify-end">
			<div className="hidden sm:flex flex-row rounded-lg bg-transparent border-2 border-[#1A1A23] p-auto w-full mx-auto py-auto align-middle">
				<Combobox value={selected} onChange={setSelected} >
					<div className="bg-transparent mr-1 h-full flex">
						<select className="bg-[#1A1A23] text-white h-full py-2 font-bold" defaultValue={"All"}>
							<option value="all">All</option>
							<option value="digital">Digital</option>
							<option value="physical">Physical</option>
						</select>
					</div>
					<MagnifyingGlassIcon className="h-5 w-5 text-[#4A4A4A] my-auto mr-1"/>
					<Combobox.Input
					className="flex w-full bg-transparent text-[#4A4A4A] font-semibold"
					placeholder="Search in marketplace"
					onChange={(e) => setQuery(e.target.value)} />
				</Combobox>
			</div>
			<div className="flex flex-row ml-4 gap-3 text-xs sm:text-base">
				<button className="font-bold transition-all text-transparent bg-clip-text bg-gradient-to-r from-[#00E3D6] to-[#C000AD]">Referral</button>
				<button className="font-bold text-[#606060]">Explore</button>
				<button className="font-bold text-[#606060]">Profile</button>
			</div>
		</div>
	)
}

// Search bar that lives on the body of the page
// used for mobile since small header
export function PageSearchBar() {
	const [ selected, setSelected ] = useState({})
	const [ query, setQuery ] = useState({})

	return(
		<div className="flex flex-col rounded-lg p-auto w-fill mx-10 mt-28 py-auto align-middle justify-center">
			<div className="flex gap-3 flex-row rounded-full bg-searchbartransparent border-2 border-[#474747] p-4 w-full mx-auto py-auto align-middle">
				<Combobox value={selected} onChange={setSelected} >
					<MagnifyingGlassIcon className="h-6 w-6 text-[#4A4A4A] my-auto stroke-[2px]"/>
					<Combobox.Input
					className="flex w-full bg-transparent text-[#888888] placeholder:text-[#4A4A4A] text-2xl font-semibold focus:outline-none"
					placeholder="Search in marketplace"
					onChange={(e) => setQuery(e.target.value)} />
				</Combobox>
			</div>
			<div className="flex flex-row ml-4 gap-x-3 justify-center text-xs sm:text-base mt-4">
				<button className="font-bold rounded-full p-2 text-lg text-[#7A7A7A] bg-gradient-to-bl from-[#181424] via-searchbuttontrans to-searchbuttontrans2 ">🔮 Services</button>
				<button className="font-bold rounded-full p-2 text-lg text-[#7A7A7A] bg-gradient-to-bl from-[#181424] via-searchbuttontrans to-searchbuttontrans2 ">👾 Digital Products</button>
				<button className="font-bold rounded-full p-2 text-lg text-[#7A7A7A] bg-gradient-to-bl from-[#181424] via-searchbuttontrans to-searchbuttontrans2 ">📦 Physical Products</button>
				<button className="font-bold rounded-full p-2 text-lg text-[#7A7A7A] bg-gradient-to-bl from-[#181424] via-searchbuttontrans to-searchbuttontrans2 ">🎨 NFTs</button>
			</div>
		</div>
	)
}