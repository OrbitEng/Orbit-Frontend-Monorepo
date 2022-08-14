import * as anchor from "@project-serum/anchor";
import * as pyth_utils from "../pyth_utils/pythUtils";
import {Token, TOKEN_PROGRAM_ID} from '@solana/spl-token';
import { SystemProgram, PublicKey, Connection} from "@solana/web3.js";

///////////////////////////////////////////////////////////////////////////////////////////////////
// CONSTS
export class NetworkClient {
	constructor(wallet, connection, provider){
		this.pyth_map = pyth_utils.PythMap();

		if (!wallet){
			return
		}
		this.connection = connection;
		this.provider = provider;
		
	}

	
	GetTokenAccountBalance = async(mint) => {
		let ata = await Token.getAssociatedTokenAddress(
			this.spl_program_id, // always ASSOCIATED_TOKEN_PROGRAM_ID
			TOKEN_PROGRAM_ID, // always TOKEN_PROGRAM_ID
			new PublicKey(mint), // mint
			this.wallet.publicKey // owner
		);

		let val = await this.connection.getTokenAccountBalance(ata);
		return val.value.uiAmount;
	}

	GetSolBalance = async() =>{
		return await this.connection.getBalance(this.wallet.publicKey)/anchor.web3.LAMPORTS_PER_SOL;;
	}

	GetTokenPrice = async(name, connection) => {
		let address = this.pyth_map[connection][name];
		let priceAccount = await this.connection.getAccountInfo(address);
		let priceData = pyth_utils.parsePriceData(priceAccount.data);
		return priceData;
	}
}