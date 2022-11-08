import * as anchor from '@project-serum/anchor';
import {PublicKey} from "@solana/web3.js";

const idl = require("../deps/orbit_transaction");

export default class TransactionClient{
    constructor(connection, provider){
        this.programid = new PublicKey(idl.metadata.address);

        
        
        if(connection){
            this.connection = connection;
        }

        if(provider){
            this.provider = provider;
        }
        
        this.program = new anchor.Program(idl, idl.metadata.address, provider);
    };

    CreateBuyerTransactionsLog = async(
        market_type
    ) => {

        await this.program.methods
        .createBuyerTransactionsLog(market_type)
        .accounts({
            transactionsLog: this.GenBuyerTransactionLog(market_type),
            wallet: this.provider.wallet.publicKey
        })
        .rpc()
    }

    CreateSellerTransactionsLog = async(market_type) => {

        await this.program.methods
        .createSellerTransactionsLog(market_type)
        .accounts({
            transactionsLog: this.GenSellerTransactionLog(market_type),
            wallet: this.provider.wallet.publicKey,
        })
        .rpc()
    }

    TransferTransactionsLog = async(
        tx_log,
        new_owner
    ) => {
        await this.program.methods
        .transferTransactionsLog()
        .accounts({
            transactionsLog: tx_log,
            newOwner: new_owner,
            wallet: this.provider.wallet.publicKey
        })
        .rpc()
    }

    TransferAllTransactionsLog = async(
        new_owner,
        buyer_or_seller
    ) => {
        let physicalLog;
        let digitalLog;
        let commissionsLog;
        switch(buyer_or_seller){
            case "buyer":
                physicalLog = this.GenBuyerTransactionLog("physical")
                digitalLog = this.GenBuyerTransactionLog("digital")
                commissionsLog = this.GenBuyerTransactionLog("commission")
                break;
            case "seller":
                physicalLog = this.GenSellerTransactionLog("physical")
                digitalLog = this.GenSellerTransactionLog("digital")
                commissionsLog = this.GenSellerTransactionLog("commission")
                break;
        };

        await this.program.methods
        .transferAllTransactionsLog()
        .accounts({
            physicalLog: physicalLog,
            digitalLog: digitalLog,
            commissionsLog: commissionsLog,
            newOwner: new_owner,
            wallet: this.provider.wallet.publicKey
        })
        .rpc()
    }

    //////////////////////////////////////////////////
    /// GENERATION UTILS

    GenBuyerTransactionLog = (market_type, wallet) => {
        if(!wallet){
            wallet = this.provider.wallet.publicKey
        }
        if(typeof wallet == "string"){
            wallet = new PublicKey(wallet)
        }
        return PublicKey.findProgramAddressSync(
            [
                Buffer.from("buyer_transactions"),
                Buffer.from(market_type),
                wallet.toBuffer()
            ],
            this.programid
        )[0];
    }

    GenSellerTransactionLog = (market_type, wallet) => {
        if(!wallet){
            wallet = this.provider.wallet.publicKey
        }
        if(typeof wallet == "string"){
            wallet = new PublicKey(wallet)
        }
            
        return PublicKey.findProgramAddressSync(
            [
                Buffer.from("seller_transactions"),
                Buffer.from(market_type),
                wallet.toBuffer()
            ],
            this.programid
        )[0];
    }

    //////////////////////////////////////////////////
    /// STRUCT FETCHING

    GetBuyerOpenTransactions = async(address) =>{
        return {
            address: address,
            data: await this.program.account.buyerOpenTransactions.fetch(address),
            type: "BuyerTransactions"
        };
    }
    GetSellerOpenTransactions = async(address) =>{
        return {
            address: address,
            data: await this.program.account.sellerOpenTransactions.fetch(address),
            type: "SellerTransactions"
        };
    }

    /// GENERAL RPC UTILS (really scuffed but >:D)
    GetTransactionSeller = async(tx_addr) => {
        if(typeof tx_addr == "string"){
            tx_addr = new PublicKey(tx_addr)
        }
        let tx = await this.connection.getAccountInfo(tx_addr);
        console.log(tx)
        return new PublicKey(tx.data.slice(40,72))
    }

    GetMultipleTransactionSeller = async(tx_addrs) => {
        let txs = await this.connection.getMultipleAccountsInfo(tx_addrs);
        return txs.map(tx => new PublicKey(tx.data.slice(40,72)))
    }

    GetTransactionBuyer = async(tx_addr) => {
        if(typeof tx_addr == "string"){
            tx_addr = new PublicKey(tx_addr)
        }
        let tx = await this.connection.getAccountInfo(tx_addr);
        console.log(tx)
        return new PublicKey(tx.data.slice(8,40))
    }

    GetMultipleTransactionBuyer = async(tx_addrs) => {
        let txs = await this.connection.getMultipleAccountsInfo(tx_addrs);
        return txs.map(tx =>new PublicKey( tx.data.slice(8,40)))
    }

    GetMultipleTxLogOwners = async(log_addrs) => {
        let logs = await this.connection.getMultipleAccountsInfo(log_addrs);
        return logs.map(log => new PublicKey(log.data.slice(40,72)))
    }

    

    //////////////////////////////////////////////////
    /// UTILS

    FindNextOpenBuyerTransaction = async(
        log_addr
    ) => {
        let log_struct = (await this.GetBuyerOpenTransactions(log_addr)).data;
        let indexes = log_struct.indices[0].toString(2).split("").reverse().join("") + log_struct.indices[1].toString(2).split("").reverse().join("") + log_struct.indices[2].toString(2).toString(2).split("").reverse().join("")
        return indexes.indexOf("0");
    }

    FindNextOpenSellerTransaction = async(
        log_addr
    ) => {
        let log_struct = (await this.GetSellerOpenTransactions(log_addr)).data;
        let indexes = log_struct.openTransactions[0].toString(2).split("").reverse().join("") + log_struct.openTransactions[1].toString(2).split("").reverse().join("") + log_struct.openTransactions[2].toString(2).split("").reverse().join("") + log_struct.openTransactions[3].toString(2).toString(2).split("").reverse().join("")
        return indexes.indexOf("0");
    }
}