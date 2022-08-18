import { FC } from 'react'

type props = {
	passedRef: any
}

// TODO: add more cards as we make them, maybe mazer can make a few more
export const BetaCard: FC<props> = (props) => {
	return(
		<div
			ref={props.passedRef}
			className="flex w-full h-full rounded-xl bg-cover bg-betacardimage justify-around content-center items-center" 
		/>
	);
}