import { FC } from "react";
import Image from "next/image";

import OrbitLogo from '../public/OrbitLogo.png'

export const HomeHeader: FC = ({}) => {
	return(
		<header className="top-0 w-full h-14 sticky flex">
			<div className="bg-gradient-to-r from-homeheadergray to-homeheaderpurple w-full h-full flex flex-row justify-evenly border-[#1A1A23] border-b-2">
				<div className="relative basis-1/4 items-center">
					<Image
						src={OrbitLogo}
						layout="responsive"
						alt="The Name and Logo for the Orbit market"
					/>
				</div>
				<div className="basis-1/2">
					searchbar
				</div>
				<div className="basis-1/4">
					Features	
				</div>
			</div>
		</header>
	)
}
