import { FC } from 'react'

// TODO: add more cards as we make them, maybe mazer can make a few more
export function BetaCard(props) {
	return(
		<div
			ref={props.passedRef}
			className="flex flex-col w-full h-full px-6 py-4 container rounded-2xl bg-cover bg-[url(/Cards/BetaCard.png)] justify-around content-center items-center" 
		>
			<div className="flex w-full px-10 text-[#4A4A4A] font-bold text-xl">BETA</div>
			<div className="flex flex-row justify-start w-5/6 my-14">
				<div className="flex flex-col justify-start">
					<p className="text-[#4A4A4A] font-semibold mt-4 mb-2">ENDS 2022 Q4</p>
					<div className="font-bold text-white text-3xl">Beta is now available for all users!</div>
					<p className="font-bold text-[#4A4A4A]">Thank you for using orbit, beta is only available for a short period.</p>
					<button className="flex font-bold text-white bg-[#474747] bg-opacity-50 p-2 rounded-lg mr-auto mt-4">
						Learn More
					</button>
				</div>
			</div>
		</div>
	);
}