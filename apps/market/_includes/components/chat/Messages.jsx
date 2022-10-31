import Image from "next/image"

export function Message(props) {
	return(
		<div className="flex flex-row w-max-[50%] gap-x-2 my-2">
			<div className="flex flex-col">
				<div className="relative text-[#5C5C5C] text-xs text-left mb-1">hh:mm</div>
				<div className="flex flex-row gap-x-2">
					<div className="relative flex h-8 w-8 rounded-full overflow-hidden">
						<Image 
							layout="fill"
							src={(props?.vendor?.profilePic && props?.vendor?.profilePic) || "https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50?d=mp&f=y"}
							objectFit="cover"
						/>
					</div>
					<div className="rounded bg-[#6A31B2] bg-opacity-20 text-[#949494] py-1 px-2 text-sm my-auto">{props.text}</div>
					{props.children}
				</div>
			</div>
		</div>
	)
}


export function SelfMessage(props) {
	return(
		<div className="flex flex-row w-max-[50%] gap-x-2 my-2 justify-end">
			<div className="flex flex-col">
				<div className="relative text-[#5C5C5C] text-xs text-right mb-1">hh:mm</div>
				<div className="rounded bg-[#9E3B88] bg-opacity-20 text-[#949494] py-1 px-2 text-sm">{props.text}</div>
				{props.children}
			</div>
		</div>
	)
}

export function ContractRequest(props) {
	return(
		<div className="flex flex-row w-max-[50%] my-2 justify-start">
			<div className="flex flex-col mr-1">
				<div className="relative text-[#5C5C5C] text-xs text-left mb-1">hh:mm</div>
				<div className="flex flex-row gap-x-2">
					<div className="relative flex h-8 w-8 rounded-full overflow-hidden">
						<Image 
							layout="fill"
							src={props?.vendor?.profilePic || "https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50?d=mp&f=y"}
							objectFit="cover"
						/>
					</div>
				</div>
			</div>
			<div className="flex flex-row rounded-lg bg-[#6A31B2] bg-opacity-20 p-6 my-auto w-[22rem] h-44 justify-between">
				<div className="flex flex-col basis-1/2 flex-shrink-0">
					<div className="flex flex-col">
						<span className="font-bold text-md text-white truncate -mb-1">{props.requestName}</span>
						<span className="text-xs text-[#6A6A6A] truncate">{"from | " + (props?.fromUser || "@someusername")}</span>
					</div>
					<div className="border-t-[1px] border-[#868686] w-full">
						<p className="text-xs text-[#505050] my-1 truncate">
							{props.itemdesc || "No description provided!"}
						</p>
					</div>
					<div className="flex flex-row justify-between mt-auto">
						<button
							className="rounded-full px-3 py-1 bg-[#1C6427] bg-opacity-20 border-[1px] border-[#3B8472] text-[#3B8472] text-sm mx-1 my-auto"
							onClick={() => {
							}}
						>
							Accept
						</button>
						{/* fix the text color this is hard to read */}
						<button
							className="rounded-full px-3 py-1 bg-[#742525] bg-opacity-20 text-[#742525] border-[1px] border-[#742525] text-sm mx-1 my-auto"
							onClick={() => {
							}}
						>Decline</button>
					</div>
				</div>
				<div className="flex relative flex-shrink-0 flex-col basis-1/2 overflow-hidden">
					<Image 
						src={props.reqImage || "/demoLogos.png"}
						layout="fill"
						objectFit="contain"
					/>
				</div>
			</div>
		</div>
	)
}

export function RateMessage(props){
	// has accept & counter properties
	return (
		<div>

		</div>
	)
}