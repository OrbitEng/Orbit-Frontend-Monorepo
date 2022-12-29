import * as anchor from '@project-serum/anchor';
import {PublicKey} from "@solana/web3.js";
import {TOKEN_PROGRAM_ID, getAssociatedTokenAddress} from "../accounts-program/src/tokenCommon";
import {PRODUCT_PROGRAM_ID} from "orbit-clients/product-program";
import {TRANSACTION_PROGRAM_ID} from "orbit-clients/transaction-program";


const idl = require("../deps/orbit_market_accounts");

export default class MarketAccountsClient{
    constructor(connection, provider){
        this.programid = new PublicKey(idl.metadata.address);

        if(connection){
            this.connection = connection;
        };

        if(provider){
            this.provider = provider;
        }
        
        this.program = new anchor.Program(idl, idl.metadata.address, provider);
    }

    ///////////////////////////////////////
    /// RPC CALLS

    ////////////////////////////////////////////////////////////////
    /// ACCOUNT

    CreateAccount = async (metadata_link, media_link, reflink) => {

        if (typeof reflink == "string"){
            reflink = new PublicKey(reflink);
        }
        
        // should return these two
        let reflink_arr = reflink ? [{
            pubkey: reflink,
            isWritable: true,
            isSigner: false
        }] : [];

        let voter_id_addr = this.GenVoterIdAddress();
        
        await this.program.methods
        .createAccount(media_link, metadata_link)
        .accounts({
            marketAccount: this.GenAccountAddress(this.provider.wallet.publicKey),
            voterIdStruct: voter_id_addr,
            wallet: this.provider.wallet.publicKey,
        })
        .remainingAccounts(reflink_arr)
        .instruction();
    };

    UpdatePFP = async(
        new_pfp_link
    ) =>{
        let market_account = this.GenAccountAddress();

        return this.program.methods
        .updateProfileImage(new_pfp_link)
        .accounts({
            marketAccount: market_account,
            wallet: this.provider.wallet.publicKey
        })
        .instruction()
    };

    UpdateMetadata = async(
        metadata_link
    ) => {
        return this.program.methods
        .updateMetadata(metadata_link)
        .accounts({
            marketAccount: this.GenAccountAddress(),
            wallet: this.provider.wallet.publicKey
        })
        .instruction()
    }
    
    SetReflink = async (
        reflink
    ) => {
        if(typeof reflink == "string"){
            reflink = new PublicKey(reflink);
        }

        await this.program.methods
        .setReflink()
        .accounts({
            marketAccount: this.GenAccountAddress(),
            reflink: reflink,
            wallet: this.provider.wallet.publicKey
        })
        .instruction();
    };

    RemoveReflink = async() => {
        const market_acc = this.GenAccountAddress();
        const reflink_addr = (await this.GetAccount(market_acc)).data.reflink;

        await this.program.methods
        .removeReflink()
        .accounts({
            marketAccount: market_acc,
            reflink: reflink_addr,
            wallet: this.provider.wallet.publicKey
        })
        .instruction()
    };

    ////////////////////////////////////////////////////////////////////
    /// VENDOR LISTINGS

    AddVendorPhysicalListings = async(
        listings_address
    )=>{
        if(typeof listings_address == "string"){
            listings_address = new PublicKey(listings_address)
        }

        await this.program.methods
        .addVendorPhysicalListings("physical")
        .accounts({
            marketAccount: this.GenAccountAddress(),
            listingsStruct: listings_address,
            wallet: this.provider.wallet.publicKey,
            productProgram: PRODUCT_PROGRAM_ID
        })
        .instruction()
    }

    AddVendorDigitalListings = async(
        listings_address
    )=>{
        if(typeof listings_address == "string"){
            listings_address = new PublicKey(listings_address)
        }
    
        await this.program.methods
        .addVendorDigitalListings("digital")
        .accounts({
            marketAccount: this.GenAccountAddress(),
            listingsStruct: listings_address,
            wallet: this.provider.wallet.publicKey,
            productProgram: PRODUCT_PROGRAM_ID
        })
        .instruction()
    }

    AddVendorCommissionListings = async(
        listings_address
    )=>{
        if(typeof listings_address == "string"){
            listings_address = new PublicKey(listings_address)
        }

        await this.program.methods
        .addVendorCommissionListings("commission")
        .accounts({
            marketAccount: this.GenAccountAddress(),
            listingsStruct: listings_address,
            wallet: this.provider.wallet.publicKey,
            productProgram: PRODUCT_PROGRAM_ID
        })
        .instruction()
    }

    //////////////////////////////////////////////////////////////////
    /// TRANSACTION LOGS

    /// :BUYER
    AddBuyerPhysicalTransactions = async(
        transactions_log
    )=>{
        await this.program.methods
        .addBuyerPhysicalTransactions("physical")
        .accounts({
            marketAccount: this.GenAccountAddress(),
            transactionsLog: transactions_log,
            wallet: this.provider.wallet.publicKey,
            transactionsProgram: TRANSACTION_PROGRAM_ID
        })
        .instruction()
    }

    AddBuyerDigitalTransactions = async(
        transactions_log
    )=>{
        await this.program.methods
        .addBuyerDigitalTransactions("digital")
        .accounts({
            marketAccount: this.GenAccountAddress(),
            transactionsLog: transactions_log,
            wallet: this.provider.wallet.publicKey,
            transactionsProgram: TRANSACTION_PROGRAM_ID
        })
        .instruction()
    }

    AddBuyerCommissionTransactions = async(
        transactions_log
    )=>{
        await this.program.methods
        .addBuyerCommissionTransactions("commission")
        .accounts({
            marketAccount: this.GenAccountAddress(),
            transactionsLog: transactions_log,
            wallet: this.provider.wallet.publicKey,
            transactionsProgram: TRANSACTION_PROGRAM_ID
        })
        .instruction()
    }

    /// :SELLER
    AddSellerPhysicalTransactions = async(
        transactions_log
    )=>{
        await this.program.methods
        .addSellerPhysicalTransactions("physical")
        .accounts({
            marketAccount: this.GenAccountAddress(),
            transactionsLog: transactions_log,
            wallet: this.provider.wallet.publicKey,
            transactionsProgram: TRANSACTION_PROGRAM_ID
        })
        .instruction()
    }

    AddSellerDigitalTransactions = async(
        transactions_log
    )=>{
        await this.program.methods
        .addSellerDigitalTransactions("digital")
        .accounts({
            marketAccount: this.GenAccountAddress(),
            transactionsLog: transactions_log,
            wallet: this.provider.wallet.publicKey,
            transactionsProgram: TRANSACTION_PROGRAM_ID
        })
        .instruction()
    }

    AddSellerCommissionTransactions = async(
        transactions_log
    )=>{
        await this.program.methods
        .addSellerCommissionTransactions("commission")
        .accounts({
            marketAccount: this.GenAccountAddress(),
            transactionsLog: transactions_log,
            wallet: this.provider.wallet.publicKey,
            transactionsProgram: TRANSACTION_PROGRAM_ID
        })
        .instruction()
    }


    //////////////////////////////////////////////////////////////////
    /// TRANSFERS

    InitiateTransfer = async(destination_wallet) => {
        
        if(typeof destination_wallet == "string"){
            destination_wallet = new PublicKey(destination_wallet);
        };

        let source = this.GenAccountAddress();
        let destination = this.GenAccountAddress(destination_wallet);
        let transfer_addr = this.GenTransferStruct(source, destination);

        await this.program.methods
        .initiateTransfer()
        .accounts({
            transferStruct: transfer_addr,
            sourceMarketAccount: source,
            sourceWallet: this.provider.wallet.publicKey,
            destinationMarketAccount: destination,
            destinationWallet: destination_wallet
        })
        .instruction()

    }

    ConfirmTransfer = async() => {
        const market_acc = this.GenAccountAddress();
        const transfer_addr = (await this.GetAccount(market_acc)).data.transfer_struct;

        const transfer_struct = await this.GetTransferStruct(transfer_addr);

        const source = transfer_struct.data.source;
        const source_wallet = (await this.GetAccount(source)).data.wallet;

        await this.program.methods
        .confirmTransfer()
        .accounts({
            sourceMarketAccount: source,
            sourceWallet: source_wallet,
            destinationMarketAccount: market_acc,
            destinationWallet: this.provider.wallet.publicKey,
            transferRequest: transfer_addr
        })
        .instruction()
    }

    DeclineTransfer = async() => {
        const market_acc = this.GenAccountAddress();
        const transfer_addr = (await this.GetAccount(market_acc)).data.transfer_struct;

        const transfer_struct = await this.GetTransferStruct(transfer_addr);

        const source = transfer_struct.data.source;
        const source_wallet = (await this.GetAccount(source)).data.wallet;
        const destination = transfer_struct.data.destination;
        const destination_wallet = (await this.GetAccount(destination)).data.wallet;

        await this.program.methods
        .declineTransfer()
        .accounts({
            sourceMarketAccount: source,
            sourceWallet: source_wallet,
            destinationMarketAccount: destination,
            destinationWallet: destination_wallet,
            transferRequest: transfer_addr,
            invoker: this.provider.wallet.publicKey,
        })
        .instruction()
    }

    //////////////////////////////////////////////////////////////////
    //// REFLINK

    CreateReflink = async () => {
        let reflink_addr = this.GenReflinkAddress(this.provider.wallet.publicKey);

        await this.program.methods
        .CreateReflink()
        .accounts({
            reflink: reflink_addr,
            marketAccount: this.GenAccountAddress(),
            wallet: this.provider.wallet.publicKey
        })
        .instruction()
    }

    DeleteReflink = async () => {
        const market_acc = this.GenAccountAddress();
        const reflink_addr = (await this.GetAccount(market_acc)).data.owned_reflink;
        const reflink_struct = await this.GetReflinkStruct(reflink_addr);

        let remaining_accs = reflink_struct.data.users.map((pk) => {
            return {
                pubkey: pk,
                isWritable: true,
                isSigner: false 

            }
        });

        await this.program.methods
        .deleteReflink()
        .accounts({
            reflink: reflink_addr,
            marketAccount: market_acc,
            wallet: this.provider.wallet.publicKey
        })
        .remainingAccounts(remaining_accs)
        .instruction()
    }
    
    //////////////////////////////////////////////////////////////////
    /// STRUCT FETCHING

    GetAccount = async (account_addr) => {
        if(!account_addr) return;
        if (typeof account_addr == "string"){
            account_addr = new PublicKey(account_addr);
        }

        return {
            address: account_addr,
            data: await this.program.account.orbitMarketAccount.fetch(account_addr),
            type: "MarketAccount"
        };
        
    };

    GetAccountTransfer = async (transfer_addr) => {
        if(!transfer_addr) return;
        try{
            if (typeof transfer_addr == "string"){
                transfer_addr = new PublicKey(transfer_addr);
            }

            let data = await this.program.account.accountTransfer.fetch(transfer_addr);

            return {
                address: transfer_addr,
                data: data,
                type: "AccountTransfer"
            };
        }catch{
            return
        }
        
    };

    GetMultipleMarketAccounts = async (account_addrs) => {
        if(!Array.isArray(account_addrs)){
            return [];
        }

        account_addrs = account_addrs.map((addr)=>{
            if(typeof addr == "string"){
                addr = new PublicKey(addr);
            }
            return addr
        })
        
        return (await this.program.account.orbitMarketAccount.fetchMultiple(account_addrs)).map((dat, ind)=>{
    
            return {
                address: account_addrs[ind],
                data: dat,
                type: "MarketAccount"
            }
        });
    };

    GetReflinkStruct = async(reflink_addr) =>{
        if(typeof reflink_addr == "string"){
            reflink_addr = new PublicKey(reflink_addr);
        }

        try{
            return {
                "address": reflink_addr,
                "data": (await this.program.account.orbitReflink.fetch(reflink_addr)),
                "type": "Reflink"
            }
        }catch{
            return;
        }
    };
 
    //////////////////////////////////////////////////////////////////
    /// GENERATION UTILS

    GenReflinkAddress = (wallet_addr) => {
        if(typeof wallet_addr == "string"){
            wallet_addr = new PublicKey(wallet_addr)
        };

        let account_addr = this.GenAccountAddress(wallet_addr);

        return PublicKey.findProgramAddressSync(
            [
                Buffer.from("orbit_reflink"),
                account_addr.toBuffer()
            ],
            this.programid
        )[0];
    }

    GenAccountAddress = (wallet_addr) => {
        if(!wallet_addr){
            wallet_addr = this.provider.wallet.publicKey
        }
        if(typeof wallet_addr == "string"){
            wallet_addr = new PublicKey(wallet_addr)
        };

        return PublicKey.findProgramAddressSync(
            [
                Buffer.from("orbit_account"),
                wallet_addr.toBuffer()
            ],
            this.programid
        )[0];
    };

    GenTransferStruct = (source, destination) => {
        
        if (typeof source == "string"){
            source = new PublicKey(source)
        };

        if (typeof destination == "string"){
            destination = new PublicKey(destination)
        };

        return PublicKey.findProgramAddressSync(
            [
                Buffer.from("orbit_transfer"),
                source.toBuffer(),
                destination.toBuffer()
            ],
            this.programid
        )[0];
    }

    GenVoterIdAddress = () =>{
        return PublicKey.findProgramAddressSync(
            [
                Buffer.from("orbit_voters")
            ],
            this.programid
        )[0]
    }

    //////////////////////////////////////////////////////////
    /// REFLINK
    ReflinkSolChain = async(reflink_address) =>{
        let reflink = await this.GetReflinkStruct(reflink_address);
        return [reflink_address, reflink.data.reflinkOwner];
    }

    ReflinkSplChain = async(reflink_address, currency) => {
        let reflink_sol_chain = await this.ReflinkSolChain(reflink_address);
        let ata_addr = getAssociatedTokenAddress(currency, reflink_sol_chain[1]);
        return [...reflink_sol_chain, ata_addr];
    }
}