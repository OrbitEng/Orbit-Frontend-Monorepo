import Image from "next/image";

// TODO: add more cards as we make them, maybe mazer can make a few more
export function BetaCard(props) {
	return(
		<div
			ref={props.passedRef}
			className="flex flex-col w-full h-full px-6 py-4 container rounded-2xl justify-around content-center items-center overflow-hidden" 
		>
			<div className="flex w-full px-10 pt-5 text-[#4A4A4A] font-bold text-xl z-30">BETA</div>
			<div className="flex flex-row justify-start w-5/6 mt-6 mb-12 z-30">
				<div className="flex flex-col justify-start align-middle">
					<p className="text-[#4A4A4A] text-lg font-bold mt-2 mb-1">ENDS 2022 Q4</p>
					<div className="font-bold text-white text-3xl">Beta is now available for all users!</div>
					<p className="font-bold text-[#4A4A4A]">Thank you for using orbit, beta is only available for a short period.</p>
					<button className="flex justify-center font-bold text-white bg-[#474747] bg-opacity-50 py-2 px-4 rounded-lg mx-auto mt-4 hover:scale-[103%] transition duration-200">
						Learn More
					</button>
				</div>
			</div>
			<Image 
				className="z-0 rounded-2xl overflow-hidden"
				src="/Cards/BetaCard.png"
				layout="fill"
				objectFit="cover"
				priority={true}
				loading="eager"
			/>
		</div>
	);
}