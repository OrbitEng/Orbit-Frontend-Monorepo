import { FC } from 'react'
import { ShoppingCartIcon } from '@heroicons/react/outline'

export const CartHeaderButton: FC = () => {
	return(
		<div className="rounded-full bg-transparent border-[#1A1A23] border-2 text-white align-middle flex my-auto p-2">
			<ShoppingCartIcon className="w-3 h-3 sm:w-4 sm:h-4" />
		</div>
	)
}