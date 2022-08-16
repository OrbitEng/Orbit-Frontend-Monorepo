import { FC } from 'react'
import Image from 'next/image'

import { WalletInteractionsButton } from '@includes/components/WalletButton'

import OrbitLogo from '../public/OrbitLogo.png'
import { HeaderSearchBar } from '@includes/components/SearchBar'

export const HomeHeader: FC = ({}) => {
	return(
		<header className="top-0 w-full h-14 sticky flex">
			<div className="bg-gradient-to-r from-homeheadergray to-homeheaderpurple w-full h-full flex flex-row justify-around border-[#1A1A23] border-b-2 align-middle">
				<div className="relative basis-1/4 py-auto align-middle my-2 ml-2">
					<Image
						src={OrbitLogo}
						width={22}
						layout="fill"
						alt="The Name and Logo for the Orbit market"
						objectFit="contain"
					/>
				</div>
				<div className="flex basis-1/2 align-middle content-center">
					<HeaderSearchBar />
				</div>
				<div className="flex basis-1/4 align-middle content-center">
					<WalletInteractionsButton />
				</div>
			</div>
		</header>
	)
}
