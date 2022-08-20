import { FC } from 'react'

// TODO: add more cards as we make them, maybe mazer can make a few more
export function BetaCard(props) {
	return(
		<div
			ref={props.passedRef}
			className="flex flex-col h-full py-5 container rounded-2xl bg-cover bg-[url(/Cards/BetaCard.png)] justify-around content-center items-center" 
		>
			<div className="flex w-full text-[#4A4A4A] font-semibold">BETA</div>
			<button className="flex font-bold text-white bg-[#474747] bg-opacity-50 p-2 rounded-lg">
				Learn More
			</button>
		</div>
	);
}