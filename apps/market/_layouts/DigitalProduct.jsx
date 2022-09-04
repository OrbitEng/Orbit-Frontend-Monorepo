import { useContext, useState } from "react";
import { PublicKey } from "@solana/web3.js";

// import MatrixClientCtx from "@contexts/MatrixClientCtx";
import DigitalMarketCtx from "@contexts/DigitalMarketCtx";
import MarketAccountsCtx from "@contexts/MarketAccountsCtx";
import MatrixClientCtx from "@contexts/MatrixClientCtx";
import { PageSearchBar } from "@includes/components/SearchBar";
import { MarketFooter } from "@includes/Footer";
import { useCallback } from "react";

export function DigitalProductLayout(props){
	const {digitalMarketClient} = useContext(DigitalMarketCtx);
	const {marketAccountsClient} = useContext(MarketAccountsCtx);
	const {matrixClient} = useContext(MatrixClientCtx);

	const [product, setProduct] = useState(props.product); // type DigitalProduct in idl
	const [vendor, setVendor] = useState(props.vendor); // type OrbitMarketAccount in idl + metadat


	const addToCart = useCallback(()=>{},[])
	const buyNow = useCallback(async ()=>{
		let seller_chat_id = new PublicKey(vendor.masterPubkey);
		let seller_nickname = vendor.metadata.nickname;
		let seller_account_addrss = new PublicKey(product.metadata.seller);

		await this.matrixClient.StartConvo(seller_nickname, seller_chat_id.toString(), seller_account_addrss);
		if(product.currency.toString() == "11111111111111111111111111111111"){
			await digitalMarketClient.OpenTransactionSol(
				product.address,
				marketAccountsClient.LoadAccountAddress(),
				marketAccountsClient.LoadMasterAuth(),
				product.price.toNumber()
			)
		}else{
			await digitalMarketClient.OpenTransactionSpl(
				product.address,
				marketAccountsClient.LoadAccountAddress(),
				marketAccountsClient.LoadMasterAuth(),
				product.price.toNumber()
			)
		}

	},[])

    return(
		<div className="w-full min-h-screen bg-transparent">
			<Head>
				<title>Market Home</title>
				<link rel="icon" href="favicon.ico" />
			</Head>
			<main className="bg-[url('/bgWallpaper.png')] bg-cover">
				<HomeHeader headerMiddle={PageSearchBar}/>
				<div className="max-w-5xl align-center mx-auto">
					
				</div>
                <MarketFooter />
			</main>
		</div>
	)
}