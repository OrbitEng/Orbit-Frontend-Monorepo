import { FC, useState, Fragment } from 'react'
import { Combobox, Transition } from '@headlessui/react'
import { SearchIcon } from '@heroicons/react/outline'

export const HeaderSearchBar: FC = () => {
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
					<SearchIcon className="h-5 w-5 text-[#4A4A4A] my-auto mr-1"/>
					<Combobox.Input className="flex w-full bg-transparent text-[#4A4A4A] font-semibold" placeholder="Search in marketplace" onChange={(e) => setQuery(e.target.value)} />
				</Combobox>
			</div>
			<div className="flex flex-row ml-4 gap-3 text-sm sm:text-base">
				<button className="font-bold text-transparent bg-gradient-to-r from-[#00E3D6] to-[#C000AD] bg-clip-text">Referral</button>
				<button className="font-bold text-[#606060]">Explore</button>
				<button className="font-bold text-[#606060]">Profile</button>
			</div>
		</div>
	)
}

// Search bar that lives on the body of the page
// used for mobile since small header
export const PageSearchBar: FC = () => {
	return(
		<div>
			coming soon
		</div>
	)
}