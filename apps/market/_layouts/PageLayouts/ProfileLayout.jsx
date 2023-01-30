import { useState, useContext, useEffect } from "react";
import { Listbox } from "@headlessui/react";
import Image from "next/image";
import { PaperAirplaneIcon } from "@heroicons/react/24/outline";
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import { LargeProductExplorer } from "@includes/components/product_display/LargeProductExplorer";
import {EditProfileModal} from "@includes/components/modals/EditProfileModal";
import { DigitalProductFunctionalities, PhysicalProductFunctionalities, CommissionProductFunctionalities } from "@functionalities/Products";
import { ACCOUNTS_PROGRAM } from "orbit-clients";
import UserAccountCtx from "@contexts/UserAccountCtx";
import MatrixClientCtx from "@contexts/MatrixClientCtx";
import ChatCtx from "@contexts/ChatCtx";
import ArweaveCtx from "@contexts/ArweaveCtx";
import SemiSpanLayoutTemplate from "@includes/templates/Spans/SemiLayoutSpanTemplate";

export function ProfileLayout(props) {
	const { GetAllVendorPhysicalProducts } = PhysicalProductFunctionalities();
	const { GetAllVendorDigitalProducts } = DigitalProductFunctionalities();
	const { GetAllVendorCommissionProducts } = CommissionProductFunctionalities();
	const { arweaveClient } = useContext(ArweaveCtx);
	const { userAccount } = useContext(UserAccountCtx);
	const { matrixClient } = useContext(MatrixClientCtx);
	const { setChatState } = useContext(ChatCtx);


	const [marketAccount, setMarketAccount] = useState();
	const [isSelf, setIsSelf] = useState(false);

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
		if (!(props.accountAddr)) return;

		console.log(props.accountAddr)

		let market_account;
		try{
			market_account = await ACCOUNTS_PROGRAM.GetAccount(props.accountAddr);
			console.log(market_account)
			market_account.data.profilePic = await arweaveClient.GetPfp(market_account.data.profilePic);
			market_account.data.metadata = await arweaveClient.GetMetadata(market_account.data.metadata);
		}catch(e){
			console.log(e)
			return;
		}

		setMarketAccount(market_account);
		if(market_account.data.physicalListings){
			let listings = await GetAllVendorPhysicalProducts(market_account.data.voterId);
			setPhysicalListings(listings);
		}
		if(market_account.data.digitalListings){
			let listings = await GetAllVendorDigitalProducts(market_account.data.voterId);
			setDigitalListings(listings);
		}
		if(market_account.data.commissionListings){
			let listings = await GetAllVendorCommissionProducts(market_account.data.voterId);
			setCommissionListings(listings);
		}

	}, [props.accountAddr, arweaveClient])

	return(
		<div className="w-full h-full bg-transparent">
			<SemiSpanLayoutTemplate>
				<div className="flex flex-row gap-x-8">
					<div className="flex flex-shrink-0 relative h-44 w-44 overflow-hidden rounded-full">
						<Image
							src={((marketAccount?.data?.profilePic?.charAt(0) == '/' || marketAccount?.data?.profilePic?.slice(0,4) == 'http' || marketAccount?.data?.profilePic?.slice(0,4) == 'data') && marketAccount.data.profilePic) || "https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50?d=mp&f=y"}
							layout="fill"
							objectFit="cover"
						/>
					</div>
					<div className="flex flex-col my-auto">
						<div className="flex flex-row gap-x-2">
							<div className={"rounded-lg p-1 font-bold text-md w-fit " + (marketAccount?.address ? ("bg-gradient-to-tr from-[#181424] via-buttontransparent2 to-buttontransparent border-t-[0.5px] border-[#474747]") : ("bg-[#535353] animate-pulse w-72 h-6"))}>
								<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#16C7FF] to-[#C625FF]">{marketAccount?.address ? ("@" + marketAccount?.address?.toString()) : ("")}</span>
							</div>
							{
								(isSelf && <EditProfileModal currentAccount={marketAccount}/>) ||
								((matrixClient) && 
								
								<button className="bg-gradient-to-tr from-[#181424] via-buttontransparent2 to-buttontransparent border-t-[0.5px] border-[#474747] rounded-lg relative p-2" onClick={
									async ()=>{
										console.log(marketAccount.data.wallet.toString())
										await matrixClient.StartConvo(marketAccount)
										setChatState(s => ({...s}))
									}
								}>
									<PaperAirplaneIcon className="h-5 w-5 text-white"/>
								</button>) ||
								<></>
							}
						</div>	
						{marketAccount?.data?.metadata?.name ? 
							(<span className="text-white font-bold text-6xl mb-2">{marketAccount?.data?.metadata?.name || "NamePlaceholder"}</span>) :
							(<div className="bg-[#535353] animate-pulse h-14 w-72 my-2 rounded-lg" />)
						}
						{marketAccount?.data?.metadata ? 
							(<p className="text-[#5B5B5B]">{marketAccount?.data.metadata?.bio}</p>) :
							(<div className="bg-[#535353] animate-pulse h-6 w-96 rounded-lg" />)
						}
					</div>
				</div>
			</SemiSpanLayoutTemplate>
			<LargeProductExplorer displayOption={[displayOption, setDisplayOption]} items={listingsExplorerCategory} category={displayOption.toLowerCase()} />
		</div>
	)
}