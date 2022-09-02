import Image from "next/image"

export default function TopVendorsDisplay(props) {

	// this is just to show how I want to fetch vendors
	const dummyVendor = {
		nickname: "Name",
		address: "walletAddr....",
		sales: "123456789",
		profilepic: "https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50?d=mp&f=y",
	}

	let topVendors = []
	for(let i=1; i<7; i++) {
		topVendors.push(dummyVendor)
	}

	// fetch the top 8 vendors and display here
	return(
		<div className="flex flex-col justify-center mx-auto w-full m-28">
			<div className="text-white w-full font-bold text-4xl text-center mb-10">Top Vendor Profiles 🛍️</div>
			<div className="grid grid-flow-row grid-rows-2 grid-cols-3 gap-x-5 gap-y-8 w-full">
			{
				topVendors.map((vendor, index) => {
					return(<Vendor vendor={vendor} rank={index + 1} />)
				})	
			}
			</div>
		</div>
	)
}

function Vendor(props) {
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