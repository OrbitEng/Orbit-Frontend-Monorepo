import * as anchor from '@project-serum/anchor';
import {PublicKey} from "@solana/web3.js";
import { MARKET_ACCOUNTS_PROGRAM_ID } from './MarketAccountsClient';

const idl = require("../idls/orbit_transaction");

export var TRANSACTION_PROGRAM_ID = new PublicKey(idl.metadata.address);
export var TRANSACTION_PROGRAM = new anchor.Program(idl, idl.metadata.address, {});
export function SetProgramWallet(prov){
    TRANSACTION_PROGRAM = new anchor.Program(idl, idl.metadata.address, prov);
}

/// INIT LOGS
//// BUYER

export async function CreateCommissionsBuyerTransactionsLog (
    payer_wallet,
    user_account
){

    return TRANSACTION_PROGRAM.methods
    .createBuyerCommissionsTransactions()
    .accounts({
        transactionsLog: this.GenBuyerTransactionLog("commission", voter_id),
        buyerAccount: user_account.address,
        wallet: payer_wallet.publicKey,
        accountsProgram: MARKET_ACCOUNTS_PROGRAM_ID
    })
    .instruction()
}

export async function CreateDigitalBuyerTransactionsLog (
    payer_wallet,
    user_account
){

    return TRANSACTION_PROGRAM.methods
    .createBuyerDigitalTransactions()
    .accounts({
        transactionsLog: this.GenBuyerTransactionLog("digital", voter_id),
        buyerAccount: user_account.address,
        wallet: payer_wallet.publicKey,
        accountsProgram: MARKET_ACCOUNTS_PROGRAM_ID
    })
    .instruction()
}

export async function CreatePhysicalBuyerTransactionsLog (
    payer_wallet,
    user_account
){

    return TRANSACTION_PROGRAM.methods
    .createBuyerPhysicalTransactions()
    .accounts({
        transactionsLog: this.GenBuyerTransactionLog("physical", voter_id),
        buyerAccount: user_account.address,
        wallet: payer_wallet.publicKey,
        accountsProgram: MARKET_ACCOUNTS_PROGRAM_ID
    })
    .instruction()
}

//// SELLER

export async function CreateCommissionsTransactionsLog (
    payer_wallet,
    user_account
){

    return TRANSACTION_PROGRAM.methods
    .createSellerCommissionsTransactions()
    .accounts({
        transactionsLog: this.GenSellerTransactionLog("commission", user_account.data.voterId),
        sellerAccount: user_account.address,
        wallet: payer_wallet.publicKey,
        accountsProgram: MARKET_ACCOUNTS_PROGRAM_ID
    })
    .instruction()
}

export async function CreateDigitalSellerTransactionsLog (
    payer_wallet,
    user_account
){

    return TRANSACTION_PROGRAM.methods
    .createSellerDigitalTransactions()
    .accounts({
        transactionsLog: this.GenSellerTransactionLog("digital", user_account.data.voterId),
        sellerAccount: user_account.address,
        wallet: payer_wallet.publicKey,
        accountsProgram: MARKET_ACCOUNTS_PROGRAM_ID
    })
    .instruction()
}

export async function CreatePhysicalSellerTransactionsLog (
    payer_wallet,
    user_account
){

    return TRANSACTION_PROGRAM.methods
    .createSellerPhysicalTransactions()
    .accounts({
        transactionsLog: this.GenSellerTransactionLog("physical", user_account.data.voterId),
        sellerAccount: user_account.address,
        wallet: payer_wallet.publicKey,
        accountsProgram: MARKET_ACCOUNTS_PROGRAM_ID
    })
    .instruction()
}

////////////////////////////////////////
// TRANSFER

export async function TransferTransactionsLog (
    tx_log,
    new_owner,
payer_wallet
){
    return TRANSACTION_PROGRAM.methods
    .transferTransactionsLog()
    .accounts({
        transactionsLog: tx_log,
        newOwner: new_owner,
        wallet: payer_wallet.publicKey
    })
    .instruction()
}

export async function TransferAllTransactionsLog (
    new_owner,
    buyer_or_seller,
    payer_wallet,
    voter_id
){
    let physicalLog;
    let digitalLog;
    let commissionsLog;
    switch(buyer_or_seller){
        case "buyer":
            physicalLog = this.GenBuyerTransactionLog("physical", voter_id)
            digitalLog = this.GenBuyerTransactionLog("digital", voter_id)
            commissionsLog = this.GenBuyerTransactionLog("commission", voter_id)
            break;
        case "seller":
            physicalLog = this.GenSellerTransactionLog("physical", voter_id)
            digitalLog = this.GenSellerTransactionLog("digital", voter_id)
            commissionsLog = this.GenSellerTransactionLog("commission", voter_id)
            break;
    };

    return TRANSACTION_PROGRAM.methods
    .transferAllTransactionsLog()
    .accounts({
        physicalLog: physicalLog,
        digitalLog: digitalLog,
        commissionsLog: commissionsLog,
        newOwner: new_owner,
        wallet: payer_wallet.publicKey
    })
    .instruction()
}

//////////////////////////////////////////////////
/// GENERATION UTILS

export function GenBuyerTransactionLog (
    market_type,
    voter_id
){
    return PublicKey.findProgramAddressSync(
        [
            Buffer.from("buyer_transactions"),
            Buffer.from(market_type),
            voter_id.toArray("le",8)
        ],
        TRANSACTION_PROGRAM_ID
    )[0];
}

export function GenSellerTransactionLog (
    market_type,
    voter_id
){
        
    return PublicKey.findProgramAddressSync(
        [
            Buffer.from("seller_transactions"),
            Buffer.from(market_type),
            voter_id.toArray("le",8)
        ],
        TRANSACTION_PROGRAM_ID
    )[0];
}

//////////////////////////////////////////////////
/// STRUCT FETCHING

export async function GetBuyerOpenTransactions (address){
    return {
        address: address,
        data: await TRANSACTION_PROGRAM.account.buyerOpenTransactions.fetch(address),
        type: "BuyerTransactions"
    };
}
export async function GetSellerOpenTransactions (address){
    return {
        address: address,
        data: await TRANSACTION_PROGRAM.account.sellerOpenTransactions.fetch(address),
        type: "SellerTransactions"
    };
}

/// GENERAL RPC UTILS (really scuffed but >:D)
export async function GetTransactionSeller (tx_addr){
    if(typeof tx_addr == "string"){
        tx_addr = new PublicKey(tx_addr)
    }
    let tx = await this.connection.getAccountInfo(tx_addr);
    return new PublicKey(tx.data.slice(40,72))
}

export async function GetMultipleTransactionSeller (tx_addrs){
    let txs = await this.connection.getMultipleAccountsInfo(tx_addrs);
    return txs.map(tx => new PublicKey(tx.data.slice(40,72)))
}

export async function GetTransactionBuyer (tx_addr){
    if(typeof tx_addr == "string"){
        tx_addr = new PublicKey(tx_addr)
    }
    let tx = await this.connection.getAccountInfo(tx_addr);
    console.log(tx)
    return new PublicKey(tx.data.slice(8,40))
}

export async function GetMultipleTransactionBuyer (tx_addrs){
    let txs = await this.connection.getMultipleAccountsInfo(tx_addrs);
    return txs.map(tx =>new PublicKey( tx.data.slice(8,40)))
}

export async function GetMultipleTxLogOwners (log_addrs){
    let logs = await this.connection.getMultipleAccountsInfo(log_addrs);
    return logs.map(log => new PublicKey(log.data.slice(40,72)))
}



//////////////////////////////////////////////////
/// UTILS

export async function FindNextOpenBuyerTransaction (
    log_addr
){
    let log_struct = (await this.GetBuyerOpenTransactions(log_addr)).data;
    let indexes = log_struct.indices[0].toString(2).split("").reverse().join("") + log_struct.indices[1].toString(2).split("").reverse().join("") + log_struct.indices[2].toString(2).toString(2).split("").reverse().join("")
    return indexes.indexOf("0");
}

export async function FindNextOpenSellerTransaction (
    log_addr
){
    let log_struct = (await this.GetSellerOpenTransactions(log_addr)).data;
    let indexes = log_struct.openTransactions[0].toString(2).split("").reverse().join("") + log_struct.openTransactions[1].toString(2).split("").reverse().join("") + log_struct.openTransactions[2].toString(2).split("").reverse().join("") + log_struct.openTransactions[3].toString(2).toString(2).split("").reverse().join("")
    return indexes.indexOf("0");
}