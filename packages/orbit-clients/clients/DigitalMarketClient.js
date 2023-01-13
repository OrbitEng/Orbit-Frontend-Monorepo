import * as anchor from '@project-serum/anchor';
import {TOKEN_PROGRAM_ID, getAssociatedTokenAddress} from "@solana/spl-token";
import {PublicKey} from "@solana/web3.js";
import { MARKET_ACCOUNTS_PROGRAM_ID} from "./MarketAccountsClient";
import {PRODUCT_PROGRAM_ID} from "./OrbitProductClient";
import {TRANSACTION_PROGRAM_ID} from "./OrbitTransactionClient";
import { MULTISIG_WALLET_ADDRESS} from "./MultisigClient";

import idl from "../idls/orbit_digital_market.json";

export const DIGITAL_MARKET_PROGRAM_ID = new PublicKey(idl.metadata.address);
export const DIGITAL_MARKET_PROGRAM = new anchor.Program(idl, idl.metadata.address, {});

////////////////////////////////////////
/// TRANSACTIONS

/// :SOL
export async function DigitalOpenTransactionSol (
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

        await DIGITAL_MARKET_PROGRAM.methods
        .openTransactionSol(sellerIndex, buyerIndex, new anchor.BN(price), useDiscount)
        .accounts({
            digitalTransaction: tx_addr,
            escrowAccount: this.GenDigitalEscrow(tx_addr, buyer_log_address),
            digitalProduct: product,
            buyerTransactionsLog: buyer_log_address,
            buyerMarketAccount: buyer_account_address,
            buyerWallet: payer_wallet.publicKey,
            sellerListings: vendor_listings_address,
            sellerTransactionsLog: vendor_log_address,
            digitalAuth: this.GenDigitalMarketAuth(),
            digitalProgram: DIGITAL_MARKET_PROGRAM_ID,
            transactionProgram: TRANSACTION_PROGRAM_ID,
            marketAccountProgram: MARKET_ACCOUNTS_PROGRAM_ID,
            productProgram: PRODUCT_PROGRAM_ID
        })
        .instruction();
};

export async function DigitalCloseTransactionSol (
    tx_addr,
    tx_struct,
    buyer_account_address,
    buyer_wallet,
    seller_account_address,
    seller_wallet,
    reflink_accounts_chain
){

    if(typeof tx_addr == "string"){
        tx_addr = new PublicKey(tx_addr_str);
    }

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

    await DIGITAL_MARKET_PROGRAM.methods
    .closeTransactionSol()
    .accounts({
        digitalTransaction: tx_addr,
        escrowAccount: tx_struct.metadata.escrowAccount,
        buyerAccount: buyer_account_address,
        buyerTransactionsLog: tx_struct.buyer,
        buyerWallet: buyer_wallet,
        sellerAccount: seller_account_address,
        sellerTransactionsLog: tx_struct.seller,
        sellerWallet: seller_wallet,
        multisigWallet: MULTISIG_WALLET_ADDRESS,
        digitalAuth: this.GenDigitalMarketAuth(),
        digitalProgram: DIGITAL_MARKET_PROGRAM_ID,
        marketAccountProgram: MARKET_ACCOUNTS_PROGRAM_ID,
        transactionProgram: TRANSACTION_PROGRAM_ID
    })
    .remainingAccounts(remaining_accs)
    .instruction();

    return tx_hash;
};

export async function DigitalFundEscrowSol (
    tx_addr_str,
    payer_wallet
){
    if(typeof tx_addr == "string"){
        tx_addr = new PublicKey(tx_addr_str);
    }

    let tx_struct = this.GetDigitalTransaction(tx_addr);

    await DIGITAL_MARKET_PROGRAM.methods
    .fundEscrowSol()
    .accounts({
        digitalTransaction: tx_addr,
        escrowAccount: tx_struct.metadata.escrow_account,
        buyerTransactionsLog: tx_struct.buyer,
        buyerWallet: payer_wallet.publicKey
    })
    .instruction();
};

export async function DigitalSellerEarlyDeclineSol (
    tx_addr_str,

    buyer_wallet,
    buyer_account,
payer_wallet
){

    if(typeof tx_addr == "string"){
        tx_addr = new PublicKey(tx_addr_str);
    }
    let tx_struct = this.GetDigitalTransaction(tx_addr);

    await DIGITAL_MARKET_PROGRAM.methods
    .sellerEarlyDeclineSol()
    .accounts({
        digitalTransaction: tx_addr,
        escrowAccount: tx_struct.metadata.escrowAccount,
        buyerAccount: buyer_account,
        buyerTransactionsLog: tx_struct.buyer,
        buyerWallet: buyer_wallet,
        sellerTransactionsLog: tx_struct.seller,
        sellerWallet: payer_wallet.publicKey,
        digitalAuth: this.GenDigitalMarketAuth(),
        digitalProgram: DIGITAL_MARKET_PROGRAM_ID,
        marketAccountProgram: MARKET_ACCOUNTS_PROGRAM_ID,
        transactionProgram: TRANSACTION_PROGRAM_ID
    })
    .instruction()
}

/// :SPL
export async function DigitalOpenTransactionSpl (
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
    
    await DIGITAL_MARKET_PROGRAM.methods
    .openTransactionSpl(sellerIndex, buyerIndex, new anchor.BN(price), useDiscount)
    .accounts({
        digitalTransaction:tx_addr,
        escrowAccount: this.GenDigitalEscrow(tx_addr, buyer_log_address),
        tokenMint: product_currency,
        digitalProduct: product,
        buyerTransactionsLog: buyer_log_address,
        buyerMarketAccount: buyer_account_address,
        buyerWallet: payer_wallet.publicKey,
        sellerListings: vendor_listings_address,
        sellerTransactionsLog: vendor_log_address,
        digitalAuth: this.GenDigitalMarketAuth(),
        digitalProgram: DIGITAL_MARKET_PROGRAM_ID,
        marketAccountProgram: MARKET_ACCOUNTS_PROGRAM_ID,
        tokenProgram: TOKEN_PROGRAM_ID,
        productProgram: PRODUCT_PROGRAM_ID,
        transactionProgram: TRANSACTION_PROGRAM_ID
    })
    .instruction()

};

export async function DigitalCloseTransactionSpl (
    tx_addr,

    buyer_wallet,
    seller_wallet,

    reflink_accounts_chain
){
    if (typeof tx_addr == "string"){
        tx_addr = new PublicKey(tx_addr);
    }

    let tx_struct = (await this.GetDigitalTransaction(tx_addr)).data;
    
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

    await DIGITAL_MARKET_PROGRAM.methods
    .closeTransactionSpl()
    .accounts({
        digitalTransaction: tx_addr,
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
        digitalAuth: this.GenDigitalMarketAuth(),
        multisigAta: getAssociatedTokenAddress(
            mint,
            MULTISIG_SIGNER_ADDRESS
        ),
        marketAccountProgram: MARKET_ACCOUNTS_PROGRAM_ID,
        digitalProgram: DIGITAL_MARKET_PROGRAM_ID,
        transactionProgram: TRANSACTION_PROGRAM_ID,
        tokenProgram: TOKEN_PROGRAM_ID
    })
    .remainingAccounts(remaining_accs)
    .instruction()
};

export async function DigitalFundEscrowSpl (
    tx_addr,
    payer_wallet
){
    if (typeof tx_addr == "string"){
        tx_addr = new PublicKey(tx_addr);
    }

    let tx_struct = (await this.GetDigitalTransaction(tx_addr)).data;

    let tx_hash = await DIGITAL_MARKET_PROGRAM.methods
    .fundEscrowSpl()
    .accounts({
        digitalTransaction: tx_addr,
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

export async function DigitalSellerEarlyDeclineSpl (
    tx_addr,

    buyer_wallet,
    buyer_account,
payer_wallet
){
    if (typeof tx_addr == "string"){
        tx_addr = new PublicKey(tx_addr);
    }

    let tx_struct = (await this.GetDigitalTransaction(tx_addr)).data;

    await DIGITAL_MARKET_PROGRAM.methods
    .SellerEarlyDeclineSpl()
    .account({
        digitalTransaction: tx_addr,
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
        digitalAuth: this.GenDigitalMarketAuth(),
        marketAccountProgram: MARKET_ACCOUNTS_PROGRAM_ID,
        digitalProgram: DIGITAL_MARKET_PROGRAM_ID,
        transactionProgram: TRANSACTION_PROGRAM_ID,
        tokenProgram: TOKEN_PROGRAM_ID
    })
    .instruction()
}

/// CLOSE TRANSACTION COMMON
export async function DigitalCloseTransactionAccount (
    tx_addr,
    tx_log,
    buyer_wallet,
payer_wallet
){

    if (typeof tx_addr == "string"){
        tx_addr = new PublicKey(tx_addr);
    }

    await DIGITAL_MARKET_PROGRAM.methods
    .closeTransactionAccount()
    .accounts({
        digitalTransaction: tx_addr,
        transactionsLog: tx_log,
        wallet: payer_wallet.publicKey,
        buyerWallet: buyer_wallet
    })
    .instruction()
};

////////////////////////////////////////
/// BUYER UTILS

export async function DigitalConfirmDelivered (
    tx_addr,
payer_wallet
){
    if (typeof tx_addr == "string"){
        tx_addr = new PublicKey(tx_addr);
    }

    let tx_struct = (await this.GetDigitalTransaction(tx_addr)).data;

    return DIGITAL_MARKET_PROGRAM.methods
    .confirmDelivered()
    .accounts({
        digitalTransaction: tx_addr,
        buyerTransactions: tx_struct.buyer,
        buyerWallet: payer_wallet.publicKey
    })
    .instruction()
};

export async function DigitalConfirmAccept (
    tx_addr,
payer_wallet
){
    if (typeof tx_addr == "string"){
        tx_addr = new PublicKey(tx_addr);
    }

    let tx_struct = (await this.GetDigitalTransaction(tx_addr)).data;

    return DIGITAL_MARKET_PROGRAM.methods
    .confirmAccept()
    .accounts({
        digitalTransaction: tx_addr,
        buyerTransactions: tx_struct.buyer,
        buyerWallet: payer_wallet.publicKey
    })
    .instruction()
};

export async function DigitalDenyAccept (
    tx_addr,
    buyer_account,
payer_wallet
){
    if (typeof tx_addr == "string"){
        tx_addr = new PublicKey(tx_addr);
    }

    let tx_struct = (await this.GetDigitalTransaction(tx_addr)).data;

    return DIGITAL_MARKET_PROGRAM.methods
    .denyAccept()
    .accounts({
        digitalTransaction: tx_addr,
        buyerAccount: buyer_account,
        buyerTransactions: tx_struct.buyer,
        buyerWallet: payer_wallet.publicKey,
        digitalAuth: this.GenDigitalMarketAuth(),
        digitalProgram: DIGITAL_MARKET_PROGRAM_ID,
        marketAccountsProgram: MARKET_ACCOUNTS_PROGRAM_ID
    })
    .instruction()
};

////////////////////////////////////////
/// SELLER COMMITS
export async function DigitalCommitInitKeys (
    tx_addr,
    enc_pubkeys,
    payer_wallet
){
    if(typeof transaction == "string"){
        transaction = new PublicKey(transaction)
    }
    let tx_struct = (await this.GetDigitalTransaction(tx_addr)).data;

    let submission_keys = await Promise.all(enc_pubkeys.map(async (pk)=>{
        if(typeof pk == "string"){
            pk = new PublicKey(pk);
        }
        return (PublicKey.findProgramAddressSync([pk.toBuffer()], DIGITAL_MARKET_PROGRAM_ID))[0]
    }));

    return DIGITAL_MARKET_PROGRAM.methods
    .commitInitKeys(submission_keys)
    .accounts({
        digitalTransaction: transaction,
        sellerTransactions: tx_struct.seller,
        sellerWallet: payer_wallet.publicKey,
    })
    .instruction()
}

export async function DigitalCommitLink (
    tx_addr,
    link,
    payer_wallet
){
    if(typeof transaction == "string"){
        transaction = new PublicKey(transaction)
    }
    let tx_struct = (await this.GetDigitalTransaction(tx_addr)).data;

    return DIGITAL_MARKET_PROGRAM.methods
    .commitLink(link)
    .accounts({
        digitalTransaction: transaction,
        sellerTransactions: tx_struct.seller,
        sellerWallet: payer_wallet.publicKey,
    })
    .instruction()
}

export async function DigitalUpdateStatusToShipping (
    tx_addr,
payer_wallet
){
    if(typeof transaction == "string"){
        transaction = new PublicKey(transaction)
    }
    let tx_struct = (await this.GetDigitalTransaction(tx_addr)).data;

    return DIGITAL_MARKET_PROGRAM.methods
    .updateStatusToShipping()
    .accounts({
        digitalTransaction: transaction,
        sellerTransactions: tx_struct.seller,
        sellerWallet: payer_wallet.publicKey,
    })
    .instruction()

}

export async function DigitalCommitSubkeys (
    tx_addr,
    pk_map,
payer_wallet
){
    if(typeof transaction == "string"){
        transaction = new PublicKey(transaction)
    }
    let tx_struct = (await this.GetDigitalTransaction(tx_addr)).data;

    return DIGITAL_MARKET_PROGRAM.methods
    .commitSubkeys(Object.keys(pk_map))
    .accounts({
        digitalTransaction: transaction,
        sellerTransactions: tx_struct.seller,
        sellerWallet: payer_wallet.publicKey,
    })
    .remainingAccounts(
        Object.values(pk_map).map((val)=>{
            return {
                pubkey: val.publicKey,
                isSigner: true,
                isWritable: false
            }
        })
    )
    .signers(Object.values(pk_map))
    .instruction()
};

/////////////////////////////////
/// SELLER UTILS
export async function DigitalSellerAcceptTransaction (
    tx_addr,
    payer_wallet
){
    if (typeof tx_addr == "string"){
        tx_addr = new PublicKey(tx_addr);
    }
    let tx_struct = (await this.GetDigitalTransaction(tx_addr)).data;

    return DIGITAL_MARKET_PROGRAM.methods
    .sellerAcceptTransaction()
    .accounts({
        digitalTransaction: tx_addr,
        sellerAccount: tx_struct.seller,
        wallet: payer_wallet.publicKey
    })
    .instruction()
};

////////////////////////////////////////////////////
/// POST TX
export async function DigitalLeaveReview (
    tx_addr,
    review_receiver,
    market_account,
payer_wallet
){
    if(typeof tx_addr == "string"){
        tx_addr = new PublicKey(tx_addr)
    };

    return DIGITAL_MARKET_PROGRAM.methods
    .leaveReview()
    .accounts({
        digitalTransaction: tx_addr,
        reviewedAccount: review_receiver,
        reviewer: market_account,
        wallet: payer_wallet.publicKey,
        digitalAuth: this.GenDigitalMarketAuth(),
        digitalProgram: DIGITAL_MARKET_PROGRAM_ID,
        accountsProgram: MARKET_ACCOUNTS_PROGRAM_ID
    })
    .instruction()

};

//////////////////////////////////
/// GENERATION UTILTIES

export function GenDigitalTransactionAddress (
    vendor_logs_address,
    tx_index
){

    if (typeof vendor_logs_address == "string"){
        vendor_logs_address = new PublicKey(vendor_logs_address);
    }

    return PublicKey.findProgramAddressSync(
        [
            Buffer.from("orbit_digital_transaction"),
            vendor_logs_address.toBuffer(),
            Buffer.from([tx_index])
        ],
        DIGITAL_MARKET_PROGRAM_ID
    )[0]
}

export function GenDigitalMarketAuth (){
    return PublicKey.findProgramAddressSync(
        [
            Buffer.from("market_authority")
        ],
        DIGITAL_MARKET_PROGRAM_ID
    )[0];
}

export function GenDigitalEscrow (tx_addr, buyer_log_addr){
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
        DIGITAL_MARKET_PROGRAM_ID
    )[0];
}


///////////////////////////////////
/// STRUCT FETCH UTILS

export async function GetDigitalTransaction (tx_addr){
    if(typeof tx_addr == "string"){
        tx_addr = new PublicKey(tx_addr);
    };

    try{
        return {
            address: tx_addr,
            data: await DIGITAL_MARKET_PROGRAM.account.digitalTransaction.fetch(tx_addr),
            type: "DigitalTransaction"
        };
    }catch{
        return;
    }
}

export async function GetMultipleDigitalTransactions (tx_addrs){
    if(!Array.isArray(tx_addrs)){
        return []
    }
    for(let i = 0; i < tx_addrs.length; i++){
        if(typeof tx_addrs[i] == "string"){
            tx_addrs[i] = new PublicKey(tx_addrs[i]);
        }
    }
    
    return (await DIGITAL_MARKET_PROGRAM.account.digitalTransaction.fetchMultiple(products)).map((dat, ind)=>{
        return {
            address: tx_addrs[ind],
            data: dat,
            type: "DigitalTransaction"
        }
    });
}