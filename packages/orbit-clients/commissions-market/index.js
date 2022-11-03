import {PublicKey} from "@solana/web3.js";
import CommissionMarketClient from "./src/CommissionMarketClient";
const CommissionProgramId = new PublicKey(require("./deps/orbit_commission_market.json").metadata.address);

export{
    CommissionMarketClient,
    CommissionProgramId
}