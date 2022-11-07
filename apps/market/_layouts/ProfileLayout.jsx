import { useState, useContext, useEffect } from "react";
import { Listbox } from "@headlessui/react";
import Image from "next/image";
import { LargeProductExplorer } from "@includes/components/product_display/LargeProductExplorer";
import { PaperAirplaneIcon } from "@heroicons/react/24/outline";
import MarketAccountsCtx from '@contexts/MarketAccountsCtx';
import ProductClientCtx from "@contexts/ProductClientCtx";
import {EditProfileModal} from "@includes/components/modals/EditProfileModal";
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import { DigitalProductFunctionalities, PhysicalProductFunctionalities, CommissionProductFunctionalities } from "@functionalities/Products";
import UserAccountCtx from "@contexts/UserAccountCtx";
import MatrixClientCtx from "@contexts/MatrixClientCtx";
import { ChatWidget } from "@includes/ChatWidget";
import ArweaveCtx from "@contexts/ArweaveCtx";

export function ProfileLayout(props) {
	const { GetAllVendorPhysicalProducts } = PhysicalProductFunctionalities();
	const { GetAllVendorDigitalProducts } = DigitalProductFunctionalities();
	const { GetAllVendorCommissionProducts } = CommissionProductFunctionalities();
	const { arweaveClient } = useContext(ArweaveCtx)
	const { userAccount } = useContext(UserAccountCtx);

	const {matrixClient} = useContext(MatrixClientCtx)

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
			market_account.data.profilePic = await arweaveClient.GetPfp(market_account.data.profilePic);
			market_account.data.metadata = await arweaveClient.GetMetadata(market_account.data.metadata);
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

	}, [marketAccountsClient, props.accountAddr, productClient, arweaveClient])

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
						<div className={"rounded-lg p-1 font-bold text-md w-fit " + (marketAccount?.address ? ("bg-gradient-to-tr from-[#181424] via-buttontransparent2 to-buttontransparent border-t-[0.5px] border-[#474747]") : ("bg-[#535353] animate-pulse w-72 h-6"))}>
							<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#16C7FF] to-[#C625FF]">{marketAccount?.address ? ("@" + marketAccount?.address?.toString()) : ("")}</span>
						</div>
						{
							(isSelf && <EditProfileModal currentAccount={marketAccount}/>) || 
							((matrixClient && matrixClient.logged_in) && 
							
							<button className="p-2 bg-[#13171D] rounded-lg" onClick={async ()=>{
								console.log(marketAccount.data.wallet.toString())
								await matrixClient.StartConvo(marketAccount.data.wallet.toString())}}>
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
			<LargeProductExplorer displayOption={[displayOption, setDisplayOption]} items={listingsExplorerCategory} category={displayOption.toLowerCase()} />
		</div>
	)
}