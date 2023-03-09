import * as anchor from '@coral-xyz/anchor';
import {TOKEN_PROGRAM_ID, getAssociatedTokenAddress} from "@solana/spl-token";
import {PublicKey} from "@solana/web3.js";
import { MARKET_ACCOUNTS_PROGRAM_ID} from "./MarketAccountsClient";
import {PRODUCT_PROGRAM_ID} from "./OrbitProductClient";
import {TRANSACTION_PROGRAM_ID} from "./OrbitTransactionClient";
import { MULTISIG_WALLET_ADDRESS} from "./MultisigClient";

import idl from "../idls/orbit_commission_market.json";

export var COMMISSION_MARKET_PROGRAM_ID = new PublicKey(idl.metadata.address);
export var COMMISSION_MARKET_PROGRAM = new anchor.Program(idl, idl.metadata.address, {});

export function SetProgramWallet(prov){
    COMMISSION_MARKET_PROGRAM = new anchor.Program(idl, idl.metadata.address, prov);
}

////////////////////////////////////////
/// TRANSACTIONS

/// :SOL
export async function CommissionOpenTransactionSol (
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

    await COMMISSION_MARKET_PROGRAM.methods
    .openTransactionSol(sellerIndex, buyerIndex, new anchor.BN(price), useDiscount)
    .accounts({
        commissionTransaction: tx_addr,
        escrowAccount: this.GenCommissionEscrow(tx_addr, buyer_log_address),
        commissionProduct: product,
        buyerTransactionsLog: buyer_log_address,
        buyerMarketAccount: buyer_account_address,
        buyerWallet: payer_wallet.publicKey,
        sellerListings: vendor_listings_address,
        sellerTransactionsLog: vendor_log_address,
        commissionAuth: this.GenCommissonMarketAuth(),
        commissionProgram: COMMISSION_MARKET_PROGRAM_ID,
        transactionProgram: TRANSACTION_PROGRAM_ID,
        marketAccountProgram: MARKET_ACCOUNTS_PROGRAM_ID,
        productProgram: PRODUCT_PROGRAM_ID
    })
    .instruction();
};

export async function CommissionCloseTransactionSol (
    tx_addr,
    buyer_account_address,
    buyer_wallet,
    seller_account_address,
    seller_wallet,
    reflink_accounts_chain
){

    if(typeof tx_addr == "string"){
        tx_addr = new PublicKey(tx_addr_str);
    }
    
    let tx_struct = (await this.GetCommissionTransaction(tx_addr)).data;

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

    await COMMISSION_MARKET_PROGRAM.methods
    .closeTransactionSol()
    .accounts({
        commissionTransaction: tx_addr,
        escrowAccount: tx_struct.metadata.escrowAccount,
        buyerAccount: buyer_account_address,
        buyerTransactionsLog: tx_struct.buyer,
        buyerWallet: buyer_wallet,
        sellerAccount: seller_account_address,
        sellerTransactionsLog: tx_struct.seller,
        sellerWallet: seller_wallet,
        multisigWallet: MULTISIG_WALLET_ADDRESS,
        commissionAuth: this.GenCommissonMarketAuth(),
        commissionProgram: COMMISSION_MARKET_PROGRAM_ID,
        marketAccountProgram: MARKET_ACCOUNTS_PROGRAM_ID,
        transactionProgram: TRANSACTION_PROGRAM_ID
    })
    .remainingAccounts(remaining_accs)
    .instruction();

    return tx_hash;
};

export async function CommissionFundEscrowSol (
    tx_addr_str,
    payer_wallet
){
    if(typeof tx_addr == "string"){
        tx_addr = new PublicKey(tx_addr_str);
    }

    let tx_struct = this.GetCommissionTransaction(tx_addr);

    await COMMISSION_MARKET_PROGRAM.methods
    .fundEscrowSol()
    .accounts({
        commissionTransaction: tx_addr,
        escrowAccount: tx_struct.metadata.escrow_account,
        buyerTransactionsLog: tx_struct.buyer,
        buyerWallet: payer_wallet.publicKey
    })
    .instruction();
};

export async function CommissionSellerEarlyDeclineSol (
    tx_addr_str,

    buyer_wallet,
    buyer_account,
payer_wallet
){

    if(typeof tx_addr == "string"){
        tx_addr = new PublicKey(tx_addr_str);
    }
    let tx_struct = this.GetCommissionTransaction(tx_addr);

    await COMMISSION_MARKET_PROGRAM.methods
    .sellerEarlyDeclineSol()
    .accounts({
        commissionTransaction: tx_addr,
        escrowAccount: tx_struct.metadata.escrowAccount,
        buyerAccount: buyer_account,
        buyerTransactionsLog: tx_struct.buyer,
        buyerWallet: buyer_wallet,
        sellerTransactionsLog: tx_struct.seller,
        sellerWallet: payer_wallet.publicKey,
        commissionAuth: this.GenCommissonMarketAuth(),
        commissionProgram: COMMISSION_MARKET_PROGRAM_ID,
        marketAccountProgram: MARKET_ACCOUNTS_PROGRAM_ID,
        transactionProgram: TRANSACTION_PROGRAM_ID
    })
    .instruction()
}

/// :SPL
export async function CommissionOpenTransactionSpl (
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
    
    await COMMISSION_MARKET_PROGRAM.methods
    .openTransactionSpl(sellerIndex, buyerIndex, new anchor.BN(price), useDiscount)
    .accounts({
        commissionTransaction:tx_addr,
        escrowAccount: this.GenCommissionEscrow(tx_addr, buyer_log_address),
        tokenMint: product_currency,
        commissionProduct: product,
        buyerTransactionsLog: buyer_log_address,
        buyerMarketAccount: buyer_account_address,
        buyerWallet: payer_wallet.publicKey,
        sellerListings: vendor_listings_address,
        sellerTransactionsLog: vendor_log_address,
        commissionAuth: this.GenCommissonMarketAuth(),
        commissionProgram: COMMISSION_MARKET_PROGRAM_ID,
        marketAccountProgram: MARKET_ACCOUNTS_PROGRAM_ID,
        tokenProgram: TOKEN_PROGRAM_ID,
        productProgram: PRODUCT_PROGRAM_ID,
        transactionProgram: TRANSACTION_PROGRAM_ID
    })
    .instruction()

};

export async function CommissionCloseTransactionSpl (
    tx_addr,

    buyer_wallet,
    seller_wallet,

    reflink_accounts_chain
){
    if (typeof tx_addr == "string"){
        tx_addr = new PublicKey(tx_addr);
    }

    let tx_struct = (await this.GetCommissionTransaction(tx_addr)).data;
    
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

    await COMMISSION_MARKET_PROGRAM.methods
    .closeTransactionSpl()
    .accounts({
        commissionTransaction: tx_addr,
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
        commissionAuth: this.GenCommissonMarketAuth(),
        multisigAta: getAssociatedTokenAddress(
            mint,
            MULTISIG_SIGNER_ADDRESS
        ),
        marketAccountProgram: MARKET_ACCOUNTS_PROGRAM_ID,
        commissionProgram: COMMISSION_MARKET_PROGRAM_ID,
        transactionProgram: TRANSACTION_PROGRAM_ID,
        tokenProgram: TOKEN_PROGRAM_ID
    })
    .remainingAccounts(remaining_accs)
    .instruction()
};

export async function CommissionFundEscrowSpl (
    tx_addr,
    payer_wallet
){
    if (typeof tx_addr == "string"){
        tx_addr = new PublicKey(tx_addr);
    }

    let tx_struct = (await this.GetCommissionTransaction(tx_addr)).data;

    let tx_hash = await COMMISSION_MARKET_PROGRAM.methods
    .fundEscrowSpl()
    .accounts({
        commissionTransaction: tx_addr,
        escrowAccount: tx_struct.metadata.escrowAccount,
        buyerTransactionsLog: tx_struct.buyer,
        buyerTokenAccount: getAssociatedTokenAddress(
            tx_struct.metdata.currency,
            payer_wallet.publicKey        
        ),
        buyerWallet: payer_wallet.publicKey,
        tokenProgram: TOKEN_PROGRAM_ID
    })
    .instruction();

    return tx_hash
};

export async function CommissionSellerEarlyDeclineSpl (
    tx_addr,

    buyer_wallet,
    buyer_account,
payer_wallet
){
    if (typeof tx_addr == "string"){
        tx_addr = new PublicKey(tx_addr);
    }

    let tx_struct = (await this.GetCommissionTransaction(tx_addr)).data;

    await COMMISSION_MARKET_PROGRAM.methods
    .SellerEarlyDeclineSpl()
    .account({
        commissionTransaction: tx_addr,
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
        sellerWallet: payer_wallet.publicKey,
        commissionAuth: this.GenCommissonMarketAuth(),
        marketAccountProgram: MARKET_ACCOUNTS_PROGRAM_ID,
        commissionProgram: COMMISSION_MARKET_PROGRAM_ID,
        transactionProgram: TRANSACTION_PROGRAM_ID,
        tokenProgram: TOKEN_PROGRAM_ID
    })
    .instruction()
}

/// CLOSE TRANSACTION COMMON
export async function CommissionCloseTransactionAccount (
    tx_addr,
    tx_log,
    buyer_wallet,
payer_wallet
){

    if (typeof tx_addr == "string"){
        tx_addr = new PublicKey(tx_addr);
    }

    await COMMISSION_MARKET_PROGRAM.methods
    .closeTransactionAccount()
    .accounts({
        commissionTransaction: tx_addr,
        transactionsLog: tx_log,
        wallet: payer_wallet.publicKey,
        buyerWallet: buyer_wallet
    })
    .instruction()
};

////////////////////////////////////////
/// BUYER UTILS

export async function CommissionConfirmDelivered (
    tx_addr,
payer_wallet
){
    if (typeof tx_addr == "string"){
        tx_addr = new PublicKey(tx_addr);
    }

    let tx_struct = (await this.GetCommissionTransaction(tx_addr)).data;

    return COMMISSION_MARKET_PROGRAM.methods
    .confirmDelivered()
    .accounts({
        commissionTransaction: tx_addr,
        buyerTransactions: tx_struct.buyer,
        buyerWallet: payer_wallet.publicKey
    })
    .instruction()
};

export async function CommissionConfirmAccept (
    tx_addr,
payer_wallet
){
    if (typeof tx_addr == "string"){
        tx_addr = new PublicKey(tx_addr);
    }

    let tx_struct = (await this.GetCommissionTransaction(tx_addr)).data;

    return COMMISSION_MARKET_PROGRAM.methods
    .confirmAccept()
    .accounts({
        commissionTransaction: tx_addr,
        buyerTransactions: tx_struct.buyer,
        buyerWallet: payer_wallet.publicKey
    })
    .instruction()
};

export async function CommissionDenyAccept (
    tx_addr,
    buyer_account,
payer_wallet
){
    if (typeof tx_addr == "string"){
        tx_addr = new PublicKey(tx_addr);
    }

    let tx_struct = (await this.GetCommissionTransaction(tx_addr)).data;

    return COMMISSION_MARKET_PROGRAM.methods
    .denyAccept()
    .accounts({
        commissionTransaction: tx_addr,
        buyerAccount: buyer_account,
        buyerTransactions: tx_struct.buyer,
        buyerWallet: payer_wallet.publicKey,
        commissionAuth: this.GenCommissonMarketAuth(),
        commissionProgram: COMMISSION_MARKET_PROGRAM_ID,
        marketAccountsProgram: MARKET_ACCOUNTS_PROGRAM_ID
    })
    .instruction()
};

////////////////////////////////////////
/// SELLER COMMITS
export async function CommissionCommitInitKeys (
    tx_addr,
    enc_pubkeys,
    payer_wallet
){
    if(typeof transaction == "string"){
        transaction = new PublicKey(transaction)
    }
    let tx_struct = (await this.GetCommissionTransaction(tx_addr)).data;

    let submission_keys = await Promise.all(enc_pubkeys.map(async (pk)=>{
        if(typeof pk == "string"){
            pk = new PublicKey(pk);
        }
        return (PublicKey.findProgramAddressSync([pk.toBuffer()], COMMISSION_MARKET_PROGRAM_ID))[0]
    }));

    return COMMISSION_MARKET_PROGRAM.methods
    .commitInitKeys(submission_keys)
    .accounts({
        commissionTransaction: transaction,
        sellerTransactions: tx_struct.seller,
        sellerWallet: payer_wallet.publicKey,
    })
    .instruction()
}

export async function CommissionCommitLink (
    tx_addr,
    link,
    payer_wallet
){
    if(typeof transaction == "string"){
        transaction = new PublicKey(transaction)
    }
    let tx_struct = (await this.GetCommissionTransaction(tx_addr)).data;

    return COMMISSION_MARKET_PROGRAM.methods
    .commitLink(link)
    .accounts({
        commissionTransaction: transaction,
        sellerTransactions: tx_struct.seller,
        sellerWallet: payer_wallet.publicKey,
    })
    .instruction()
}

export async function CommissionUpdateStatusToShipping (
    tx_addr,
payer_wallet
){
    if(typeof transaction == "string"){
        transaction = new PublicKey(transaction)
    }
    let tx_struct = (await this.GetCommissionTransaction(tx_addr)).data;

    return COMMISSION_MARKET_PROGRAM.methods
    .updateStatusToShipping()
    .accounts({
        commissionTransaction: transaction,
        sellerTransactions: tx_struct.seller,
        sellerWallet: payer_wallet.publicKey,
    })
    .instruction()

}

export async function CommissionCommitSubkeys (
    tx_addr,
    pk_map,
payer_wallet
){
    if(typeof transaction == "string"){
        transaction = new PublicKey(transaction)
    }
    let tx_struct = (await this.GetCommissionTransaction(tx_addr)).data;

    return COMMISSION_MARKET_PROGRAM.methods
    .commitSubkeys(Object.keys(pk_map))
    .accounts({
        commissionTransaction: transaction,
        sellerTransactions: tx_struct.seller,
        sellerWallet: payer_wallet.publicKey,
    })
    .remainingAccounts(
        Object.values(pk_map).map((val,
    payer_wallet
)=>{
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
export async function CommissionSellerAcceptTransaction (
    tx_addr
){
    if (typeof tx_addr == "string"){
        tx_addr = new PublicKey(tx_addr);
    }
    let tx_struct = (await this.GetCommissionTransaction(tx_addr)).data;

    return COMMISSION_MARKET_PROGRAM.methods
    .sellerAcceptTransaction()
    .accounts({
        commissionTransaction: tx_addr,
        sellerAccount: tx_struct.seller,
        wallet: payer_wallet.publicKey
    })
    .instruction()
};

////////////////////////////////////////////////////
/// POST TX
export async function CommissionLeaveReview (
    tx_addr,
    review_receiver,
    market_account,
payer_wallet
){
    if(typeof tx_addr == "string"){
        tx_addr = new PublicKey(tx_addr)
    };

    return COMMISSION_MARKET_PROGRAM.methods
    .leaveReview()
    .accounts({
        commissionTransaction: tx_addr,
        reviewedAccount: review_receiver,
        reviewer: market_account,
        wallet: payer_wallet.publicKey,
        commissionAuth: this.GenCommissonMarketAuth(),
        commissionProgram: COMMISSION_MARKET_PROGRAM_ID,
        accountsProgram: MARKET_ACCOUNTS_PROGRAM_ID
    })
    .instruction()

};

/////////////////////////////////////////////////
/// COMISSION SPECIFIC

export async function CommissionCommitPreview (
    tx_addr,
    preview_link,
payer_wallet
){
    if(typeof tx_addr == "string"){
        tx_addr = new PublicKey(tx_addr)
    };

    let tx_struct = await this.GetCommissionTransaction(tx_addr);

    return COMMISSION_MARKET_PROGRAM.methods
    .commitPreview(preview_link)
    .accounts({
        commissionTransaction: tx_addr,
        sellerTransactions: tx_struct.seller,
        sellerWallet: payer_wallet.publicKey
    })
    .instruction()
};

export async function CommissionProposeRate (
    tx_addr,
    transaction_logs,
    new_rate,
payer_wallet
){
    if(typeof tx_addr == "string"){
        tx_addr = new PublicKey(tx_addr)
    };
    
    return COMMISSION_MARKET_PROGRAM.methods
    .proposeRate(new anchor.BN(new_rate))
    .accounts({
        commissionTransaction: tx_addr,
        transactionLogs: transaction_logs,
        wallet: payer_wallet.publicKey
    })
    .instruction()
};

export async function CommissionAcceptRate (
    tx_addr,
    transaction_logs,
payer_wallet
){
    if(typeof tx_addr == "string"){
        tx_addr = new PublicKey(tx_addr)
    };
    
    return COMMISSION_MARKET_PROGRAM.methods
    .acceptRate()
    .accounts({
        commissionTransaction: tx_addr,
        transactionLogs: transaction_logs,
        wallet: payer_wallet.publicKey
    })
    .instruction()
};


/// UTILS

export function GenCommissionTransactionAddress (
    vendor_logs_address,
    tx_index
){

    if (typeof vendor_logs_address == "string"){
        vendor_logs_address = new PublicKey(vendor_logs_address);
    }

    return PublicKey.findProgramAddressSync(
        [
            Buffer.from("orbit_commission_transaction"),
            vendor_logs_address.toBuffer(),
            Buffer.from([tx_index])
        ],
        COMMISSION_MARKET_PROGRAM_ID
    )[0]
}

export function GenCommissonMarketAuth (){
    return PublicKey.findProgramAddressSync(
        [
            Buffer.from("market_authority")
        ],
        COMMISSION_MARKET_PROGRAM_ID
    )[0];
}

export function GenCommissionEscrow (tx_addr, buyer_log_addr){
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
        COMMISSION_MARKET_PROGRAM_ID
    )[0];
}

/// RPC ACCESSORS

export async function GetCommissionTransaction (tx_addr){
    if(typeof tx_addr == "string"){
        tx_addr = new PublicKey(tx_addr);
    };

    try{
        return {
            address: tx_addr,
            data: await COMMISSION_MARKET_PROGRAM.account.commissionTransaction.fetch(tx_addr),
            type: "CommissionTransaction"
        };
    }catch{
        return;
    }
}

export async function GetMultipleCommissionTransactions (tx_addrs){
    if(!Array.isArray(tx_addrs)){
        return []
    }
    for(let i = 0; i < tx_addrs.length; i++){
        if(typeof tx_addrs[i] == "string"){
            tx_addrs[i] = new PublicKey(tx_addrs[i]);
        }
    }
    
    return (await COMMISSION_MARKET_PROGRAM.account.commissionTransaction.fetchMultiple(products)).map((dat, ind)=>{
        return {
            address: tx_addrs[ind],
            data: dat,
            type: "CommissionTransaction"
        }
    });
}

export async function GetCommissionMissingKeys (tx_addr){
    let committed = (await this.GetCommissionTransaction(tx_addr)).data.numKeys.toString(2);
    return [...Array(committed.length).keys()].filter(ind=> committed[ind] == "1");
}

export async function GetCommissionCommittedKeys (tx_addr){
    let tx_data = (await this.GetCommissionTransaction(tx_addr)).data;
    let committed = tx_data.numKeys.toString(2).padEnd("0", tx_data.keyArr.length);
    return [...Array(committed.length).keys()].filter(ind=> committed[ind] == "0")
    .map((ind)=>{
        return {
            ind: ind,
            pubkey: new PublicKey(tx_addr.keyArr[ind])
        }
    });
}