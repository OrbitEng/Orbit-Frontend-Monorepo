import * as anchor from '@project-serum/anchor';
import {PublicKey} from "@solana/web3.js";
import {TOKEN_PROGRAM_ID, getAssociatedTokenAddress} from "./tokenCommon";
import {PRODUCT_PROGRAM_ID} from "orbit-clients/product-program";
import {TRANSACTION_PROGRAM_ID} from "orbit-clients/transaction-program";
import {MARKET_ACCOUNTS_PROGRAM_ID} from "orbit-clients/accounts-program";
import { getMultisigWallet, MULTISIG_WALLET_ADDRESS} from "orbit-clients/multisig";

export default class SearchProgramClient{
    
}