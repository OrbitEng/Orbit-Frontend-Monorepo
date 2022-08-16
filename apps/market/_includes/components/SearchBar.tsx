import { FC } from 'react'
import { SearchIcon } from '@heroicons/react/outline'

export const HeaderSearchBar: FC = () => {
	return(
		<div className="hidden sm:flex flex-row rounded-lg bg-transparent border-2 border-[#1A1A23] p-auto w-full m-auto">
			<SearchIcon className="h-5 w-5 text-[#4A4A4A]" />
			
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