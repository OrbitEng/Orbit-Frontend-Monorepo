import { FC } from 'react'
import Image from 'next/image'

import { WalletInteractionsButton } from '@includes/components/WalletButton'

import OrbitLogo from '../public/OrbitLogo.png'

export const HomeHeader: FC = ({}) => {
	return(
		<header className="top-0 w-full h-14 sticky flex">
			<div className="bg-gradient-to-r from-homeheadergray to-homeheaderpurple w-full h-full flex flex-row justify-evenly border-[#1A1A23] border-b-2 align-middle">
				<div className="relative basis-1/4 py-auto align-middle my-auto ml-2">
					<Image
						src={OrbitLogo}
						layout="responsive"
						alt="The Name and Logo for the Orbit market"
					/>
				</div>
				<div className="basis-1/2">
					searchbar
				</div>
				<div className="flex basis-1/4 align-middle cen">
					<WalletInteractionsButton />
				</div>
			</div>
		</header>
	)
}
