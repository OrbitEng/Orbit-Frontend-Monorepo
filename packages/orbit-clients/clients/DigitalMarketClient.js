import * as anchor from '@project-serum/anchor';
import {PublicKey} from "@solana/web3.js";
import {TOKEN_PROGRAM_ID, getAssociatedTokenAddress} from "../digital-market/src/tokenCommon";
import {PRODUCT_PROGRAM_ID} from "orbit-clients/product-program";
import {TRANSACTION_PROGRAM_ID} from "orbit-clients/transaction-program";
import {MARKET_ACCOUNTS_PROGRAM_ID} from "orbit-clients/accounts-program";
import { getMultisigWallet, MULTISIG_WALLET_ADDRESS} from "orbit-clients/multisig";

import idl from "../deps/orbit_digital_market";

export default class DigitalMarket{

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

    ////////////////////////////////////////
    /// TRANSACTIONS

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
            .openTransactionSol(sellerIndex, buyerIndex, new anchor.BN(price), useDiscount)
            .accounts({
                digitalTransaction: tx_addr,
                escrowAccount: this.GenEscrow(tx_addr, buyer_log_address),
                digitalProduct: product,
                buyerTransactionsLog: buyer_log_address,
                buyerMarketAccount: buyer_account_address,
                buyerWallet: this.provider.wallet.publicKey,
                sellerListings: vendor_listings_address,
                sellerTransactionsLog: vendor_log_address,
                digitalAuth: this.GenMarketAuth(),
                digitalProgram: this.programid,
                transactionProgram: TRANSACTION_PROGRAM_ID,
                marketAccountProgram: MARKET_ACCOUNTS_PROGRAM_ID,
                productProgram: PRODUCT_PROGRAM_ID
            })
            .instruction();
    };
    
    CloseTransactionSol = async (
        tx_addr,
        tx_struct,
        buyer_account_address,
        buyer_wallet,
        seller_account_address,
        seller_wallet,
        reflink_accounts_chain
    ) =>{

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

        await this.program.methods
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
            digitalAuth: this.GenMarketAuth(),
            digitalProgram: this.programid,
            marketAccountProgram: MARKET_ACCOUNTS_PROGRAM_ID,
            transactionProgram: TRANSACTION_PROGRAM_ID
        })
        .remainingAccounts(remaining_accs)
        .instruction();

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
            digitalTransaction: tx_addr,
            escrowAccount: tx_struct.metadata.escrow_account,
            buyerTransactionsLog: tx_struct.buyer,
            buyerWallet: this.provider.wallet.publicKey
        })
        .instruction();
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
            digitalTransaction: tx_addr,
            escrowAccount: tx_struct.metadata.escrowAccount,
            buyerAccount: buyer_account,
            buyerTransactionsLog: tx_struct.buyer,
            buyerWallet: buyer_wallet,
            sellerTransactionsLog: tx_struct.seller,
            sellerWallet: this.provider.wallet.publicKey,
            digitalAuth: this.GenMarketAuth(),
            digitalProgram: this.programid,
            marketAccountProgram: MARKET_ACCOUNTS_PROGRAM_ID,
            transactionProgram: TRANSACTION_PROGRAM_ID
        })
        .instruction()
    }
    
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
        
        useDiscount
    ) =>{
        if(typeof product == "string"){
            product = new PublicKey(product);
        }
        
        await this.program.methods
        .openTransactionSpl(sellerIndex, buyerIndex, new anchor.BN(price), useDiscount)
        .accounts({
            digitalTransaction:tx_addr,
            escrowAccount: this.GenEscrow(tx_addr, buyer_log_address),
            tokenMint: product_currency,
            digitalProduct: product,
            buyerTransactionsLog: buyer_log_address,
            buyerMarketAccount: buyer_account_address,
            buyerWallet: this.provider.wallet.publicKey,
            sellerListings: vendor_listings_address,
            sellerTransactionsLog: vendor_log_address,
            digitalAuth: this.GenMarketAuth(),
            digitalProgram: this.programid,
            marketAccountProgram: MARKET_ACCOUNTS_PROGRAM_ID,
            tokenProgram: TOKEN_PROGRAM_ID,
            productProgram: PRODUCT_PROGRAM_ID,
            transactionProgram: TRANSACTION_PROGRAM_ID
        })
        .instruction()

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
            digitalAuth: this.GenMarketAuth(),
            multisigAta: getAssociatedTokenAddress(
                mint,
                MULTISIG_SIGNER_ADDRESS
            ),
            marketAccountProgram: MARKET_ACCOUNTS_PROGRAM_ID,
            digitalProgram: this.programid,
            transactionProgram: TRANSACTION_PROGRAM_ID,
            tokenProgram: TOKEN_PROGRAM_ID
        })
        .remainingAccounts(remaining_accs)
        .instruction()
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
            digitalTransaction: tx_addr,
            escrowAccount: tx_struct.metadata.escrowAccount,
            buyerTransactionsLog: tx_struct.buyer,
            buyerTokenAccount: getAssociatedTokenAddress(
                tx_struct.metdata.currency,
                this.provider.wallet.publicKey        
            ),
            buyerWallet: this.provider.wallet.publicKey,
            tokenProgram: TOKEN_PROGRAM_ID
        })
        .instruction();

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
                this.provider.wallet.publicKey
            ),
            sellerWallet: this.provider.wallet.publicKey,
            digitalAuth: this.GenMarketAuth(),
            marketAccountProgram: MARKET_ACCOUNTS_PROGRAM_ID,
            digitalProgram: this.programid,
            transactionProgram: TRANSACTION_PROGRAM_ID,
            tokenProgram: TOKEN_PROGRAM_ID
        })
        .instruction()
    }
    
    /// CLOSE TRANSACTION COMMON
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
            digitalTransaction: tx_addr,
            transactionsLog: tx_log,
            wallet: this.provider.wallet.publicKey,
            buyerWallet: buyer_wallet
        })
        .instruction()
    };

    ////////////////////////////////////////
    /// BUYER UTILS

    ConfirmDelivered = async (
        tx_addr
    ) =>{
        if (typeof tx_addr == "string"){
            tx_addr = new PublicKey(tx_addr);
        }

        let tx_struct = (await this.GetTransaction(tx_addr)).data;

        return this.program.methods
        .confirmDelivered()
        .accounts({
            digitalTransaction: tx_addr,
            buyerTransactions: tx_struct.buyer,
            buyerWallet: this.provider.wallet.publicKey
        })
        .instruction()
    };
    
    ConfirmAccept = async (
        tx_addr
    ) =>{
        if (typeof tx_addr == "string"){
            tx_addr = new PublicKey(tx_addr);
        }

        let tx_struct = (await this.GetTransaction(tx_addr)).data;

        return this.program.methods
        .confirmAccept()
        .accounts({
            digitalTransaction: tx_addr,
            buyerTransactions: tx_struct.buyer,
            buyerWallet: this.provider.wallet.publicKey
        })
        .instruction()
    };
    
    DenyAccept = async (
        tx_addr,
        buyer_account
    ) =>{
        if (typeof tx_addr == "string"){
            tx_addr = new PublicKey(tx_addr);
        }

        let tx_struct = (await this.GetTransaction(tx_addr)).data;

        return this.program.methods
        .denyAccept()
        .accounts({
            digitalTransaction: tx_addr,
            buyerAccount: buyer_account,
            buyerTransactions: tx_struct.buyer,
            buyerWallet: this.provider.wallet.publicKey,
            digitalAuth: this.GenMarketAuth(),
            digitalProgram: this.programid,
            marketAccountsProgram: MARKET_ACCOUNTS_PROGRAM_ID
        })
        .instruction()
    };
    
    ////////////////////////////////////////
    /// SELLER COMMITS
    CommitInitKeys = async(
        tx_addr,
        enc_pubkeys,
    ) =>{
        if(typeof transaction == "string"){
            transaction = new PublicKey(transaction)
        }
        let tx_struct = (await this.GetTransaction(tx_addr)).data;

        let submission_keys = await Promise.all(enc_pubkeys.map(async (pk)=>{
            if(typeof pk == "string"){
                pk = new PublicKey(pk);
            }
            return (PublicKey.findProgramAddressSync([pk.toBuffer()], this.programid))[0]
        }));

        return this.program.methods
        .commitInitKeys(submission_keys)
        .accounts({
            digitalTransaction: transaction,
            sellerTransactions: tx_struct.seller,
            sellerWallet: this.provider.wallet.publicKey,
        })
        .instruction()
    }

    CommitLink = async(
        tx_addr,
        link,
    ) =>{
        if(typeof transaction == "string"){
            transaction = new PublicKey(transaction)
        }
        let tx_struct = (await this.GetTransaction(tx_addr)).data;

        return this.program.methods
        .commitLink(link)
        .accounts({
            digitalTransaction: transaction,
            sellerTransactions: tx_struct.seller,
            sellerWallet: this.provider.wallet.publicKey,
        })
        .instruction()
    }

    UpdateStatusToShipping = async(
        tx_addr
    ) =>{
        if(typeof transaction == "string"){
            transaction = new PublicKey(transaction)
        }
        let tx_struct = (await this.GetTransaction(tx_addr)).data;

        return this.program.methods
        .updateStatusToShipping()
        .accounts({
            digitalTransaction: transaction,
            sellerTransactions: tx_struct.seller,
            sellerWallet: this.provider.wallet.publicKey,
        })
        .instruction()

    }

    CommitSubkeys = async(
        tx_addr,
        pk_map
    ) =>{
        if(typeof transaction == "string"){
            transaction = new PublicKey(transaction)
        }
        let tx_struct = (await this.GetTransaction(tx_addr)).data;

        return this.program.methods
        .commitSubkeys(Object.keys(pk_map))
        .accounts({
            digitalTransaction: transaction,
            sellerTransactions: tx_struct.seller,
            sellerWallet: this.provider.wallet.publicKey,
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
    SellerAcceptTransaction = async (
        tx_addr
    ) =>{
        if (typeof tx_addr == "string"){
            tx_addr = new PublicKey(tx_addr);
        }
        let tx_struct = (await this.GetTransaction(tx_addr)).data;

        return this.program.methods
        .sellerAcceptTransaction()
        .accounts({
            digitalTransaction: tx_addr,
            sellerAccount: tx_struct.seller,
            wallet: this.provider.wallet.publicKey
        })
        .instruction()
    };
    
    ////////////////////////////////////////////////////
    /// POST TX
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
            digitalTransaction: tx_addr,
            reviewedAccount: review_receiver,
            reviewer: market_account,
            wallet: this.provider.wallet.publicKey,
            digitalAuth: this.GenMarketAuth(),
            digitalProgram: this.programid,
            accountsProgram: MARKET_ACCOUNTS_PROGRAM_ID
        })
		.instruction()

    };

    //////////////////////////////////
    /// GENERATION UTILTIES

    GenTransactionAddress = (
        vendor_logs_address,
        tx_index
    ) => {

        if (typeof vendor_logs_address == "string"){
            vendor_logs_address = new PublicKey(vendor_logs_address);
        }

        return PublicKey.findProgramAddressSync(
            [
                Buffer.from("orbit_digital_transaction"),
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
    

    ///////////////////////////////////
    /// STRUCT FETCH UTILS

    GetTransaction = async (tx_addr) => {
        if(typeof tx_addr == "string"){
            tx_addr = new PublicKey(tx_addr);
        };

        try{
            return {
                address: tx_addr,
                data: await this.program.account.digitalTransaction.fetch(tx_addr),
                type: "DigitalTransaction"
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
        
        return (await this.program.account.digitalTransaction.fetchMultiple(products)).map((dat, ind)=>{
            return {
                address: tx_addrs[ind],
                data: dat,
                type: "DigitalTransaction"
            }
        });
    }

}