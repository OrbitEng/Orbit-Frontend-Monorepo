import * as anchor from '@project-serum/anchor';
import {PublicKey} from "@solana/web3.js";
import { MARKET_ACCOUNTS_PROGRAM_ID } from 'orbit-clients/accounts-program';
import { IDBClient } from 'browser-clients';


const idl = require("../idls/dispute.json");

export default class DisputeClient{
    constructor(connection, provider){
        this.programid = new PublicKey(idl.metadata.address);

        this.connection = connection;
        this.provider = provider;
        
        this.program = new anchor.Program(idl, idl.metadata.address, provider);
    };

    VoteDispute = async(
        dispute_addr,
        market_account,
        side,
	payer_wallet
	) =>{
        if(typeof dispute_addr == "string"){
            dispute_addr = new PublicKey(dispute_addr);
        }
        let vote = {};
        vote[side] = {};

        return this.program.methods
        .voteDispute(vote)
        .accounts({
            disputeAccount: dispute_addr,
            marketAccount: market_account,
            wallet: payer_wallet.publicKey
        })
        .instruction()
    }

    CastVerdict = async(
        dispute_addr
    ) =>{
        if(typeof dispute_addr == "string"){
            dispute_addr = new PublicKey(dispute_addr);
        }
        let dispute_struct = (await this.GetDispute(dispute_addr)).data;
        
        await this.program.methods
        .castVerdict()
        .accounts({
            disputeAccount: dispute_addr,
            disputeAuth: this.GenMarketAuth(),
            disputeProgram: this.programid,
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

    GenDisputeAddress = (tx_addr) =>{
        if(typeof tx_addr == "string"){
            tx_addr = new PublicKey(tx_addr)
        };

        return PublicKey.findProgramAddressSync(
            [
                Buffer.from("dispute_account"),
                tx_addr.toBuffer()
            ],
            this.programid
        )
    }

    GenMarketAuth = () => {
        return PublicKey.findProgramAddressSync(
            [
                Buffer.from("market_authority")
            ],
            this.programid
        )[0];
    }

    ///////////////////////////////////////////////////
    /// ACCESSORS

    GetDispute = async (dispute_addr) =>{
        if(typeof dispute_addr == "string"){
            dispute_addr = new PublicKey(dispute_addr)
        }
        
        return {
            address: dispute_addr,
            data: await this.program.account.orbitDispute.fetch(dispute_addr),
            type: "OrbitDispute"
        };
    }
}