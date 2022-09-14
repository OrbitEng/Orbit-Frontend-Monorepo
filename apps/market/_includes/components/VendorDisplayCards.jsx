import Image from "next/image";

export function Vendor(props) {
	return(
		<div className="flex flex-row bg-[#171717] rounded-xl px-auto py-5 justify-around" key={props.rank}>
			<span className="text-white text-xl align-middle my-auto font-bold">{props.rank}</span>
			<div className="relative h-12 w-12 rounded-full overflow-hidden">
				<Image 
					layout="fill"
					src={props.vendor.profilepic}
					objectFit="contain"
				/>
			</div>
			<div className="text-white font-bold text-xl align-middle my-auto flex flex-col justify-start">
				<span className="-mb-[6px]">{props.vendor.nickname}</span>
				<span className="text-[#535353] text-sm font-normal">{props.vendor.address}</span>
			</div>
			<div className="text-white text-sm align-middle my-auto flex flex-col justify-start">
				<span className="-mb-[3px]">Total Sales</span>
				<span className="text-[#535353] text-xs">{props.vendor.sales}</span>
			</div>
		</div>
	)
}