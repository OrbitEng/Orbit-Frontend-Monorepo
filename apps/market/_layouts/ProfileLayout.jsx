import { useState, useContext, useEffect } from "react";
import { Listbox } from "@headlessui/react";
import Image from "next/image";
import { LargeProductExplorer } from "@includes/components/product_display/LargeProductExplorer";

import MarketAccountsCtx from '@contexts/MarketAccountsCtx';
import ProductClientCtx from "@contexts/ProductClientCtx";
import {EditProfileModal} from "@includes/components/modals/EditProfileModal";
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import { MarketAccountFunctionalities } from "@functionalities/Accounts";
import { DigitalProductFunctionalities, PhysicalProductFunctionalities, CommissionProductFunctionalities } from "@functionalities/Products";
import UserAccountCtx from "@contexts/UserAccountCtx";

export function ProfileLayout(props) {
	const { GetAllVendorPhysicalProducts } = PhysicalProductFunctionalities();
	const { GetAllVendorDigitalProducts } = DigitalProductFunctionalities();
	const { GetAllVendorCommissionProducts } = CommissionProductFunctionalities();
	
	const {GetPfp, GetMetadata} = MarketAccountFunctionalities();
	const {userAccount} = useContext(UserAccountCtx);

	const [marketAccount, setMarketAccount] = useState();
	const [isSelf, setIsSelf] = useState(false);
	const {marketAccountsClient} = useContext(MarketAccountsCtx);
	const {productClient} = useContext(ProductClientCtx);

	const [listingsExplorerCategory, setListingsExplorerCategory] = useState();
	const [displayOption, setDisplayOption] = useState("Physical");

	const [physicalListings, setPhysicalListings] = useState();
	const [digitalListings, setDigitalListings] = useState();
	const [commissionListings, setCommissionListings] = useState();

	useEffect(()=>{
		switch(displayOption){
			case "Physical":
				setListingsExplorerCategory(physicalListings)
				break;
			case "Digital":
				setListingsExplorerCategory(digitalListings)
				break;
			case "Commission":
				setListingsExplorerCategory(commissionListings)
				break;
		}
	},[displayOption, physicalListings, digitalListings, commissionListings])

	useEffect(()=>{
		if(userAccount && props.accountAddr && (props.accountAddr == userAccount.address.toString())){
			setIsSelf(true)
		};
	},[props.accountAddr, userAccount])

	useEffect(async () => {
		if (!(marketAccountsClient && props.accountAddr)) return;

		console.log(props.accountAddr)

		let market_account;
		try{
			market_account = await marketAccountsClient.GetAccount(props.accountAddr);
			console.log(market_account)
			market_account.data.profilePic = await GetPfp(market_account.data.profilePic);
			market_account.data.metadata = await GetMetadata(market_account.data.metadata);
		}catch(e){
			console.log(e)
			return;
		}

		setMarketAccount(market_account);
		if(market_account.data.physicalListings.toString() != "11111111111111111111111111111111"){
			let listings = await GetAllVendorPhysicalProducts(market_account.data.physicalListings);
			setPhysicalListings(listings);
		}
		if(market_account.data.digitalListings.toString() != "11111111111111111111111111111111"){
			let listings = await GetAllVendorDigitalProducts(market_account.data.digitalListings);
			setDigitalListings(listings);
		}
		if(market_account.data.commissionListings.toString() != "11111111111111111111111111111111"){
			let listings = await GetAllVendorCommissionProducts(market_account.data.commissionListings);
			setCommissionListings(listings);
		}

	}, [marketAccountsClient, props.accountAddr, productClient])

	return(
		<div className="flex flex-col max-w-6xl mx-auto">
			<div className="flex flex-row gap-x-8 my-10">
				<div className="flex flex-shrink-0 relative h-44 w-44 overflow-hidden rounded-full">
					<Image
						src={((marketAccount?.data?.profilePic?.charAt(0) == '/' || marketAccount?.data?.profilePic?.slice(0,4) == 'http' || marketAccount?.data?.profilePic?.slice(0,4) == 'data') && marketAccount.data.profilePic) || "https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50?d=mp&f=y"}
						layout="fill"
						objectFit="cover"
					/>
				</div>
				<div className="flex flex-col my-auto">
					<div className="flex flex-row gap-x-2">
						<div className="rounded-lg p-1 font-bold text-md bg-gradient-to-tr from-[#181424] via-buttontransparent2 to-buttontransparent border-t-[0.5px] border-[#474747] w-fit">
							<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#16C7FF] to-[#C625FF]">{("@" + marketAccount?.address?.toString()) || "@UserNamePlaceHolder"}</span>
						</div>
						{isSelf ? <EditProfileModal currentAccount={marketAccount}/>: <></>}
					</div>	
					<span className="text-white font-bold text-6xl mb-2">{marketAccount?.data?.metadata?.name || "NamePlaceholder"}</span>
					<p className="text-[#5B5B5B]">{marketAccount?.data.metadata?.bio || "King of the hill is my favorite game, im always in first no matter what case it is"}</p>
				</div>
			</div>
			<div className="text-white text-3xl">
				<div className="flex flex-col w-1/5 h-full justify-center">
					<Listbox value={displayOption} onChange={setDisplayOption}>
						<div className="flex relative w-3/4 text-xl h-1/2 justify-end">
							<Listbox.Button className="flex w-full h-full bg-[#242424] rounded-lg p-1 justify-center">
								<div className="flex flex-row align-middle w-full">
									<span className="w-3/4 align-middle font-normal">
										{displayOption}
									</span>
									<ChevronDownIcon className="text-white h-5 w-1/4 my-auto align-middle"/>
								</div>
							</Listbox.Button>
							<Listbox.Options className="w-full text-center absolute transition rounded-md bg-[#242424] z-50">
								{
									["Physical","Digital","Commission"].map((category, id)=>(
										<Listbox.Option
											key={id}
											value = {category}
											className={({active})=>{
												return `py-1.5 w-full ${active? "bg-[#2c2c2c] ring-1 ring-[#574878] ring-inset rounded-sm" : ""}`
											}}
										>
											{category}
										</Listbox.Option>
									))
								}
							</Listbox.Options>
						</div>
					</Listbox>
				</div>
			</div>
			<LargeProductExplorer items={listingsExplorerCategory} category={displayOption.toLowerCase()} />
		</div>
	)
}