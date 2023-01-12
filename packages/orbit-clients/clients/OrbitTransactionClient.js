import * as anchor from '@project-serum/anchor';
import {PublicKey} from "@solana/web3.js";

const idl = require("../idls/orbit_transaction");

export const TRANSACTION_PROGRAM_ID = new PublicKey(idl.metadata.address);
export const TRANSACTION_PROGRAM = new anchor.Program(idl, idl.metadata.address, {});

export async function CreateBuyerTransactionsLog (
    market_type,
payer_wallet
){

    await TRANSACTION_PROGRAM.methods
    .createBuyerTransactionsLog(market_type)
    .accounts({
        transactionsLog: this.GenBuyerTransactionLog(market_type, payer_wallet.publicKey),
        wallet: payer_wallet.publicKey
    })
    .instruction()
}

export async function CreateSellerTransactionsLog (market_type,
    payer_wallet
){

    await TRANSACTION_PROGRAM.methods
    .createSellerTransactionsLog(market_type)
    .accounts({
        transactionsLog: this.GenSellerTransactionLog(market_type, payer_wallet.publicKey),
        wallet: payer_wallet.publicKey,
    })
    .instruction()
}

export async function TransferTransactionsLog (
    tx_log,
    new_owner,
payer_wallet
){
    await TRANSACTION_PROGRAM.methods
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
payer_wallet
){
    let physicalLog;
    let digitalLog;
    let commissionsLog;
    switch(buyer_or_seller){
        case "buyer":
            physicalLog = this.GenBuyerTransactionLog("physical", payer_wallet.publicKey)
            digitalLog = this.GenBuyerTransactionLog("digital", payer_wallet.publicKey)
            commissionsLog = this.GenBuyerTransactionLog("commission", payer_wallet.publicKey)
            break;
        case "seller":
            physicalLog = this.GenSellerTransactionLog("physical", payer_wallet.publicKey)
            digitalLog = this.GenSellerTransactionLog("digital", payer_wallet.publicKey)
            commissionsLog = this.GenSellerTransactionLog("commission", payer_wallet.publicKey)
            break;
    };

    await TRANSACTION_PROGRAM.methods
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
    payer_wallet
){
    return PublicKey.findProgramAddressSync(
        [
            Buffer.from("buyer_transactions"),
            Buffer.from(market_type),
            (typeof payer_wallet == "string" ? new PublicKey(payer_wallet) : payer_wallet).toBuffer()
        ],
        TRANSACTION_PROGRAM_ID
    )[0];
}

export function GenSellerTransactionLog (
    market_type,
    payer_wallet
){
        
    return PublicKey.findProgramAddressSync(
        [
            Buffer.from("seller_transactions"),
            Buffer.from(market_type),
            (typeof payer_wallet == "string" ? new PublicKey(payer_wallet) : payer_wallet).toBuffer()
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
    console.log(tx)
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