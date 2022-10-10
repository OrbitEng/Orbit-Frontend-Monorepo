import Image from "next/image";
import { useWallet } from "@solana/wallet-adapter-react";
import { LargeExplore } from "@includes/ProductExplorer";

export function SellerAccountDisplay(props) {
	let wallet = useWallet();

	return(
		<div className="flex flex-col max-w-6xl mx-auto">
			<div className="flex flex-row gap-x-8 my-10">
				<div className="flex flex-shrink-0 relative h-44 w-44 overflow-hidden rounded-full">
					<Image
						src={props?.vendor?.profilepic || "https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50?d=mp&f=y"}
						layout="fill"
						objectFit="contain"
					/>
				</div>
				<div className="flex flex-col my-auto">
					<div className="rounded-lg p-1 font-bold text-md bg-gradient-to-tr from-[#181424] via-buttontransparent2 to-buttontransparent border-t-[0.5px] border-[#474747] w-fit">
						<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#16C7FF] to-[#C625FF]">{props?.username || "@UserNamePlaceHolder"}</span>
					</div>
					<span className="text-white font-bold text-6xl">{props?.name || "NamePlaceholder"}</span>
					<p className="text-[#5B5B5B]">{props?.bio || "King of the hill is my favorite game, im always in first no matter what case it is"}</p>
				</div>
			</div>
			<LargeExplore/>
		</div>
	)
}