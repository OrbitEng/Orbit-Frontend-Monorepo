import {PublicKey} from "@solana/web3.js";
import DigitalMarketClient from "./src/DigitalMarketClient";
const DigitalMarketId = new PublicKey(require("./deps/orbit_digital_market.json").metadata.address);

export{
    DigitalMarketClient,
    DigitalMarketId
}