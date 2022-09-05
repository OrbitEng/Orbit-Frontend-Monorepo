import { useContext, useCallback } from "react";

import { PublicKey } from "@solana/web3.js";

import DigitalMarketCtx from "@contexts/DigitalMarketCtx";
import MarketAccountsCtx from "@contexts/MarketAccountsCtx";
import MatrixClientCtx from "@contexts/MatrixClientCtx";

export function DigitalPurchasing() {
    	const {digitalMarketClient} = useContext(DigitalMarketCtx);
        const {marketAccountsClient} = useContext(MarketAccountsCtx);
        const {matrixClient} = useContext(MatrixClientCtx);


        const buyDigitalProd = useCallback(async (product, vendor)=>{
			let seller_chat_id = new PublicKey(vendor.masterPubkey);
			let seller_nickname = vendor.metadata.nickname;
			let seller_account_addrss = new PublicKey(product.metadata.seller);

			if(product.currency.toString() == "11111111111111111111111111111111"){
				let tx_addr = await digitalMarketClient.OpenTransactionSol(
					product.address,
					product.data.digitalProductType,
					marketAccountsClient.LoadAccountAddress(),
					marketAccountsClient.LoadMasterAuth(),
					product.price.toNumber()
				)
				await matrixClient.StartConvo(seller_nickname, seller_chat_id.toString(), seller_account_addrss.toString(), tx_addr);
			}else{
				let tx_addr = await digitalMarketClient.OpenTransactionSpl(
					product.address,
					product.data.digitalProductType,
					marketAccountsClient.LoadAccountAddress(),
					marketAccountsClient.LoadMasterAuth(),
					product.price.toNumber()
				)
				await matrixClient.StartConvo(seller_nickname, seller_chat_id.toString(), seller_account_addrss.toString(), tx_addr);
			}

		},[])

		return {buyDigitalProd}
}