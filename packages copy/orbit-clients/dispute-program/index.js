import {PublicKey} from "@solana/web3.js";
import DisputeClient from "./src/DisputeClient";
const DISPUTE_PROGRAM_ID = new PublicKey(require("./deps/dispute.json").metadata.address);

export{
    DisputeClient,
    DISPUTE_PROGRAM_ID
}