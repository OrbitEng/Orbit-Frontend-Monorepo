import * as anchor from '@project-serum/anchor';
import {PublicKey} from "@solana/web3.js";
import { MARKET_ACCOUNTS_PROGRAM_ID} from "./MarketAccountsClient";
import { IDBClient } from 'browser-clients';


const idl = require("../idls/dispute.json");

export var DISPUTE_PROGRAM_ID = new PublicKey(idl.metadata.address);
export var DISPUTE_PROGRAM = new anchor.Program(idl, idl.metadata.address, {});


export async function VoteDispute (
    dispute_addr,
    market_account,
    side,
payer_wallet
){
    if(typeof dispute_addr == "string"){
        dispute_addr = new PublicKey(dispute_addr);
    }
    let vote = {};
    vote[side] = {};

    return DISPUTE_PROGRAM.methods
    .voteDispute(vote)
    .accounts({
        disputeAccount: dispute_addr,
        marketAccount: market_account,
        wallet: payer_wallet.publicKey
    })
    .instruction()
}

export async function CastVerdict (
    dispute_addr
){
    if(typeof dispute_addr == "string"){
        dispute_addr = new PublicKey(dispute_addr);
    }
    let dispute_struct = (await this.GetDispute(dispute_addr)).data;
    
    await DISPUTE_PROGRAM.methods
    .castVerdict()
    .accounts({
        disputeAccount: dispute_addr,
        disputeAuth: this.GenMarketAuth(),
        disputeProgram: DISPUTE_PROGRAM_ID,
        marketAccountsProgram: MARKET_ACCOUNTS_PROGRAM_ID
    })
    .remainingAccounts([
        ...dispute_struct.buyerVotes.map((pk)=>{
            return {
                pubkey: pk,
                isWritable: true,
                isSigner: false,
            }
        }), 
        ...dispute_struct.sellerVotes.map((pk)=>{
            return {
                pubkey: pk,
                isWritable: true,
                isSigner: false,
            }
        })
    ])
    .instruction()
}

//////////////////////////////////
/// GENERATION UTILTIES

export function GenDisputeAddress (tx_addr){
    if(typeof tx_addr == "string"){
        tx_addr = new PublicKey(tx_addr)
    };

    return PublicKey.findProgramAddressSync(
        [
            Buffer.from("dispute_account"),
            tx_addr.toBuffer()
        ],
        DISPUTE_PROGRAM_ID
    )
}

export function GenMarketAuth (){
    return PublicKey.findProgramAddressSync(
        [
            Buffer.from("market_authority")
        ],
        DISPUTE_PROGRAM_ID
    )[0];
}

///////////////////////////////////////////////////
/// ACCESSORS

export async function GetDispute (dispute_addr){
    if(typeof dispute_addr == "string"){
        dispute_addr = new PublicKey(dispute_addr)
    }
    
    return {
        address: dispute_addr,
        data: await DISPUTE_PROGRAM.account.orbitDispute.fetch(dispute_addr),
        type: "OrbitDispute"
    };
}