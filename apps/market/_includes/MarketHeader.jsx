import Image from 'next/image'

import OrbitLogo from '../public/OrbitLogo.png'

import { WalletInteractionsButton } from '@includes/components/WalletButton'
import { HeaderSearchBar } from '@includes/components/SearchBar'
import { CartHeaderButton } from '@includes/components/CartHeaderButton'

export function HomeHeader(props) {
	return(
		<header className="top-0 w-full h-14 sm:h-20 sticky flex">
			<div className="bg-gradient-to-r from-homeheadergray to-homeheaderpurple w-full h-full flex flex-row justify-around border-[#1A1A23] border-b-2 align-middle">
				<div className="relative basis-1/4 py-auto align-middle my-2 sm:my-5 ml-2">
					<Image
						src={OrbitLogo}
						layout="fill"
						alt="The Name and Logo for the Orbit market"
						objectFit="contain"
					/>
				</div>
				<div className="flex basis-1/2 align-middle content-center my-auto">
					<HeaderSearchBar />
				</div>
				<div className="flex flex-row basis-1/4 align-middle my-auto justify-center">
					<WalletInteractionsButton />
					<CartHeaderButton />
				</div>
			</div>
		</header>
	)
}
