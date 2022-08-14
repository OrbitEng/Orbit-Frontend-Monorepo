import { Connection } from '@solana/web3.js';
import { Jupiter } from "@jup-ag/core";

export class Swapper{
    constructor(wallet){
        if(!wallet){
            return
        }
        this.wallet = wallet;
        
        // rpc endpoint
        // "https://api.devnet.solana.com" : "https://ssc-dao.genesysgo.net", etc. rpc endpoints
        // const connection = new Connection('https://solana-api.projectserum.com');

        // this.jupiter = await Jupiter.load({
        //     connection,
        //     cluster: "devnet",// "devnet" | "testnet" | "mainnet-beta"
        //     user: this.wallet.publicKey, // or public key
        //     // platformFeeAndAccounts:  NO_PLATFORM_FEE,
        //     routeCacheDuration: 5_000, // Will not refetch data on computeRoutes for up to 5 seconds
        // });
          
    }

    Swap = async function(inputTokenMint, outputTokenMint, amount, slippagePct){
        const mintDecimals = {
            "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v" : "6", //usdc
        }


        const routes = await this.jupiter.computeRoutes({
            inputMint: new PublicKey(inputTokenMint), // Mint address of the input token
            outputMint: new PublicKey(outputTokenMint), // Mint address of the output token
            amount: JSBI.BigInt(amount * mintDecimals[inputTokenMint]), // amount of tokens * decimals. USDC has 6. we can just hardcode this i cba to add another network call
            slippage, // The slippage in % terms
            forceFetch: false // false is the default value => will use cache if not older than routeCacheDuration
            // there's a deeBps field i have no idea what it does
        });
        

        const bestRoute = routes.routesInfos[0]
        const { execute } = await this.jupiter.exchange({
            routeInfo: bestRoute
        });
        
        // Execute swap
        const swapResult = await execute(); // Force any to ignore TS misidentifying SwapResult type

        if (swapResult.error) {
            return swapResult.error
        } else {
            return `https://explorer.solana.com/tx/${swapResult.txid}`
            // console.log(`inputAddress=${swapResult.inputAddress.toString()} outputAddress=${swapResult.outputAddress.toString()}`);
            // console.log(`inputAmount=${swapResult.inputAmount} outputAmount=${swapResult.outputAmount}`);
        }

    }
    
}