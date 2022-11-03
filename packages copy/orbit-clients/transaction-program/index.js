import {PublicKey} from "@solana/web3.js";
import TransactionClient from "./src/OrbitTransactionClient";
const TRANSACTION_PROGRAM_ID = new PublicKey(require("./deps/orbit_transaction.json").metadata.address);

export{
    TransactionClient,
    TRANSACTION_PROGRAM_ID
}