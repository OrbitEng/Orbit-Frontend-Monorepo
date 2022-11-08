import * as anchor from '@project-serum/anchor';
import {TOKEN_PROGRAM_ID, getAssociatedTokenAddress} from "./tokenCommon";
import {PublicKey} from "@solana/web3.js";
import {PRODUCT_PROGRAM_ID} from "orbit-clients/product-program";
import {TRANSACTION_PROGRAM_ID} from "orbit-clients/transaction-program";
import {MARKET_ACCOUNTS_PROGRAM_ID} from "orbit-clients/accounts-program";
import { DISPUTE_PROGRAM_ID } from 'orbit-clients/dispute-program';
import { getMultisigWallet, MULTISIG_WALLET_ADDRESS} from 'orbit-clients/multisig';

import idl from "../deps/orbit_physical_market.json";

export default class PhysicalMarketClient{
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

    ////////////////////////////////////////////////////////////////////////////////////////////////
    /// TRANSACTION GENERAL

    /// :SOL
    OpenTransactionSol = async (
        tx_addr,
        sellerIndex,
        vendor_log_address,
        vendor_listings_address,
        
        buyerIndex,
        buyer_log_address,
        buyer_account_address,

        product,
        price,
        
        useDiscount,
    ) =>{
        if(typeof product == "string"){
            product = new PublicKey(product);
        }

        await this.program.methods
        .openTransactionSol(buyerIndex, sellerIndex, new anchor.BN(price), useDiscount)
        .accounts({
            physTransaction: new_physical_tx,
            escrowAccount: this.GenEscrow(new_physical_tx, buyer_log_address),
            physProduct: product,
            buyerTransactionsLog: buyer_log_address,
            buyerMarketAccount: buyer_account_address,
            buyerWallet: this.provider.wallet.publicKey,
            sellerListings: vendor_listings_address,
            sellerTransactionsLog: vendor_log_address,
            physicalAuth: this.GenMarketAuth(),
            physicalProgram: this.programid,
            transactionProgram: TRANSACTION_PROGRAM_ID,
            marketAccountProgram: MARKET_ACCOUNTS_PROGRAM_ID,
            productProgram: PRODUCT_PROGRAM_ID
        })
        .rpc();

        return new_physical_tx.toString()
    };
    
    CloseTransactionSol = async (tx_addr,
        buyer_account_address,
        buyer_wallet,
        seller_account_address,
        seller_wallet,
        reflink_accounts_chain
    ) =>{

        if(typeof tx_addr == "string"){
            tx_addr = new PublicKey(tx_addr_str);
        }
        
        let tx_struct = (await this.GetTransaction(tx_addr)).data;

        let remaining_accs = [];
        if (reflink_accounts_chain){
            remaining_accs = reflink_accounts_chain.map((v)=>{
                return {
                    pubkey: v,
                    isWritable: false,
                    isSigner: false,
                }
            });
    
            remaining_accs[2].isWritable = true;
        };

        await this.program.methods
        .closeTransactionSol()
        .accounts({
            physTransaction: tx_addr,
            escrowAccount: tx_struct.metadata.escrowAccount,
            buyerAccount: buyer_account_address,
            buyerTransactionsLog: tx_struct.buyer,
            buyerWallet: buyer_wallet,
            sellerAccount: seller_account_address,
            sellerTransactionsLog: tx_struct.seller,
            sellerWallet: seller_wallet,
            multisigWallet: MULTISIG_WALLET_ADDRESS,
            physicalAuth: this.GenMarketAuth(),
            physicalProgram: this.programid,
            marketAccountProgram: MARKET_ACCOUNTS_PROGRAM_ID,
            transactionProgram: TRANSACTION_PROGRAM_ID
        })
        .remainingAccounts(remaining_accs)
        .rpc();

        return tx_hash;
    };
    
    FundEscrowSol = async (
        tx_addr_str
    ) =>{
        if(typeof tx_addr == "string"){
            tx_addr = new PublicKey(tx_addr_str);
        }

        let tx_struct = this.GetTransaction(tx_addr);
        
        await this.program.methods
        .fundEscrowSol()
        .accounts({
            physTransaction: tx_addr,
            escrowAccount: tx_struct.metadata.escrow_account,
            buyerTransactionsLog: tx_struct.buyer,
            buyerWallet: this.provider.wallet.publicKey
        })
        .rpc();

        return tx_hash;
    };

    SellerEarlyDeclineSol = async (
        tx_addr_str,

        buyer_wallet,
        buyer_account
    ) =>{

        if(typeof tx_addr == "string"){
            tx_addr = new PublicKey(tx_addr_str);
        }
        let tx_struct = this.GetTransaction(tx_addr);

        await this.program.methods
        .sellerEarlyDeclineSol()
        .accounts({
            physTransaction: tx_addr,
            escrowAccount: tx_struct.metadata.escrowAccount,
            buyerAccount: buyer_account,
            buyerTransactionsLog: tx_struct.buyer,
            buyerWallet: buyer_wallet,
            sellerTransactionsLog: tx_struct.seller,
            sellerWallet: this.provider.wallet.publicKey,
            physicalAuth: this.GenMarketAuth(),
            physicalProgram: this.programid,
            marketAccountProgram: MARKET_ACCOUNTS_PROGRAM_ID,
            transactionProgram: TRANSACTION_PROGRAM_ID
        })
        .rpc()
    };

    /// :SPL
    OpenTransactionSpl = async (
        tx_addr,
        sellerIndex,
        vendor_log_address,
        vendor_listings_address,
        
        buyerIndex,
        buyer_log_address,
        buyer_account_address,

        product,
        product_currency,
        price,
        
        useDiscount,
    ) =>{
        if(typeof product == "string"){
            product = new PublicKey(product);
        }
        
        await this.program.methods
        .openTransactionSpl(sellerIndex, buyerIndex, new anchor.BN(price), useDiscount)
        .accounts({
            physTransaction:tx_addr,
            escrowAccount: this.GenEscrow(tx_addr, buyer_log_address),
            tokenMint: product_currency,
            physProduct: product,
            buyerTransactionsLog: buyer_log_address,
            buyerMarketAccount: buyer_account_address,
            buyerWallet: this.provider.wallet.publicKey,
            sellerListings: vendor_listings_address,
            sellerTransactionsLog: vendor_log_address,
            physicalAuth: this.GenMarketAuth(),
            physicalProgram: this.programid,
            marketAccountProgram: MARKET_ACCOUNTS_PROGRAM_ID,
            tokenProgram: TOKEN_PROGRAM_ID,
            productProgram: PRODUCT_PROGRAM_ID,
            transactionProgram: TRANSACTION_PROGRAM_ID,
        })
        .rpc()

    };


    CloseTransactionSpl = async (
        tx_addr,

        buyer_wallet,
        seller_wallet,

        reflink_accounts_chain
    ) =>{
        if (typeof tx_addr == "string"){
            tx_addr = new PublicKey(tx_addr);
        }

        let tx_struct = (await this.GetTransaction(tx_addr)).data;
        
        let remaining_accs = [];

        if(reflink_accounts_chain){    
            const tokenAccounts = await this.connection.getTokenAccountsByOwner(
                reflink_accounts_chain[2],
                {
                    mint: mint
                }
            );
            if(tokenAccounts.value.length == 0){
                reflink_accounts_chain.push(getAssociatedTokenAddress(
                    mint,
                    reflink_accounts_chain[2]
                ))
            }else{
                reflink_accounts_chain.push(new PublicKey(tokenAccounts.value[0].account.pubkey));
            }

            remaining_accs = reflink_accounts_chain.map((v) => {
                return {
                    pubkey: v,
                    isWritable: false,
                    isSigner: false
                }
            })
    
            remaining_accs[3].isWritable = true;
        }

        await this.program.methods
        .closeTransactionSpl()
        .accounts({
            physTransaction: tx_addr,
            escrowAccount: tx_struct.metadata.escrowAccount,
            buyerAccount: buyer_account,
            buyerTransactionsLog: tx_struct.buyer,
            buyerTokenAccount: getAssociatedTokenAddress(
                tx_struct.metdata.currency,
                buyer_wallet        
            ),
            sellerAccount: seller_account,
            sellerTransactionsLog: tx_struct.seller,
            sellerTokenAccount: getAssociatedTokenAddress(
                tx_struct.metdata.currency,
                seller_wallet        
            ),
            physicalAuth: this.GenMarketAuth(),
            multisigAta: getAssociatedTokenAddress(
                mint,
                MULTISIG_SIGNER_ADDRESS
            ),
            marketAccountProgram: MARKET_ACCOUNTS_PROGRAM_ID,
            physicalProgram: this.programid,
            transactionProgram: TRANSACTION_PROGRAM_ID,
            tokenProgram: TOKEN_PROGRAM_ID
        })
        .remainingAccounts(remaining_accs)
        .rpc()
    };
    
    FundEscrowSpl = async (
        tx_addr,
    ) =>{
        if (typeof tx_addr == "string"){
            tx_addr = new PublicKey(tx_addr);
        }

        let tx_struct = (await this.GetTransaction(tx_addr)).data;

        let tx_hash = await this.program.methods
        .fundEscrowSpl()
        .accounts({
            physTransaction: tx_addr,
            escrowAccount: tx_struct.metadata.escrowAccount,
            buyerTransactionsLog: tx_struct.buyer,
            buyerTokenAccount: getAssociatedTokenAddress(
                tx_struct.metdata.currency,
                this.provider.wallet.publicKey        
            ),
            buyerWallet: this.provider.wallet.publicKey,
            tokenProgram: TOKEN_PROGRAM_ID
        })
        .rpc();

        return tx_hash
    };

    SellerEarlyDeclineSpl = async(
        tx_addr,

        buyer_wallet,
        buyer_account
    )=>{
        if (typeof tx_addr == "string"){
            tx_addr = new PublicKey(tx_addr);
        }

        let tx_struct = (await this.GetTransaction(tx_addr)).data;

        await this.program.methods
        .SellerEarlyDeclineSpl()
        .account({
            physTransaction: tx_addr,
            escrowAccount: tx_struct.metadata.escrowAccount,
            buyerAccount: buyer_account,
            buyerTransactionsLog: tx_struct.buyer,
            buyerTokenAccount:  getAssociatedTokenAddress(
                tx_struct.metdata.currency,
                buyer_wallet        
            ),
            sellerTransactionsLog: tx_struct.seller,
            sellerTokenAccount:  getAssociatedTokenAddress(
                tx_struct.metdata.currency,
                this.provider.wallet.publicKey
            ),
            sellerWallet: this.provider.wallet.publicKey,
            physicalAuth: this.GenMarketAuth(),
            marketAccountProgram: MARKET_ACCOUNTS_PROGRAM_ID,
            physicalProgram: this.programid,
            transactionProgram: TRANSACTION_PROGRAM_ID,
            tokenProgram: TOKEN_PROGRAM_ID
        })
        .rpc()
    };

    //////////////////////////////////////////////////////////////////////////////////////////
    /// DISPUTE
    OpenDispute = async (
        tx_addr,
        dispute_addr,
        threshold,
        
        buyer_account,
        seller_account
    ) =>{
        if(typeof tx_addr == "string"){
            tx_addr = new PublicKey(tx_addr);
        }
        
        await this.program.methods
        .openDispute(new anchor.BN(threshold))
        .accounts({
            physTransaction: tx_addr,
            newDispute: dispute_addr,
            openerWallet: this.provider.wallet.publicKey,
            buyer: buyer_account,
            seller: seller_account,
            physicalAuth: this.GenMarketAuth(),
            disputeProgram: DISPUTE_PROGRAM_ID,
            physicalProgram: this.programid
        })
        .rpc()
    }
    
    CloseDisputeSol = async (
        tx_addr,
        tx_struct,
        dispute_struct,
        dispute_addr,
        
        favor_wallet,
        favor_account,
        
        buyer_wallet,
        buyer_account,
        
        seller_account
        
    ) =>{
        if(typeof tx_addr == "string"){
            tx_addr = new PublicKey(tx_addr);
        }
        
        await this.program.methods
        .closeDisputeSol()
        .accounts({
            physTransaction: tx_addr,
            escrowAccount: tx_struct.metadata.escrowAccount,
            physDispute: dispute_addr,
            favorMarketAccount: favor_account,
            favorWallet: favor_wallet,
            funder: dispute_struct.funder,
            buyerAccount: buyer_account,
            buyerTransactionsLog: tx_struct.buyer,
            buyerWallet: buyer_wallet,
            sellerAccount: seller_account,
            sellerTransactionsLog: tx_struct.seller,
            multisigWallet: MULTISIG_WALLET_ADDRESS,
            physicalAuth: this.GenMarketAuth(),
            physicalProgram: this.programid,
            marketAccountsProgram: MARKET_ACCOUNTS_PROGRAM_ID,
            transactionProgram: TRANSACTION_PROGRAM_ID,
            disputeProgram: DISPUTE_PROGRAM_ID
            
        })
        .rpc()
    }
    CloseDisputeSpl = async (
        tx_addr,
        dispute_addr,
        dispute_funder,
        
        favor_token_account,
        favor_account,
        
        buyer_token_account,
        buyer_account,
        
        seller_account
    ) =>{
        if(typeof tx_addr == "string"){
            tx_addr = new PublicKey(tx_addr);
        }
        
        let tx_struct = (await this.GetTransaction(tx_addr)).data;
        
        await this.program.methods
        .closeDisputeSpl()
        .accounts({
            physTransaction: tx_addr,
            escrowAccount: tx_struct.metadata.escrowAccount,
            physDispute: dispute_addr,
            favorTokenAccount: favor_token_account,
            favorMarketAccount: favor_account,
            funder: dispute_funder,
            buyerAccount: buyer_account,
            buyerTransactionsLog: tx_struct.buyer,
            buyerTokenAccount: buyer_token_account,
            sellerAccount: seller_account,
            sellerTransactionsLog: tx_struct.seller,
            physicalAuth: this.GenMarketAuth(),
            multisigAta: getAssociatedTokenAddress(
                mint,
                MULTISIG_SIGNER_ADDRESS
            ),
            physicalProgram: this.programid,
            disputeProgram: DISPUTE_PROGRAM_ID,
            transactionProgram: TRANSACTION_PROGRAM_ID,
            tokenProgram: TOKEN_PROGRAM_ID,
            marketAccountsProgram: MARKET_ACCOUNTS_PROGRAM_ID
        })
        .rpc()
        }

    ///////////////////////////////////////////////////////////////////////////////////////
    /// GENERAL CALLS
    LeaveReview = async (
        tx_addr,
        review_receiver,
        market_account
    ) =>{
        if(typeof tx_addr == "string"){
            tx_addr = new PublicKey(tx_addr)
        };
        
        return this.program.methods
        .leaveReview()
        .accounts({
            physTransaction: tx_addr,
            reviewedAccount: review_receiver,
            reviewer: market_account,
            wallet: this.provider.wallet.publicKey,
            physAuth: this.GenMarketAuth(),
            physicalProgram: this.programid,
            accountsProgram: MARKET_ACCOUNTS_PROGRAM_ID
        })
        .rpc()
        
    };

    CloseTransactionAccount = async (
        tx_addr,
        tx_log,
        buyer_wallet
    ) =>{

        if (typeof tx_addr == "string"){
            tx_addr = new PublicKey(tx_addr);
        }

        await this.program.methods
        .closeTransactionAccount()
        .accounts({
            physTransaction: tx_addr,
            transactionsLog: tx_log,
            wallet: this.provider.wallet.publicKey,
            buyerWallet: buyer_wallet
        })
        .rpc()

        let tx_closed = await this.idb.ReadKeyValue("physical-tx");
        this.idb.DeleteTransactionIDB("physical-tx", tx_addr.toString());
        this.idb.WriteDatabase("closed-physical-tx", tx_closed)
    };

    ///////////////////////////////////////////////////
    /// UTILS
    GenTransactionAddress = (
        vendor_logs_address,
        tx_index
    ) => {

        if (typeof vendor_logs_address == "string"){
            vendor_logs_address = new PublicKey(vendor_logs_address);
        }

        return PublicKey.findProgramAddressSync(
            [
                Buffer.from("orbit_physical_transaction"),
                vendor_logs_address.toBuffer(),
                Buffer.from([tx_index])
            ],
            this.programid
        )[0]
    }
    
    GenMarketAuth = () => {
        return PublicKey.findProgramAddressSync(
            [
                Buffer.from("market_authority")
            ],
            this.programid
        )[0];
    }

    GenEscrow = (tx_addr, buyer_log_addr) => {
        if(typeof tx_addr == "string"){
            tx_addr = new PublicKey(tx_addr);
        };
        if(typeof buyer_log_addr == "string"){
            buyer_log_addr = new PublicKey(buyer_log_addr);
        };

        return PublicKey.findProgramAddressSync(
            [
                Buffer.from("orbit_escrow_account"),
                tx_addr.toBuffer(),
                buyer_log_addr.toBuffer()
            ],
            this.programid
        )[0];
    }

    
    /// ACCESSORS RPC

    GetTransaction = async (tx_addr) => {
        if(typeof tx_addr == "string"){
            tx_addr = new PublicKey(tx_addr);
        };
        
        try{
            return {
                address: tx_addr,
                data: await this.program.account.physTransaction.fetch(tx_addr),
                type: "PhysicalTransaction"
            };
        }catch{
            return;
        }
    }

    GetMultipleTransactions = async(tx_addrs) =>{
        if(!Array.isArray(tx_addrs)){
            return []
        }
        for(let i = 0; i < tx_addrs.length; i++){
            if(typeof tx_addrs[i] == "string"){
                tx_addrs[i] = new PublicKey(tx_addrs[i]);
            }
        }
        
        return (await this.program.account.physicalProduct.fetchMultiple(products)).map((dat, ind)=>{
            return {
                address: tx_addrs[ind],
                data: dat,
                type: "PhysicalTransaction"
            }
        });
    }
}