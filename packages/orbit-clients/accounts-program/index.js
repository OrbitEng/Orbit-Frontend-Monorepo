import {PublicKey} from "@solana/web3.js";
import MarketAccountsClient from "./src/MarketAccountsClient";
const MARKET_ACCOUNTS_PROGRAM_ID = new PublicKey(require("./deps/orbit_market_accounts").metadata.address);

export{
    MarketAccountsClient,
    MARKET_ACCOUNTS_PROGRAM_ID
}