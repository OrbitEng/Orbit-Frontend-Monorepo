import {PublicKey} from "@solana/web3.js";
import ProductClient from "./src/OrbitProductClient";
const PRODUCT_PROGRAM_ID = new PublicKey(require("./deps/orbit_product.json").metadata.address);

export{
    ProductClient,
    PRODUCT_PROGRAM_ID
}