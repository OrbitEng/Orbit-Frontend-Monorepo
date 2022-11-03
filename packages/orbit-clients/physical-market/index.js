import {PublicKey} from "@solana/web3.js";
import PhysicalMarketClient from "./src/PhysicalMarketClient";
const PhysicalMarketId = new PublicKey(require("./deps/orbit_physical_market.json").metadata.address);

export{
    PhysicalMarketClient,
    PhysicalMarketId
}