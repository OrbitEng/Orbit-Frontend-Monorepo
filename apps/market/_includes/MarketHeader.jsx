import Image from 'next/image'

import OrbitLogo from '../public/OrbitLogo.png'

import { HeaderSearchBar } from '@includes/components/SearchBar'
import { ShoppingCartIcon } from '@heroicons/react/outline'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'

export function HomeHeader(props) {
	return(
		<header className="top-0 w-full h-14 sm:h-20 sticky flex">
			<div className="bg-gradient-to-r from-homeheadergray to-homeheaderpurple w-full h-full flex flex-row justify-around border-[#1A1A23] border-b-2 align-middle">
				<div className="relative basis-1/4 py-auto align-middle content-center my-2 sm:my-5 ml-2">
					<Image
						src={OrbitLogo}
						layout="fill"
						alt="The Name and Logo for the Orbit market"
						objectFit="contain"
						priority={true}
					/>
				</div>
				<div className="flex basis-1/2 align-middle content-center my-auto">
					<HeaderSearchBar />
				</div>
				<div className="flex flex-row basis-1/4 align-middle my-auto justify-center gap-4">
					<div className="border-2 border-[#1A1A23] rounded-full p-0">
						<WalletMultiButton />
					</div>
					<button className="rounded-full bg-transparent border-[#1A1A23] border-2 text-white align-middle flex my-auto p-2">
						<ShoppingCartIcon className="w-3 h-3 sm:w-4 sm:h-4" />
					</button>
				</div>
			</div>
		</header>
	)
}
