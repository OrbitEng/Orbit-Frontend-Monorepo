import * as anchor from '@project-serum/anchor';
import {TOKEN_PROGRAM_ID, getAssociatedTokenAddress} from "@solana/spl-token";
import {PublicKey} from "@solana/web3.js";
import { MARKET_ACCOUNTS_PROGRAM_ID} from "./MarketAccountsClient";
import {PRODUCT_PROGRAM_ID} from "./OrbitProductClient";
import {TRANSACTION_PROGRAM_ID} from "./OrbitTransactionClient";
import { DISPUTE_PROGRAM_ID } from './DisputeClient';
import { MULTISIG_WALLET_ADDRESS} from "./MultisigClient";

import idl from "../idls/orbit_physical_market.json";

export var PHYSICAL_MARKET_PROGRAM_ID = new PublicKey(idl.metadata.address);
export var PHYSICAL_MARKET_PROGRAM = new anchor.Program(idl, idl.metadata.address, {});

////////////////////////////////////////////////////////////////////////////////////////////////
/// TRANSACTION GENERAL

/// :SOL
export async function PhysicalOpenTransactionSol (
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
    payer_wallet
){
    if(typeof product == "string"){
        product = new PublicKey(product);
    }

    await PHYSICAL_MARKET_PROGRAM.methods
    .openTransactionSol(buyerIndex, sellerIndex, new anchor.BN(price), useDiscount)
    .accounts({
        physTransaction: new_physical_tx,
        escrowAccount: this.GenPhysicalEscrow(new_physical_tx, buyer_log_address),
        physProduct: product,
        buyerTransactionsLog: buyer_log_address,
        buyerMarketAccount: buyer_account_address,
        buyerWallet: payer_wallet.publicKey,
        sellerListings: vendor_listings_address,
        sellerTransactionsLog: vendor_log_address,
        physicalAuth: this.GenPhysicalMarketAuth(),
        physicalProgram: PHYSICAL_MARKET_PROGRAM_ID,
        transactionProgram: TRANSACTION_PROGRAM_ID,
        marketAccountProgram: MARKET_ACCOUNTS_PROGRAM_ID,
        productProgram: PRODUCT_PROGRAM_ID
    })
    .instruction();

    return new_physical_tx.toString()
};

export async function PhysicalCloseTransactionSol (tx_addr,
    buyer_account_address,
    buyer_wallet,
    seller_account_address,
    seller_wallet,
    reflink_accounts_chain
){

    if(typeof tx_addr == "string"){
        tx_addr = new PublicKey(tx_addr_str);
    }
    
    let tx_struct = (await this.GetPhysicalTransaction(tx_addr)).data;

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

    await PHYSICAL_MARKET_PROGRAM.methods
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
        physicalAuth: this.GenPhysicalMarketAuth(),
        physicalProgram: PHYSICAL_MARKET_PROGRAM_ID,
        marketAccountProgram: MARKET_ACCOUNTS_PROGRAM_ID,
        transactionProgram: TRANSACTION_PROGRAM_ID
    })
    .remainingAccounts(remaining_accs)
    .instruction();

    return tx_hash;
};

export async function PhysicalFundEscrowSol (
    tx_addr_str,
    payer_wallet
){
    if(typeof tx_addr == "string"){
        tx_addr = new PublicKey(tx_addr_str);
    }

    let tx_struct = this.GetPhysicalTransaction(tx_addr);
    
    await PHYSICAL_MARKET_PROGRAM.methods
    .fundEscrowSol()
    .accounts({
        physTransaction: tx_addr,
        escrowAccount: tx_struct.metadata.escrow_account,
        buyerTransactionsLog: tx_struct.buyer,
        buyerWallet: payer_wallet.publicKey
    })
    .instruction();

    return tx_hash;
};

export async function PhysicalSellerEarlyDeclineSol (
    tx_addr_str,

    buyer_wallet,
    buyer_account,
payer_wallet
){

    if(typeof tx_addr == "string"){
        tx_addr = new PublicKey(tx_addr_str);
    }
    let tx_struct = this.GetPhysicalTransaction(tx_addr);

    await PHYSICAL_MARKET_PROGRAM.methods
    .sellerEarlyDeclineSol()
    .accounts({
        physTransaction: tx_addr,
        escrowAccount: tx_struct.metadata.escrowAccount,
        buyerAccount: buyer_account,
        buyerTransactionsLog: tx_struct.buyer,
        buyerWallet: buyer_wallet,
        sellerTransactionsLog: tx_struct.seller,
        sellerWallet: payer_wallet.publicKey,
        physicalAuth: this.GenPhysicalMarketAuth(),
        physicalProgram: PHYSICAL_MARKET_PROGRAM_ID,
        marketAccountProgram: MARKET_ACCOUNTS_PROGRAM_ID,
        transactionProgram: TRANSACTION_PROGRAM_ID
    })
    .instruction()
};

/// :SPL
export async function PhysicalOpenTransactionSpl (
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
    payer_wallet
){
    if(typeof product == "string"){
        product = new PublicKey(product);
    }
    
    await PHYSICAL_MARKET_PROGRAM.methods
    .openTransactionSpl(sellerIndex, buyerIndex, new anchor.BN(price), useDiscount)
    .accounts({
        physTransaction:tx_addr,
        escrowAccount: this.GenPhysicalEscrow(tx_addr, buyer_log_address),
        tokenMint: product_currency,
        physProduct: product,
        buyerTransactionsLog: buyer_log_address,
        buyerMarketAccount: buyer_account_address,
        buyerWallet: payer_wallet.publicKey,
        sellerListings: vendor_listings_address,
        sellerTransactionsLog: vendor_log_address,
        physicalAuth: this.GenPhysicalMarketAuth(),
        physicalProgram: PHYSICAL_MARKET_PROGRAM_ID,
        marketAccountProgram: MARKET_ACCOUNTS_PROGRAM_ID,
        tokenProgram: TOKEN_PROGRAM_ID,
        productProgram: PRODUCT_PROGRAM_ID,
        transactionProgram: TRANSACTION_PROGRAM_ID,
    })
    .instruction()

};


export async function PhysicalCloseTransactionSpl (
    tx_addr,

    buyer_wallet,
    seller_wallet,

    reflink_accounts_chain
){
    if (typeof tx_addr == "string"){
        tx_addr = new PublicKey(tx_addr);
    }

    let tx_struct = (await this.GetPhysicalTransaction(tx_addr)).data;
    
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

    await PHYSICAL_MARKET_PROGRAM.methods
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
        physicalAuth: this.GenPhysicalMarketAuth(),
        multisigAta: getAssociatedTokenAddress(
            mint,
            MULTISIG_SIGNER_ADDRESS
        ),
        marketAccountProgram: MARKET_ACCOUNTS_PROGRAM_ID,
        physicalProgram: PHYSICAL_MARKET_PROGRAM_ID,
        transactionProgram: TRANSACTION_PROGRAM_ID,
        tokenProgram: TOKEN_PROGRAM_ID
    })
    .remainingAccounts(remaining_accs)
    .instruction()
};

export async function PhysicalFundEscrowSpl (
    tx_addr,
    payer_wallet
){
    if (typeof tx_addr == "string"){
        tx_addr = new PublicKey(tx_addr);
    }

    let tx_struct = (await this.GetPhysicalTransaction(tx_addr)).data;

    let tx_hash = await PHYSICAL_MARKET_PROGRAM.methods
    .fundEscrowSpl()
    .accounts({
        physTransaction: tx_addr,
        escrowAccount: tx_struct.metadata.escrowAccount,
        buyerTransactionsLog: tx_struct.buyer,
        buyerTokenAccount: getAssociatedTokenAddress(
            tx_struct.metdata.currency,
            payer_wallet.publicKey        
        ),
        buyerWallet: this.provider.wallet.publicKey,
        tokenProgram: TOKEN_PROGRAM_ID
    })
    .instruction();

    return tx_hash
};

export async function PhysicalSellerEarlyDeclineSpl (
    tx_addr,

    buyer_wallet,
    buyer_account,
payer_wallet
){
    if (typeof tx_addr == "string"){
        tx_addr = new PublicKey(tx_addr);
    }

    let tx_struct = (await this.GetPhysicalTransaction(tx_addr)).data;

    await PHYSICAL_MARKET_PROGRAM.methods
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
            payer_wallet.publicKey
        ),
        sellerWallet: this.provider.wallet.publicKey,
        physicalAuth: this.GenPhysicalMarketAuth(),
        marketAccountProgram: MARKET_ACCOUNTS_PROGRAM_ID,
        physicalProgram: PHYSICAL_MARKET_PROGRAM_ID,
        transactionProgram: TRANSACTION_PROGRAM_ID,
        tokenProgram: TOKEN_PROGRAM_ID
    })
    .instruction()
};

//////////////////////////////////////////////////////////////////////////////////////////
/// DISPUTE
export async function PhysicalOpenDispute (
    tx_addr,
    dispute_addr,
    threshold,
    
    buyer_account,
    seller_account,
payer_wallet
){
    
    await PHYSICAL_MARKET_PROGRAM.methods
    .openDispute(new anchor.BN(threshold))
    .accounts({
        physTransaction: typeof tx_addr == "string" ? tx_addr : new PublicKey(tx_addr),
        newDispute: dispute_addr,
        openerWallet: payer_wallet.publicKey,
        buyer: buyer_account,
        seller: seller_account,
        physicalAuth: this.GenPhysicalMarketAuth(),
        disputeProgram: DISPUTE_PROGRAM_ID,
        physicalProgram: PHYSICAL_MARKET_PROGRAM_ID
    })
    .instruction()
}

export async function PhysicalCloseDisputeSol (
    tx_addr,
    tx_struct,
    dispute_struct,
    dispute_addr,
    
    favor_wallet,
    favor_account,
    
    buyer_wallet,
    buyer_account,
    
    seller_account
){
    
    await PHYSICAL_MARKET_PROGRAM.methods
    .closeDisputeSol()
    .accounts({
        physTransaction: typeof tx_addr == "string" ? tx_addr : new PublicKey(tx_addr),
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
        physicalAuth: this.GenPhysicalMarketAuth(),
        physicalProgram: PHYSICAL_MARKET_PROGRAM_ID,
        marketAccountsProgram: MARKET_ACCOUNTS_PROGRAM_ID,
        transactionProgram: TRANSACTION_PROGRAM_ID,
        disputeProgram: DISPUTE_PROGRAM_ID
        
    })
    .instruction()
}
export async function PhysicalCloseDisputeSpl (
    tx_addr,
    dispute_addr,
    dispute_funder,
    
    favor_token_account,
    favor_account,
    
    buyer_token_account,
    buyer_account,
    
    seller_account
){
    if(typeof tx_addr == "string"){
        tx_addr = new PublicKey(tx_addr);
    }
    
    let tx_struct = (await this.GetPhysicalTransaction(tx_addr)).data;
    
    await PHYSICAL_MARKET_PROGRAM.methods
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
        physicalAuth: this.GenPhysicalMarketAuth(),
        multisigAta: getAssociatedTokenAddress(
            mint,
            MULTISIG_SIGNER_ADDRESS
        ),
        physicalProgram: PHYSICAL_MARKET_PROGRAM_ID,
        disputeProgram: DISPUTE_PROGRAM_ID,
        transactionProgram: TRANSACTION_PROGRAM_ID,
        tokenProgram: TOKEN_PROGRAM_ID,
        marketAccountsProgram: MARKET_ACCOUNTS_PROGRAM_ID
    })
    .instruction()
    }

///////////////////////////////////////////////////////////////////////////////////////
/// GENERAL CALLS
export async function PhysicalLeaveReview (
    tx_addr,
    review_receiver,
    market_account,
    payer_wallet
){
    if(typeof tx_addr == "string"){
        tx_addr = new PublicKey(tx_addr)
    };
    
    return PHYSICAL_MARKET_PROGRAM.methods
    .leaveReview()
    .accounts({
        physTransaction: tx_addr,
        reviewedAccount: review_receiver,
        reviewer: market_account,
        wallet: payer_wallet.publicKey,
        physAuth: this.GenPhysicalMarketAuth(),
        physicalProgram: PHYSICAL_MARKET_PROGRAM_ID,
        accountsProgram: MARKET_ACCOUNTS_PROGRAM_ID
    })
    .instruction()
    
};

export async function PhysicalCloseTransactionAccount (
    tx_addr,
    tx_log,
    buyer_wallet,
payer_wallet
){

    if (typeof tx_addr == "string"){
        tx_addr = new PublicKey(tx_addr);
    }

    await PHYSICAL_MARKET_PROGRAM.methods
    .closeTransactionAccount()
    .accounts({
        physTransaction: tx_addr,
        transactionsLog: tx_log,
        wallet: payer_wallet.publicKey,
        buyerWallet: buyer_wallet
    })
    .instruction()

    let tx_closed = await this.idb.ReadKeyValue("physical-tx");
    this.idb.DeleteTransactionIDB("physical-tx", tx_addr.toString());
    this.idb.WriteDatabase("closed-physical-tx", tx_closed)
};

///////////////////////////////////////////////////
/// UTILS
export function GenPhysicalTransactionAddress (
    vendor_logs_address,
    tx_index
){

    if (typeof vendor_logs_address == "string"){
        vendor_logs_address = new PublicKey(vendor_logs_address);
    }

    return PublicKey.findProgramAddressSync(
        [
            Buffer.from("orbit_physical_transaction"),
            vendor_logs_address.toBuffer(),
            Buffer.from([tx_index])
        ],
        PHYSICAL_MARKET_PROGRAM_ID
    )[0]
}

export function GenPhysicalMarketAuth (){
    return PublicKey.findProgramAddressSync(
        [
            Buffer.from("market_authority")
        ],
        PHYSICAL_MARKET_PROGRAM_ID
    )[0];
}

export function GenPhysicalEscrow (tx_addr, buyer_log_addr){
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
        PHYSICAL_MARKET_PROGRAM_ID
    )[0];
}


/// ACCESSORS RPC

export async function GetPhysicalTransaction (tx_addr){
    if(typeof tx_addr == "string"){
        tx_addr = new PublicKey(tx_addr);
    };
    
    try{
        return {
            address: tx_addr,
            data: await PHYSICAL_MARKET_PROGRAM.account.physTransaction.fetch(tx_addr),
            type: "PhysicalTransaction"
        };
    }catch{
        return;
    }
}

export async function GetMultiplePhysicalTransactions (tx_addrs){
    if(!Array.isArray(tx_addrs)){
        return []
    }
    for(let i = 0; i < tx_addrs.length; i++){
        if(typeof tx_addrs[i] == "string"){
            tx_addrs[i] = new PublicKey(tx_addrs[i]);
        }
    }
    
    return (await PHYSICAL_MARKET_PROGRAM.account.physicalProduct.fetchMultiple(products)).map((dat, ind)=>{
        return {
            address: tx_addrs[ind],
            data: dat,
            type: "PhysicalTransaction"
        }
    });
}