import * as anchor from '@project-serum/anchor';
import {PublicKey} from "@solana/web3.js";
import {TOKEN_PROGRAM_ID, getAssociatedTokenAddress} from "../accounts-program/src/tokenCommon";
import {PRODUCT_PROGRAM_ID} from "orbit-clients/product-program";
import {TRANSACTION_PROGRAM_ID} from "orbit-clients/transaction-program";


const idl = require("../idls/orbit_market_accounts");

market_accounts_program_id = new PublicKey(idl.metadata.address);
market_accounts_program = new anchor.Program(idl, idl.metadata.address);

///////////////////////////////////////
/// RPC CALLS

////////////////////////////////////////////////////////////////
/// ACCOUNT

CreateAccount = async (metadata_link, media_link, reflink,
    payer_wallet
) => {

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
    
    await market_accounts_program.methods
    .createAccount(media_link, metadata_link)
    .accounts({
        marketAccount: this.GenAccountAddress(payer_wallet.publicKey),
        voterIdStruct: voter_id_addr,
        wallet: this.provider.wallet.publicKey,
    })
    .remainingAccounts(reflink_arr)
    .instruction();
};

UpdatePFP = async(
    new_pfp_link,
payer_wallet
) =>{
    let market_account = this.GenAccountAddress();

    return market_accounts_program.methods
    .updateProfileImage(new_pfp_link)
    .accounts({
        marketAccount: market_account,
        wallet: payer_wallet.publicKey
    })
    .instruction()
};

UpdateMetadata = async(
    metadata_link,
payer_wallet
) => {
    return market_accounts_program.methods
    .updateMetadata(metadata_link)
    .accounts({
        marketAccount: this.GenAccountAddress(),
        wallet: payer_wallet.publicKey
    })
    .instruction()
}

SetReflink = async (
    reflink,
payer_wallet
) => {
    if(typeof reflink == "string"){
        reflink = new PublicKey(reflink);
    }

    await market_accounts_program.methods
    .setReflink()
    .accounts({
        marketAccount: this.GenAccountAddress(),
        reflink: reflink,
        wallet: payer_wallet.publicKey
    })
    .instruction();
};

RemoveReflink = async(
        payer_wallet
) => {
    const market_acc = this.GenAccountAddress();
    const reflink_addr = (await this.GetAccount(market_acc)).data.reflink;

    await market_accounts_program.methods
    .removeReflink()
    .accounts({
        marketAccount: market_acc,
        reflink: reflink_addr,
        wallet: payer_wallet.publicKey
    })
    .instruction()
};

////////////////////////////////////////////////////////////////////
/// VENDOR LISTINGS

AddVendorPhysicalListings = async(
    listings_address,
payer_wallet
)=>{
    if(typeof listings_address == "string"){
        listings_address = new PublicKey(listings_address)
    }

    await market_accounts_program.methods
    .addVendorPhysicalListings("physical")
    .accounts({
        marketAccount: this.GenAccountAddress(),
        listingsStruct: listings_address,
        wallet: payer_wallet.publicKey,
        productProgram: PRODUCT_PROGRAM_ID
    })
    .instruction()
}

AddVendorDigitalListings = async(
    listings_address,
payer_wallet
)=>{
    if(typeof listings_address == "string"){
        listings_address = new PublicKey(listings_address)
    }

    await market_accounts_program.methods
    .addVendorDigitalListings("digital")
    .accounts({
        marketAccount: this.GenAccountAddress(),
        listingsStruct: listings_address,
        wallet: payer_wallet.publicKey,
        productProgram: PRODUCT_PROGRAM_ID
    })
    .instruction()
}

AddVendorCommissionListings = async(
    listings_address,
payer_wallet
)=>{
    if(typeof listings_address == "string"){
        listings_address = new PublicKey(listings_address)
    }

    await market_accounts_program.methods
    .addVendorCommissionListings("commission")
    .accounts({
        marketAccount: this.GenAccountAddress(),
        listingsStruct: listings_address,
        wallet: payer_wallet.publicKey,
        productProgram: PRODUCT_PROGRAM_ID
    })
    .instruction()
}

//////////////////////////////////////////////////////////////////
/// TRANSACTION LOGS

/// :BUYER
AddBuyerPhysicalTransactions = async(
    transactions_log,
payer_wallet
)=>{
    await market_accounts_program.methods
    .addBuyerPhysicalTransactions("physical")
    .accounts({
        marketAccount: this.GenAccountAddress(),
        transactionsLog: transactions_log,
        wallet: payer_wallet.publicKey,
        transactionsProgram: TRANSACTION_PROGRAM_ID
    })
    .instruction()
}

AddBuyerDigitalTransactions = async(
    transactions_log,
payer_wallet
)=>{
    await market_accounts_program.methods
    .addBuyerDigitalTransactions("digital")
    .accounts({
        marketAccount: this.GenAccountAddress(),
        transactionsLog: transactions_log,
        wallet: payer_wallet.publicKey,
        transactionsProgram: TRANSACTION_PROGRAM_ID
    })
    .instruction()
}

AddBuyerCommissionTransactions = async(
    transactions_log,
payer_wallet
)=>{
    await market_accounts_program.methods
    .addBuyerCommissionTransactions("commission")
    .accounts({
        marketAccount: this.GenAccountAddress(),
        transactionsLog: transactions_log,
        wallet: payer_wallet.publicKey,
        transactionsProgram: TRANSACTION_PROGRAM_ID
    })
    .instruction()
}

/// :SELLER
AddSellerPhysicalTransactions = async(
    transactions_log,
payer_wallet
)=>{
    await market_accounts_program.methods
    .addSellerPhysicalTransactions("physical")
    .accounts({
        marketAccount: this.GenAccountAddress(),
        transactionsLog: transactions_log,
        wallet: payer_wallet.publicKey,
        transactionsProgram: TRANSACTION_PROGRAM_ID
    })
    .instruction()
}

AddSellerDigitalTransactions = async(
    transactions_log,
payer_wallet
)=>{
    await market_accounts_program.methods
    .addSellerDigitalTransactions("digital")
    .accounts({
        marketAccount: this.GenAccountAddress(),
        transactionsLog: transactions_log,
        wallet: payer_wallet.publicKey,
        transactionsProgram: TRANSACTION_PROGRAM_ID
    })
    .instruction()
}

AddSellerCommissionTransactions = async(
    transactions_log,
payer_wallet
)=>{
    await market_accounts_program.methods
    .addSellerCommissionTransactions("commission")
    .accounts({
        marketAccount: this.GenAccountAddress(),
        transactionsLog: transactions_log,
        wallet: payer_wallet.publicKey,
        transactionsProgram: TRANSACTION_PROGRAM_ID
    })
    .instruction()
}


//////////////////////////////////////////////////////////////////
/// TRANSFERS

InitiateTransfer = async(destination_wallet,
    payer_wallet
) => {
    
    if(typeof destination_wallet == "string"){
        destination_wallet = new PublicKey(destination_wallet);
    };

    let source = this.GenAccountAddress();
    let destination = this.GenAccountAddress(destination_wallet);
    let transfer_addr = this.GenTransferStruct(source, destination);

    await market_accounts_program.methods
    .initiateTransfer()
    .accounts({
        transferStruct: transfer_addr,
        sourceMarketAccount: source,
        sourceWallet: payer_wallet.publicKey,
        destinationMarketAccount: destination,
        destinationWallet: destination_wallet
    })
    .instruction()

}

ConfirmTransfer = async(
        payer_wallet
) => {
    const market_acc = this.GenAccountAddress();
    const transfer_addr = (await this.GetAccount(market_acc)).data.transfer_struct;

    const transfer_struct = await this.GetTransferStruct(transfer_addr);

    const source = transfer_struct.data.source;
    const source_wallet = (await this.GetAccount(source)).data.wallet;

    await market_accounts_program.methods
    .confirmTransfer()
    .accounts({
        sourceMarketAccount: source,
        sourceWallet: source_wallet,
        destinationMarketAccount: market_acc,
        destinationWallet: payer_wallet.publicKey,
        transferRequest: transfer_addr
    })
    .instruction()
}

DeclineTransfer = async(
        payer_wallet
) => {
    const market_acc = this.GenAccountAddress();
    const transfer_addr = (await this.GetAccount(market_acc)).data.transfer_struct;

    const transfer_struct = await this.GetTransferStruct(transfer_addr);

    const source = transfer_struct.data.source;
    const source_wallet = (await this.GetAccount(source)).data.wallet;
    const destination = transfer_struct.data.destination;
    const destination_wallet = (await this.GetAccount(destination)).data.wallet;

    await market_accounts_program.methods
    .declineTransfer()
    .accounts({
        sourceMarketAccount: source,
        sourceWallet: source_wallet,
        destinationMarketAccount: destination,
        destinationWallet: destination_wallet,
        transferRequest: transfer_addr,
        invoker: payer_wallet.publicKey,
    })
    .instruction()
}

//////////////////////////////////////////////////////////////////
//// REFLINK

CreateReflink = async (
        payer_wallet
) => {
    let reflink_addr = this.GenReflinkAddress(payer_wallet.publicKey);

    await market_accounts_program.methods
    .CreateReflink()
    .accounts({
        reflink: reflink_addr,
        marketAccount: this.GenAccountAddress(),
        wallet: this.provider.wallet.publicKey
    })
    .instruction()
}

DeleteReflink = async (
        payer_wallet
) => {
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

    await market_accounts_program.methods
    .deleteReflink()
    .accounts({
        reflink: reflink_addr,
        marketAccount: market_acc,
        wallet: payer_wallet.publicKey
    })
    .remainingAccounts(remaining_accs)
    .instruction()
}

//////////////////////////////////////////////////////////////////
/// STRUCT FETCHING

GetAccount = async (account_addr,
    payer_wallet
) => {
    if(!account_addr) return;
    if (typeof account_addr == "string"){
        account_addr = new PublicKey(account_addr);
    }

    return {
        address: account_addr,
        data: await market_accounts_program.account.orbitMarketAccount.fetch(account_addr),
        type: "MarketAccount"
    };
    
};

GetAccountTransfer = async (transfer_addr) => {
    if(!transfer_addr) return;
    try{
        if (typeof transfer_addr == "string"){
            transfer_addr = new PublicKey(transfer_addr);
        }

        let data = await market_accounts_program.account.accountTransfer.fetch(transfer_addr);

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
    
    return (await market_accounts_program.account.orbitMarketAccount.fetchMultiple(account_addrs)).map((dat, ind)=>{

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
            "data": (await market_accounts_program.account.orbitReflink.fetch(reflink_addr)),
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
        market_accounts_program_id
    )[0];
}

GenAccountAddress = (wallet_addr) => {
    if(!wallet_addr){
        wallet_addr = payer_wallet.publicKey
    }
    if(typeof wallet_addr == "string"){
        wallet_addr = new PublicKey(wallet_addr)
    };

    return PublicKey.findProgramAddressSync(
        [
            Buffer.from("orbit_account"),
            wallet_addr.toBuffer()
        ],
        market_accounts_program_id
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
        market_accounts_program_id
    )[0];
}

GenVoterIdAddress = () =>{
    return PublicKey.findProgramAddressSync(
        [
            Buffer.from("orbit_voters")
        ],
        market_accounts_program_id
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