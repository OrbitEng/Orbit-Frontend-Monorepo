import { FC } from 'react'

// TODO: add more cards as we make them, maybe mazer can make a few more
export function BetaCard(props) {
	return(
		<div
			ref={props.passedRef}
			className="flex w-full h-full rounded-xl bg-cover bg-betacardimage justify-around content-center items-center" 
		/>
	);
}