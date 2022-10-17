import { useState, useContext, useEffect } from "react";
import Image from "next/image";
import { LargeExplore } from "@includes/ProductExplorer";

import MarketAccountsCtx from '@contexts/MarketAccountsCtx';
import ProductClientCtx from "@contexts/ProductClientCtx";
import EditProfileButton from "@includes/components/EditProfileButton";

export function AccountDisplay(props) {

	const [marketAccount, setMarketAccount] = useState();
	const [isSelf, setIsSelf] = useState(false);
	const {marketAccountsClient} = useContext(MarketAccountsCtx);
	const {productClient} = useContext(ProductClientCtx)

	const [physicalListings, setPhysicalListings] = useState()
	const [digitalListings, setDigitalListings] = useState()
	const [commissionListings, setCommissionListings] = useState()

	useEffect(()=>{
		if(marketAccountsClient && marketAccountsClient.wallet && (props.accountAddr == marketAccountsClient.GenAccountAddress().toString())){
			setIsSelf(true)
		};
	},[props.accountAddr, marketAccountsClient])

	useEffect(async () => {
		if (!(marketAccountsClient && props.accountAddr)) return;

		let market_account
		try{
			market_account = await marketAccountsClient.GetAccount(props.accountAddr);
		}catch(e){
			return;
		}

		setMarketAccount(market_account);
		if(market_account.data.digitalListings.toString() != "11111111111111111111111111111111"){
			let listings = await productClient.GetListingsStruct(market_account.data.digitalListings);
			console.log(productClient.FindAllListings(listings.data))
		}
		if(market_account.data.physicalListings.toString() != "11111111111111111111111111111111"){
			let listings = await productClient.GetListingsStruct(market_account.data.physicalListings);
			console.log(productClient.FindAllListings(listings.data));
		}
		if(market_account.data.commissionListings.toString() != "11111111111111111111111111111111"){
			let listings = await productClient.GetListingsStruct(market_account.data.commissionListings);
			console.log(productClient.FindAllListings(listings.data))
		}

	}, [marketAccountsClient, props.accountAddr, productClient])



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
					<div className="flex flex-row gap-x-2">
						<div className="rounded-lg p-1 font-bold text-md bg-gradient-to-tr from-[#181424] via-buttontransparent2 to-buttontransparent border-t-[0.5px] border-[#474747] w-fit">
							<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#16C7FF] to-[#C625FF]">{props?.username || "@UserNamePlaceHolder"}</span>
						</div>
						{isSelf ? <EditProfileButton/>: <></>}
					</div>	
					<span className="text-white font-bold text-6xl mb-2">{marketAccount?.data?.metadata?.name || "NamePlaceholder"}</span>
					<p className="text-[#5B5B5B]">{props?.bio || "King of the hill is my favorite game, im always in first no matter what case it is"}</p>
				</div>
			</div>
			<LargeExplore items={["bruh"]} />
		</div>
	)
}