import * as anchor from '@project-serum/anchor';
import {PublicKey} from "@solana/web3.js";

const idl = require("../idls/orbit_product");

export const PRODUCT_PROGRAM_ID = new PublicKey(idl.metadata.address);
export const PRODUCT_PROGRAM = new anchor.Program(idl, idl.metadata.address);

////////////////////////////////////
/// ADMIN INITIALIZE

export async function InitRecentListings (payer_wallet){
    return PRODUCT_PROGRAM.methods
    .initRecentListings()
    .accounts({
        physicalRecentListings: this.GenRecentListings("physical"),
        digitalRecentListings:  this.GenRecentListings("digital"),
        commissionRecentListings:  this.GenRecentListings("commission"),
        payer: payer_wallet.publicKey
    })
    .instruction()
}

///////////////////////////////////////////////////////
/// VENDOR LISTINGS

export async function InitCommissionsListings (payer_wallet, voter_id){

    await PRODUCT_PROGRAM.methods
    .initCommissionsListings()
    .accounts({
        vendorListings: this.GenListingsAddress("commission", voter_id),
        wallet: payer_wallet.publicKey
    })
    .instruction()
}
export async function InitDigitalListings (payer_wallet, voter_id){

    await PRODUCT_PROGRAM.methods
    .initDigitalListings()
    .accounts({
        vendorListings: this.GenListingsAddress("digital", voter_id),
        wallet: payer_wallet.publicKey
    })
    .instruction()
}
export async function InitPhysicalListings (payer_wallet, voter_id){

    await PRODUCT_PROGRAM.methods
    .initPhysicalListings()
    .accounts({
        vendorListings: this.GenListingsAddress("physical", voter_id),
        wallet: payer_wallet.publicKey
    })
    .instruction()
}

///////////////////////////////////////////////////
/// LIST PRODUCT

// can add recent_catalog to remaining accounts
export async function ListCommissionProduct (
    product,
    metadata,
    add_to_recent,
    payer_wallet
){
    if(typeof product == "string"){
        product = new PublicKey(product)
    }

    let remaining_accounts = add_to_recent ? [
        {
            pubkey: this.GenRecentListings("commission"),
            isWritable: true,
            isSigner: false 
        }] : [];
    let vendor_listings = this.GenListingsAddress("commission");

    await PRODUCT_PROGRAM.methods
    .listCommissionProduct(metadata)
    .accounts({
        commissionProduct: product,
        vendorListings: vendor_listings,
        sellerWallet: payer_wallet.publicKey
    })
    .remainingAccounts(remaining_accounts)
    .instruction()
}
export async function ListDigitalProduct (
    product,
    metadata,
    filetype,
    add_to_recent,
    payer_wallet
){
    if(typeof product == "string"){
        product = new PublicKey(product)
    }

    let remaining_accounts = add_to_recent ? [
        {
            pubkey: this.GenRecentListings("digital"),
            isWritable: true,
            isSigner: false 
        }] : [];
    let vendor_listings = this.GenListingsAddress("digital");

    await PRODUCT_PROGRAM.methods
    .listDigitalProduct(metadata, filetype)
    .accounts({
        digitalProduct: product,
        vendorListings: vendor_listings,
        sellerWallet: payer_wallet.publicKey
    })
    .remainingAccounts(remaining_accounts)
    .instruction()
}
export async function ListPhysicalProduct (
    product,
    metadata,
    quantity,
    add_to_recent,
    payer_wallet
){
    if(typeof product == "string"){
        product = new PublicKey(product)
    }

    let remaining_accounts = add_to_recent ? [
        {
            pubkey: this.GenRecentListings("physical"),
            isWritable: true,
            isSigner: false 
        }] : [];
    let vendor_listings = this.GenListingsAddress("physical");


    await PRODUCT_PROGRAM.methods
    .listPhysicalProduct(metadata, new anchor.BN(quantity))
    .accounts({
        physProduct: product,
        vendorListings: vendor_listings,
        sellerWallet: payer_wallet.publicKey
    })
    .remainingAccounts(remaining_accounts)
    .instruction()
}

export async function UnlistPhysicalProduct (
    product,
    market_account,
    payer_wallet
){
    let listings = this.GenListingsAddress("physical", market_account.data.metadata.voter_id);
    await PRODUCT_PROGRAM.methods
    .unlistPhysicalProduct()
    .accounts({
        prod: typeof product == "string" ? new PublicKey(product) : product,
        vendorListings: listings,
        vendorAccount: market_account.address,
        wallet: payer_wallet.publicKey
    })
    .instruction()
}
export async function UnlistDigitalProduct (
    product,
    market_account,
    payer_wallet
){
    let listings = this.GenListingsAddress("digital", market_account.data.metadata.voter_id);
    await PRODUCT_PROGRAM.methods
    .unlistDigitalProduct()
    .accounts({
        prod: product,
        vendorListings: listings,
        sellerWallet: payer_wallet.publicKey
    })
    .instruction()
}
export async function UnlistCommissionProduct (
    product,
    market_account,
    payer_wallet
){
    let listings = this.GenListingsAddress("commission", market_account.data.metadata.voter_id);
    await PRODUCT_PROGRAM.methods
    .unlistCommissionProduct()
    .accounts({
        vendorListings: product,
        vendorListings: listings,
        sellerWallet: payer_wallet.publicKey
    })
    .instruction()
}

/// EMERGENCY
export async function FlushListings (
    listings_addr,
    payer_wallet
){
    if(typeof listings_addr == "string"){
        listings_addr = new PublicKey(listings_addr)
    }

    return PRODUCT_PROGRAM.methods
    .flushListings()
    .accounts({
        vendorListings: listings_addr,
        sellerWallet: payer_wallet.publicKey
    })
    .instruction()
}

//////////////////////////////////////////////////////////////
/// TRANSFER LISTINGS

export async function TransferVendorListingsOwnership (
    listings_type,
    new_wallet_addr,
    payer_wallet
){
    if(typeof new_wallet_addr == "string"){
        new_wallet_addr = new PublicKey(new_wallet_addr)
    }

    let vendor_listings = this.GenListingsAddress(listings_type);

    await PRODUCT_PROGRAM.methods
    .transferVendorListingsOwnership()
    .accounts({
        vendorListings: vendor_listings,
        destinationWallet: new_wallet_addr,
        wallet: payer_wallet.publicKey
    })
    .instruction()
}

export async function TransferAllVendorListingsOwnership (
    new_wallet_addr,
    payer_wallet
){

    if(typeof new_wallet_addr == "string"){
        new_wallet_addr = new PublicKey(new_wallet_addr)
    }

    let commission_listings = this.GenListingsAddress("commission");
    let digital_listings = this.GenListingsAddress("digital");
    let physical_listings = this.GenListingsAddress("physical");

    await PRODUCT_PROGRAM.methods
    .transferAllVendorListingsOwnership()
    .accounts({
        physicalVendorListings: physical_listings,
        digitalVendorListings: digital_listings,
        commissionVendorListings: commission_listings,
        destinationWallet: new_wallet_addr,
        listingsOwner: payer_wallet.publicKey
    })
    .instruction()
}


///////////////////////////////////////////////
/// PHYSICAL PROD COMMON MODIFIERS

export async function PhysicalMarkProdAvailable (
    product,
    market_acc,
    payer_wallet
){

    await PRODUCT_PROGRAM.methods
    .physicalMarkAvailable()
    .accounts({
        product: typeof product == "string" ? new PublicKey(product) : product,
        vendorListings: this.GenListingsAddress("physical", market_acc.data.metadata.voter_id),
        vendorAccount: market_acc.address,
        sellerWallet: payer_wallet.publicKey
    })
    .instruction()
}
export async function PhysicalMarkProdUnavailable (
    product,
    market_acc,
    payer_wallet
){
    await PRODUCT_PROGRAM.methods
    .physicalMarkUnavailable()
    .accounts({
        product: typeof product == "string" ? new PublicKey(product) : product,
        vendorListings: this.GenListingsAddress("physical", market_acc.data.metadata.voter_id),
        vendorAccount: market_acc.address,
        sellerWallet: payer_wallet.publicKey
    })
    .instruction()
}

export async function PhysicalUpdateProductPrice (
    product,
    price,
    payer_wallet
){

    await PRODUCT_PROGRAM.methods
    .physicalUpdatePrice(new anchor.BN(price))
    .accounts({
        product: typeof product == "string" ? new PublicKey(product) : product,
        vendorAccount: typeof account_addr == "string" ? new PublicKey(account_addr) : account_addr,
        sellerWallet: payer_wallet.publicKey
    })
    .instruction()
}

export async function PhysicalSetMedia (
    product,
    media_address,
    payer_wallet
){

    await PRODUCT_PROGRAM.methods
    .physicalUpdateMedia(
        media_address
    )
    .accounts({
        product: typeof product == "string" ? new PublicKey(product) : product,
        vendorAccount: typeof account_addr == "string" ? new PublicKey(account_addr) : account_addr,
        sellerWallet: payer_wallet.publicKey
    })
    .instruction()
}

export async function PhysicalSetDeliveryEstimate (
    product,
    delivery_eta,
    payer_wallet
){

    await PRODUCT_PROGRAM.methods
    .physicalUpdateDeliveryEstimate(
        new anchor.BN(delivery_eta)
    )
    .accounts({
        product: typeof product == "string" ? new PublicKey(product) : product,
        vendorAccount: typeof account_addr == "string" ? new PublicKey(account_addr) : account_addr,
        sellerWallet: payer_wallet.publicKey
    })
    .instruction()
}

export async function PhysicalSetProdInfo (
    product,
    info_address,
    payer_wallet
){

    await PRODUCT_PROGRAM.methods
    .physicalUpdateInfo(
        info_address
    )
    .accounts({
        product: typeof product == "string" ? new PublicKey(product) : product,
        vendorAccount: typeof account_addr == "string" ? new PublicKey(account_addr) : account_addr,
        sellerWallet: payer_wallet.publicKey
    })
    .instruction()
}

///////////////////////////////////////////////
/// DIGITAL PROD COMMON MODIFIERS

export async function DigitalMarkProdAvailable (
    product,
    market_acc,
    payer_wallet
){

    await PRODUCT_PROGRAM.methods
    .digitalMarkAvailable()
    .accounts({
        product: typeof product == "string" ? new PublicKey(product) : product,
        vendorListings: this.GenListingsAddress("digital", market_acc.data.metadata.voter_id),
        vendorAccount: market_acc.address,
        sellerWallet: payer_wallet.publicKey
    })
    .instruction()
}
export async function DigitalMarkProdUnavailable (
    product,
    market_acc,
    payer_wallet
){
    await PRODUCT_PROGRAM.methods
    .digitalMarkUnavailable()
    .accounts({
        product: typeof product == "string" ? new PublicKey(product) : product,
        vendorListings: this.GenListingsAddress("digital", market_acc.data.metadata.voter_id),
        vendorAccount: market_acc.address,
        sellerWallet: payer_wallet.publicKey
    })
    .instruction()
}

export async function DigitalUpdateProductPrice (
    product,
    price,
    payer_wallet
){

    await PRODUCT_PROGRAM.methods
    .digitalUpdatePrice(new anchor.BN(price))
    .accounts({
        product: typeof product == "string" ? new PublicKey(product) : product,
        vendorAccount: typeof account_addr == "string" ? new PublicKey(account_addr) : account_addr,
        sellerWallet: payer_wallet.publicKey
    })
    .instruction()
}

export async function DigitalSetMedia (
    product,
    media_address,
    payer_wallet
){

    await PRODUCT_PROGRAM.methods
    .digitalUpdateMedia(
        media_address
    )
    .accounts({
        product: typeof product == "string" ? new PublicKey(product) : product,
        vendorAccount: typeof account_addr == "string" ? new PublicKey(account_addr) : account_addr,
        sellerWallet: payer_wallet.publicKey
    })
    .instruction()
}

export async function DigitalSetDeliveryEstimate (
    product,
    delivery_eta,
    payer_wallet
){

    await PRODUCT_PROGRAM.methods
    .digitalUpdateDeliveryEstimate(
        new anchor.BN(delivery_eta)
    )
    .accounts({
        product: typeof product == "string" ? new PublicKey(product) : product,
        vendorAccount: typeof account_addr == "string" ? new PublicKey(account_addr) : account_addr,
        sellerWallet: payer_wallet.publicKey
    })
    .instruction()
}

export async function DigitalSetProdInfo (
    product,
    info_address,
    payer_wallet
){

    await PRODUCT_PROGRAM.methods
    .digitalUpdateInfo(
        info_address
    )
    .accounts({
        product: typeof product == "string" ? new PublicKey(product) : product,
        vendorAccount: typeof account_addr == "string" ? new PublicKey(account_addr) : account_addr,
        sellerWallet: payer_wallet.publicKey
    })
    .instruction()
}

///////////////////////////////////////////////
/// COMMISSION PROD COMMON MODIFIERS

export async function CommissionMarkProdAvailable (
    product,
    market_acc,
    payer_wallet
){

    await PRODUCT_PROGRAM.methods
    .commissionMarkAvailable()
    .accounts({
        product: typeof product == "string" ? new PublicKey(product) : product,
        vendorListings: this.GenListingsAddress("commission", market_acc.data.metadata.voter_id),
        vendorAccount: market_acc.address,
        sellerWallet: payer_wallet.publicKey
    })
    .instruction()
}
export async function CommissionMarkProdUnavailable (
    product,
    market_acc,
    payer_wallet
){
    await PRODUCT_PROGRAM.methods
    .commissionMarkUnavailable()
    .accounts({
        product: typeof product == "string" ? new PublicKey(product) : product,
        vendorListings: this.GenListingsAddress("commission", market_acc.data.metadata.voter_id),
        vendorAccount: market_acc.address,
        sellerWallet: payer_wallet.publicKey
    })
    .instruction()
}

export async function CommissionUpdateProductPrice (
    product,
    price,
    payer_wallet
){

    await PRODUCT_PROGRAM.methods
    .commissionUpdatePrice(new anchor.BN(price))
    .accounts({
        product: typeof product == "string" ? new PublicKey(product) : product,
        vendorAccount: typeof account_addr == "string" ? new PublicKey(account_addr) : account_addr,
        sellerWallet: payer_wallet.publicKey
    })
    .instruction()
}

export async function CommissionSetMedia (
    product,
    media_address,
    payer_wallet
){

    await PRODUCT_PROGRAM.methods
    .commissionUpdateMedia(
        media_address
    )
    .accounts({
        product: typeof product == "string" ? new PublicKey(product) : product,
        vendorAccount: typeof account_addr == "string" ? new PublicKey(account_addr) : account_addr,
        sellerWallet: payer_wallet.publicKey
    })
    .instruction()
}

export async function CommissionSetDeliveryEstimate (
    product,
    delivery_eta,
    payer_wallet
){

    await PRODUCT_PROGRAM.methods
    .commissionUpdateDeliveryEstimate(
        new anchor.BN(delivery_eta)
    )
    .accounts({
        product: typeof product == "string" ? new PublicKey(product) : product,
        vendorAccount: typeof account_addr == "string" ? new PublicKey(account_addr) : account_addr,
        sellerWallet: payer_wallet.publicKey
    })
    .instruction()
}

export async function CommissionSetProdInfo (
    product,
    info_address,
    payer_wallet
){

    await PRODUCT_PROGRAM.methods
    .commissionUpdateInfo(
        info_address
    )
    .accounts({
        product: typeof product == "string" ? new PublicKey(product) : product,
        vendorAccount: typeof account_addr == "string" ? new PublicKey(account_addr) : account_addr,
        sellerWallet: payer_wallet.publicKey
    })
    .instruction()
}

//////////////////////////////////////////////////
/// PHYSICAL ONLY

export async function UpdateProductQuantity (
    product,
    qnt = 0,
    market_acc,
    payer_wallet
){

    await PRODUCT_PROGRAM.methods
    .updateProductQuantity(new anchor.BN(qnt))
    .accounts({
        product: typeof product == "string" ? new PublicKey(product) : product,
        vendorListings: this.GenListingsAddress("physical", market_acc.data.metadata.voter_id),
        sellerWallet: payer_wallet.publicKey
    })
    .instruction()
}

//////////////////////////////////////////////////
/// DIGITAL ONLY

// Text Video Audio Image Folder
export async function SetFileType (
    product,
    market_acc,
    payer_wallet,
    filetype = "Image"
){

    if(typeof product == "string"){
        product = new PublicKey(product)
    }

    let param = {};
    param[filetype] = {};

    await PRODUCT_PROGRAM.methods
    .setFileType(param)
    .accounts({
        product: product,
        vendorListings: this.GenListingsAddress("digital", market_acc.data.metadata.voter_id),
        sellerWallet: payer_wallet.publicKey
    })
    .instruction()
}

//////////////////////////////////
/// GENERATION UTILTIES

export function GenListingsAddress (product_type, voter_id){
    return PublicKey.findProgramAddressSync(
        [
            Buffer.from("vendor_listings"),
            Buffer.from(["commission","digital","physical"].indexOf(product_type)),
            voter_id.toBuffer()
        ],
        PRODUCT_PROGRAM_ID
    )[0]
}

export function GenProductAddress (product_index, vendor_listings, product_type){
    if(typeof vendor_listings == "string"){
        vendor_listings = new PublicKey(vendor_listings);
    };
    return PublicKey.findProgramAddressSync(
        [
            Buffer.from(product_type+"_product"),
            vendor_listings.toBuffer(),
            Buffer.from([product_index])
        ],
        PRODUCT_PROGRAM_ID
    )[0]
}

export function GenRecentListings (product_type){
    return PublicKey.findProgramAddressSync(
        [
            Buffer.from("recent_listings"),
            Buffer.from(product_type)
        ],
        PRODUCT_PROGRAM_ID
    )[0]
}

///////////////////////////////////
/// STRUCT FETCH UTILS

export async function GetListingsStruct (address){
    if(typeof address == "string"){
        address = new PublicKey(address)
    }
    return {
        address: address.toString(),
        data: await PRODUCT_PROGRAM.account.listingsStruct.fetch(address),
        type: "ListingsStruct"
    };
}
export async function GetDigitalProduct (address){
    if(typeof address == "string"){
        address = new PublicKey(address)
    }
    return {
        address: address.toString(),
        data: await PRODUCT_PROGRAM.account.digitalProduct.fetch(address),
        type: "DigitalProduct"
    };
}

export async function GetMultipleDigitalProducts (addresses){
    let prods = await PRODUCT_PROGRAM.account.digitalProduct.fetchMultiple(addresses);
    return prods.map((v, i)=>{
        return {
            address: addresses[i].toString(),
            data: v,
            type: "DigitalProduct"
        }
    })
}

export async function GetPhysicalProduct (address){
    if(typeof address == "string"){
        address = new PublicKey(address)
    }
    return {
        address: address.toString(),
        data: await PRODUCT_PROGRAM.account.physicalProduct.fetch(address),
        type: "PhysicalProduct"
    };
}

export async function GetMultiplePhysicalProducts (addresses){
    let prods = await PRODUCT_PROGRAM.account.physicalProduct.fetchMultiple(addresses);
    return prods.map((v, i)=>{
        return {
            address: addresses[i].toString(),
            data: v,
            type: "PhysicalProduct"
        }
    })
}

export async function GetCommissionProduct (address){
    if(typeof address == "string"){
        address = new PublicKey(address)
    }
    return {
        address: address.toString(),
        data: await PRODUCT_PROGRAM.account.commissionProduct.fetch(address),
        type: "CommissionProduct"
    };
}

export async function GetMultipleCommissionProducts (addresses){
    let prods = await PRODUCT_PROGRAM.account.commissionProduct.fetchMultiple(addresses);
    return prods.map((v, i)=>{
        return {
            address: addresses[i].toString(),
            data: v,
            type: "CommissionProduct"
        }
    })
}

export async function GetRecentMarketListings (address){
    if(typeof address == "string"){
        address = new PublicKey(address)
    }
    try{
        return {
            address: address.toString(),
            data: await PRODUCT_PROGRAM.account.recentMarketListings.fetch(address),
            type: "RecentMarketListings"
        }
    }catch(e){
        return undefined
    };
}

///////////////////////////////////////
/// PURE UTILS

export function FindProductAvailability(product_struct, listings_struct){
    let outerind = Math.floor((product_struct.metadata.index)/64);
    let innerind = product_struct.metadata.index%64;
    return listings_struct.productAvailable[outerind].toString(2).split("").reverse().join("").charAt(innerind) == "1"
}

export function FindNextAvailableListingsAddress(listings_struct){
    let all_addresses = listings_struct.addressAvailable[0].toString(2).split("").reverse().join("") + listings_struct.addressAvailable[1].toString(2).split("").reverse().join("") + listings_struct.addressAvailable[2].toString(2).split("").reverse().join("") + listings_struct.addressAvailable[3].toString(2).toString(2).split("").reverse().join("");
    return all_addresses.indexOf("1")
}

export function FindAllListings(listings_struct){
    let all_addresses = listings_struct.addressAvailable[0].toString(2).split("").reverse().join("") + listings_struct.addressAvailable[1].toString(2).split("").reverse().join("") + listings_struct.addressAvailable[2].toString(2).split("").reverse().join("") + listings_struct.addressAvailable[3].toString(2).toString(2).split("").reverse().join("");
    let avail = all_addresses.split("").reduce((prev, curr, ind) =>{
        if(curr == "0") prev.push(ind);
        return prev;
    },[])
    return avail
}