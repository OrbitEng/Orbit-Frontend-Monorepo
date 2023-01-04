import * as anchor from '@project-serum/anchor';
import {PublicKey} from "@solana/web3.js";
import {TOKEN_PROGRAM_ID, getAssociatedTokenAddress} from "@solana/spl-token";
import {PRODUCT_PROGRAM_ID} from "./product-program";
import {TRANSACTION_PROGRAM_ID} from "./transaction-program";


const idl = require("../idls/orbit_market_accounts");

export const MARKET_ACCOUNTS_PROGRAM_ID = new PublicKey(idl.metadata.address);
export const MARKET_ACCOUNTS_PROGRAM = new anchor.Program(idl, idl.metadata.address);

///////////////////////////////////////
/// RPC CALLS

////////////////////////////////////////////////////////////////
/// ACCOUNT

export async function CreateAccount (metadata_link, media_link, reflink,
    payer_wallet
){

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
    
    await MARKET_ACCOUNTS_PROGRAM.methods
    .createAccount(media_link, metadata_link)
    .accounts({
        marketAccount: this.GenAccountAddress(payer_wallet.publicKey),
        voterIdStruct: voter_id_addr,
        wallet: this.provider.wallet.publicKey,
    })
    .remainingAccounts(reflink_arr)
    .instruction();
};

export async function UpdatePFP (
    new_pfp_link,
payer_wallet
){
    let market_account = this.GenAccountAddress();

    return MARKET_ACCOUNTS_PROGRAM.methods
    .updateProfileImage(new_pfp_link)
    .accounts({
        marketAccount: market_account,
        wallet: payer_wallet.publicKey
    })
    .instruction()
};

export async function UpdateMetadata (
    metadata_link,
payer_wallet
){
    return MARKET_ACCOUNTS_PROGRAM.methods
    .updateMetadata(metadata_link)
    .accounts({
        marketAccount: this.GenAccountAddress(),
        wallet: payer_wallet.publicKey
    })
    .instruction()
}

export async function SetReflink (
    reflink,
payer_wallet
){
    if(typeof reflink == "string"){
        reflink = new PublicKey(reflink);
    }

    await MARKET_ACCOUNTS_PROGRAM.methods
    .setReflink()
    .accounts({
        marketAccount: this.GenAccountAddress(),
        reflink: reflink,
        wallet: payer_wallet.publicKey
    })
    .instruction();
};

export async function RemoveReflink (
        payer_wallet
){
    const market_acc = this.GenAccountAddress();
    const reflink_addr = (await this.GetAccount(market_acc)).data.reflink;

    await MARKET_ACCOUNTS_PROGRAM.methods
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

export async function AddVendorPhysicalListings (
    listings_address,
payer_wallet
){
    if(typeof listings_address == "string"){
        listings_address = new PublicKey(listings_address)
    }

    await MARKET_ACCOUNTS_PROGRAM.methods
    .addVendorPhysicalListings("physical")
    .accounts({
        marketAccount: this.GenAccountAddress(),
        listingsStruct: listings_address,
        wallet: payer_wallet.publicKey,
        productProgram: PRODUCT_PROGRAM_ID
    })
    .instruction()
}

export async function AddVendorDigitalListings (
    listings_address,
payer_wallet
){
    if(typeof listings_address == "string"){
        listings_address = new PublicKey(listings_address)
    }

    await MARKET_ACCOUNTS_PROGRAM.methods
    .addVendorDigitalListings("digital")
    .accounts({
        marketAccount: this.GenAccountAddress(),
        listingsStruct: listings_address,
        wallet: payer_wallet.publicKey,
        productProgram: PRODUCT_PROGRAM_ID
    })
    .instruction()
}

export async function AddVendorCommissionListings (
    listings_address,
payer_wallet
){
    if(typeof listings_address == "string"){
        listings_address = new PublicKey(listings_address)
    }

    await MARKET_ACCOUNTS_PROGRAM.methods
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
export async function AddBuyerPhysicalTransactions (
    transactions_log,
payer_wallet
){
    await MARKET_ACCOUNTS_PROGRAM.methods
    .addBuyerPhysicalTransactions("physical")
    .accounts({
        marketAccount: this.GenAccountAddress(),
        transactionsLog: transactions_log,
        wallet: payer_wallet.publicKey,
        transactionsProgram: TRANSACTION_PROGRAM_ID
    })
    .instruction()
}

export async function AddBuyerDigitalTransactions (
    transactions_log,
payer_wallet
){
    await MARKET_ACCOUNTS_PROGRAM.methods
    .addBuyerDigitalTransactions("digital")
    .accounts({
        marketAccount: this.GenAccountAddress(),
        transactionsLog: transactions_log,
        wallet: payer_wallet.publicKey,
        transactionsProgram: TRANSACTION_PROGRAM_ID
    })
    .instruction()
}

export async function AddBuyerCommissionTransactions (
    transactions_log,
payer_wallet
){
    await MARKET_ACCOUNTS_PROGRAM.methods
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
export async function AddSellerPhysicalTransactions (
    transactions_log,
payer_wallet
){
    await MARKET_ACCOUNTS_PROGRAM.methods
    .addSellerPhysicalTransactions("physical")
    .accounts({
        marketAccount: this.GenAccountAddress(),
        transactionsLog: transactions_log,
        wallet: payer_wallet.publicKey,
        transactionsProgram: TRANSACTION_PROGRAM_ID
    })
    .instruction()
}

export async function AddSellerDigitalTransactions (
    transactions_log,
payer_wallet
){
    await MARKET_ACCOUNTS_PROGRAM.methods
    .addSellerDigitalTransactions("digital")
    .accounts({
        marketAccount: this.GenAccountAddress(),
        transactionsLog: transactions_log,
        wallet: payer_wallet.publicKey,
        transactionsProgram: TRANSACTION_PROGRAM_ID
    })
    .instruction()
}

export async function AddSellerCommissionTransactions (
    transactions_log,
payer_wallet
){
    await MARKET_ACCOUNTS_PROGRAM.methods
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

export async function InitiateTransfer (destination_wallet,
    payer_wallet
){
    
    if(typeof destination_wallet == "string"){
        destination_wallet = new PublicKey(destination_wallet);
    };

    let source = this.GenAccountAddress();
    let destination = this.GenAccountAddress(destination_wallet);
    let transfer_addr = this.GenTransferStruct(source, destination);

    await MARKET_ACCOUNTS_PROGRAM.methods
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

export async function ConfirmTransfer (
        payer_wallet
){
    const market_acc = this.GenAccountAddress();
    const transfer_addr = (await this.GetAccount(market_acc)).data.transfer_struct;

    const transfer_struct = await this.GetTransferStruct(transfer_addr);

    const source = transfer_struct.data.source;
    const source_wallet = (await this.GetAccount(source)).data.wallet;

    await MARKET_ACCOUNTS_PROGRAM.methods
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

export async function DeclineTransfer (
        payer_wallet
){
    const market_acc = this.GenAccountAddress();
    const transfer_addr = (await this.GetAccount(market_acc)).data.transfer_struct;

    const transfer_struct = await this.GetTransferStruct(transfer_addr);

    const source = transfer_struct.data.source;
    const source_wallet = (await this.GetAccount(source)).data.wallet;
    const destination = transfer_struct.data.destination;
    const destination_wallet = (await this.GetAccount(destination)).data.wallet;

    await MARKET_ACCOUNTS_PROGRAM.methods
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

export async function CreateReflink (
        payer_wallet
){
    let reflink_addr = this.GenReflinkAddress(payer_wallet.publicKey);

    await MARKET_ACCOUNTS_PROGRAM.methods
    .CreateReflink()
    .accounts({
        reflink: reflink_addr,
        marketAccount: this.GenAccountAddress(),
        wallet: this.provider.wallet.publicKey
    })
    .instruction()
}

export async function DeleteReflink (
        payer_wallet
){
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

    await MARKET_ACCOUNTS_PROGRAM.methods
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

export async function GetAccount (account_addr,
    payer_wallet
){
    if(!account_addr) return;
    if (typeof account_addr == "string"){
        account_addr = new PublicKey(account_addr);
    }

    return {
        address: account_addr,
        data: await MARKET_ACCOUNTS_PROGRAM.account.orbitMarketAccount.fetch(account_addr),
        type: "MarketAccount"
    };
    
};

export async function GetAccountTransfer (transfer_addr){
    if(!transfer_addr) return;
    try{
        if (typeof transfer_addr == "string"){
            transfer_addr = new PublicKey(transfer_addr);
        }

        let data = await MARKET_ACCOUNTS_PROGRAM.account.accountTransfer.fetch(transfer_addr);

        return {
            address: transfer_addr,
            data: data,
            type: "AccountTransfer"
        };
    }catch{
        return
    }
    
};

export async function GetMultipleMarketAccounts (account_addrs){
    if(!Array.isArray(account_addrs)){
        return [];
    }

    account_addrs = account_addrs.map((addr)=>{
        if(typeof addr == "string"){
            addr = new PublicKey(addr);
        }
        return addr
    })
    
    return (await MARKET_ACCOUNTS_PROGRAM.account.orbitMarketAccount.fetchMultiple(account_addrs)).map((dat, ind)=>{

        return {
            address: account_addrs[ind],
            data: dat,
            type: "MarketAccount"
        }
    });
};

export async function GetReflinkStruct (reflink_addr){
    if(typeof reflink_addr == "string"){
        reflink_addr = new PublicKey(reflink_addr);
    }

    try{
        return {
            "address": reflink_addr,
            "data": (await MARKET_ACCOUNTS_PROGRAM.account.orbitReflink.fetch(reflink_addr)),
            "type": "Reflink"
        }
    }catch{
        return;
    }
};

//////////////////////////////////////////////////////////////////
/// GENERATION UTILS

export function GenReflinkAddress (wallet_addr){
    if(typeof wallet_addr == "string"){
        wallet_addr = new PublicKey(wallet_addr)
    };

    let account_addr = this.GenAccountAddress(wallet_addr);

    return PublicKey.findProgramAddressSync(
        [
            Buffer.from("orbit_reflink"),
            account_addr.toBuffer()
        ],
        MARKET_ACCOUNTS_PROGRAM_ID
    )[0];
}

export function GenAccountAddress (wallet_addr){
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
        MARKET_ACCOUNTS_PROGRAM_ID
    )[0];
};

export function GenTransferStruct (source, destination){
    
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
        MARKET_ACCOUNTS_PROGRAM_ID
    )[0];
}

export function GenVoterIdAddress (){
    return PublicKey.findProgramAddressSync(
        [
            Buffer.from("orbit_voters")
        ],
        MARKET_ACCOUNTS_PROGRAM_ID
    )[0]
}

//////////////////////////////////////////////////////////
/// REFLINK
export async function ReflinkSolChain (reflink_address){
    let reflink = await this.GetReflinkStruct(reflink_address);
    return [reflink_address, reflink.data.reflinkOwner];
}

export async function ReflinkSplChain (reflink_address, currency){
    let reflink_sol_chain = await this.ReflinkSolChain(reflink_address);
    let ata_addr = getAssociatedTokenAddress(currency, reflink_sol_chain[1]);
    return [...reflink_sol_chain, ata_addr];
}