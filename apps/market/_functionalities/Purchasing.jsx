import { useContext, useCallback } from "react";

import DigitalMarketCtx from "@contexts/DigitalMarketCtx";
import MarketAccountsCtx from "@contexts/MarketAccountsCtx";
import MatrixClientCtx from "@contexts/MatrixClientCtx";
import PhysicalMarketCtx from "@contexts/PhysicalMarketCtx";

export function Purchasing() {
    	const {digitalMarketClient} = useContext(DigitalMarketCtx);
		const {physicalMarketClient} = useContext(PhysicalMarketCtx)
        const {marketAccountsClient} = useContext(MarketAccountsCtx);
        const {matrixClient} = useContext(MatrixClientCtx);

        const buyDigitalProd = useCallback(async (product, vendor)=>{
			let market_acc = marketAccountsClient.market_account;
        	let market_auth = marketAccountsClient.master_auth;

			let seller_nickname = vendor.metadata.nickname;
			let seller_chat_id = vendor.masterPubkey.toString()
			let seller_account_addrss = product.metadata.seller.toString();

			if(product.currency.toString() == "11111111111111111111111111111111"){
				let tx_addr = await digitalMarketClient.OpenTransactionSol(
					product.address,
					Object.keys(product.data.digitalProductType)[0], // might have to do Object.keys(x)[0]
					Object.keys(product.data.digitalFileType)[0], // might have to do Object.keys(x)[0]
					market_acc,
					market_auth,
					product.price.toNumber()
				)
				let roomid = await matrixClient.StartConvo(seller_nickname, seller_chat_id, seller_account_addrss, tx_addr);
				await digitalMarketClient.SetRoomId(tx_addr, roomid)
			}else{
				let tx_addr = await digitalMarketClient.OpenTransactionSpl(
					product.address,
					Object.keys(product.data.digitalProductType)[0], // might have to do Object.keys(x)[0]
					Object.keys(product.data.digitalFileType)[0], // might have to do Object.keys(x)[0]
					market_acc,
					market_auth,
					product.price.toNumber()
				)
				let roomid = await matrixClient.StartConvo(seller_nickname, seller_chat_id, seller_account_addrss, tx_addr);
				await digitalMarketClient.SetRoomId(tx_addr, roomid)
			}

		},[])

		const buyPhysicalProd = useCallback(async (product, vendor)=>{
			let market_acc = marketAccountsClient.market_account;
        	let market_auth = marketAccountsClient.master_auth;

			let seller_nickname = vendor.metadata.nickname;
			let seller_chat_id = vendor.masterPubkey.toString()
			let seller_account_addrss = product.metadata.seller.toString();

			if(product.currency.toString() == "11111111111111111111111111111111"){
				let tx_addr = await physicalMarketClient.OpenTransactionSol(
					product.address,
					market_acc,
					market_auth,
					product.price.toNumber()
				)
				let roomid = await matrixClient.StartConvo(seller_nickname, seller_chat_id, seller_account_addrss, tx_addr);

				await physicalMarketClient.SetRoomId(tx_addr, roomid)
			}else{
				let tx_addr = await physicalMarketClient.OpenTransactionSpl(
					product.address,
					market_acc,
					market_auth,
					product.price.toNumber()
				)
				let roomid = await matrixClient.StartConvo(seller_nickname, seller_chat_id, seller_account_addrss, tx_addr);

				await physicalMarketClient.SetRoomId(tx_addr, roomid)
			}

		},[])

		return {buyDigitalProd, buyPhysicalProd}
}