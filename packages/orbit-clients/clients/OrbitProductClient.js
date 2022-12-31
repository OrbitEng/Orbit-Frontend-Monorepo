import * as anchor from '@project-serum/anchor';
import {PublicKey} from "@solana/web3.js";

const idl = require("../idls/orbit_product");

product_program_id = new PublicKey(idl.metadata.address);
    
product_program = new anchor.Program(idl, idl.metadata.address);

////////////////////////////////////
/// ADMIN INITIALIZE

InitRecentListings = async(payer_wallet) => {
    return product_program.methods
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

InitCommissionsListings = async(market_type, payer_wallet) => {
    let listings_address = this.GenListingsAddress(market_type);

    await product_program.methods
    .initCommissionsListings()
    .accounts({
        vendorListings: listings_address,
        wallet: payer_wallet.publicKey
    })
    .instruction()
}
InitDigitalListings = async(market_type, payer_wallet) => {
    let listings_address = this.GenListingsAddress(market_type);

    await product_program.methods
    .initDigitalListings()
    .accounts({
        vendorListings: listings_address,
        wallet: payer_wallet.publicKey
    })
    .instruction()
}
InitPhysicalListings = async(market_type, payer_wallet) => {
    let listings_address = this.GenListingsAddress(market_type);

    await product_program.methods
    .initPhysicalListings()
    .accounts({
        vendorListings: listings_address,
        wallet: payer_wallet.publicKey
    })
    .instruction()
}

///////////////////////////////////////////////////
/// LIST PRODUCT

// can add recent_catalog to remaining accounts
ListCommissionProduct = async(
    product,
    metadata,
    add_to_recent,
    payer_wallet
) => {
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

    await product_program.methods
    .listCommissionProduct(metadata)
    .accounts({
        commissionProduct: product,
        vendorListings: vendor_listings,
        sellerWallet: payer_wallet.publicKey
    })
    .remainingAccounts(remaining_accounts)
    .instruction()
}
ListDigitalProduct = async(
    product,
    metadata,
    filetype,
    add_to_recent,
    payer_wallet
) => {
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

    await product_program.methods
    .listDigitalProduct(metadata, filetype)
    .accounts({
        digitalProduct: product,
        vendorListings: vendor_listings,
        sellerWallet: payer_wallet.publicKey
    })
    .remainingAccounts(remaining_accounts)
    .instruction()
}
ListPhysicalProduct = async(
    product,
    metadata,
    quantity,
    add_to_recent,
    payer_wallet
) => {
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


    await product_program.methods
    .listPhysicalProduct(metadata, new anchor.BN(quantity))
    .accounts({
        physProduct: product,
        vendorListings: vendor_listings,
        sellerWallet: payer_wallet.publicKey
    })
    .remainingAccounts(remaining_accounts)
    .instruction()
}

UnlistProduct = async(
    product,
    listings,
    payer_wallet
) => {
    if(typeof product == "string"){
        product = new PublicKey(product)
    }
    if(typeof listings == "string"){
        listings = new PublicKey(listings)
    }

    await product_program.methods
    .unlistProduct()
    .accounts({
        prod: product,
        vendorListings: listings,
        sellerWallet: payer_wallet.publicKey
    })
    .instruction()
}

/// EMERGENCY
FlushListings = async(
    listings_addr,
    payer_wallet
) => {
    if(typeof listings_addr == "string"){
        listings_addr = new PublicKey(listings_addr)
    }

    return product_program.methods
    .flushListings()
    .accounts({
        vendorListings: listings_addr,
        sellerWallet: payer_wallet.publicKey
    })
    .instruction()
}

//////////////////////////////////////////////////////////////
/// TRANSFER LISTINGS

TransferVendorListingsOwnership = async(
    listings_type,
    new_wallet_addr,
    payer_wallet
) => {
    if(typeof new_wallet_addr == "string"){
        new_wallet_addr = new PublicKey(new_wallet_addr)
    }

    let vendor_listings = this.GenListingsAddress(listings_type);

    await product_program.methods
    .transferVendorListingsOwnership()
    .accounts({
        vendorListings: vendor_listings,
        destinationWallet: new_wallet_addr,
        wallet: payer_wallet.publicKey
    })
    .instruction()
}

TransferAllVendorListingsOwnership = async(
    new_wallet_addr,
    payer_wallet
) => {

    if(typeof new_wallet_addr == "string"){
        new_wallet_addr = new PublicKey(new_wallet_addr)
    }

    let commission_listings = this.GenListingsAddress("commission");
    let digital_listings = this.GenListingsAddress("digital");
    let physical_listings = this.GenListingsAddress("physical");

    await product_program.methods
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
/// PRODUCT COMMON MODIFIERS

MarkProdAvailable = async(
    product,
    listings_address,
    payer_wallet
) => {

    if(typeof product == "string"){
        product = new PublicKey(product)
    }

    if(typeof listings_address == "string"){
        listings_address = new PublicKey(listings_address)
    }

    await product_program.methods
    .markProdAvailable()
    .accounts({
        product: product,
        vendorListings: listings_address,
        sellerWallet: payer_wallet.publicKey
    })
    .instruction()
}
MarkProdUnavailable = async(
    product,
    listings_address,
    payer_wallet
) => {

    if(typeof product == "string"){
        product = new PublicKey(product)
    }

    if(typeof listings_address == "string"){
        listings_address = new PublicKey(listings_address)
    }

    await product_program.methods
    .markProdUnavailable()
    .accounts({
        product: product,
        vendorListings: listings_address,
        sellerWallet: payer_wallet.publicKey
    })
    .instruction()
}

UpdateProductPrice = async(
    product,
    listings_address,
    price,
    payer_wallet
) => {
    if(typeof product == "string"){
        product = new PublicKey(product)
    }

    if(typeof listings_address == "string"){
        listings_address = new PublicKey(listings_address)
    }

    await product_program.methods
    .updateProductPrice(new anchor.BN(price))
    .accounts({
        product: product,
        vendorListings: listings_address,
        sellerWallet: payer_wallet.publicKey
    })
    .instruction()
}

SetMedia = async(
    product,
    listings_address,
    media_address,
    payer_wallet
) => {
    if(typeof product == "string"){
        product = new PublicKey(product)
    }

    if(typeof listings_address == "string"){
        listings_address = new PublicKey(listings_address)
    }

    await product_program.methods
    .setMedia(
        media_address
    )
    .accounts({
        product: product,
        vendorListings: listings_address,
        sellerWallet: payer_wallet.publicKey
    })
    .instruction()
}

SetProdInfo = async(
    product,
    listings_address,
    info_address,
    payer_wallet
) => {
    if(typeof product == "string"){
        product = new PublicKey(product)
    }

    if(typeof listings_address == "string"){
        listings_address = new PublicKey(listings_address)
    }

    await product_program.methods
    .setProdInfo(
        info_address
    )
    .accounts({
        product: product,
        vendorListings: listings_address,
        sellerWallet: payer_wallet.publicKey
    })
    .instruction()
}

//////////////////////////////////////////////////
/// PHYSICAL ONLY

UpdateProductQuantity = async(
    product,
    qnt = 0,
    payer_wallet
) => {
    if(typeof product == "string"){
        product = new PublicKey(product)
    }

    let listings_address = this.GenListingsAddress("physical")

    await product_program.methods
    .updateProductQuantity(new anchor.BN(qnt))
    .accounts({
        product: product,
        vendorListings: listings_address,
        sellerWallet: payer_wallet.publicKey
    })
    .instruction()
}

//////////////////////////////////////////////////
/// DIGITAL ONLY

// Text Video Audio Image Folder
SetFileType = async(
    product,
    payer_wallet,
    filetype = "Image"
) => {

    if(typeof product == "string"){
        product = new PublicKey(product)
    }

    let param = {};
    param[filetype] = {};

    let listings_address = this.GenListingsAddress("digital")

    await product_program.methods
    .setFileType(param)
    .accounts({
        product: product,
        vendorListings: listings_address,
        sellerWallet: payer_wallet.publicKey
    })
    .instruction()
}

//////////////////////////////////
/// GENERATION UTILTIES

GenListingsAddress = (product_type, voter_id) => {
    return PublicKey.findProgramAddressSync(
        [
            Buffer.from("vendor_listings"),
            Buffer.from(["commission","digital","physical"].indexOf(product_type)),
            voter_id.toBuffer()
        ],
        product_program_id
    )[0]
}

GenProductAddress = (product_index, vendor_listings, product_type) =>{
    if(typeof vendor_listings == "string"){
        vendor_listings = new PublicKey(vendor_listings);
    };
    return PublicKey.findProgramAddressSync(
        [
            Buffer.from(product_type+"_product"),
            vendor_listings.toBuffer(),
            Buffer.from([product_index])
        ],
        product_program_id
    )[0]
}

GenRecentListings = (product_type) => {
    return PublicKey.findProgramAddressSync(
        [
            Buffer.from("recent_listings"),
            Buffer.from(product_type)
        ],
        product_program_id
    )[0]
}

///////////////////////////////////
/// STRUCT FETCH UTILS

GetListingsStruct = async(address) =>{
    if(typeof address == "string"){
        address = new PublicKey(address)
    }
    return {
        address: address.toString(),
        data: await product_program.account.listingsStruct.fetch(address),
        type: "ListingsStruct"
    };
}
GetDigitalProduct = async(address) =>{
    if(typeof address == "string"){
        address = new PublicKey(address)
    }
    return {
        address: address.toString(),
        data: await product_program.account.digitalProduct.fetch(address),
        type: "DigitalProduct"
    };
}

GetMultipleDigitalProducts = async(addresses) =>{
    let prods = await product_program.account.digitalProduct.fetchMultiple(addresses);
    return prods.map((v, i)=>{
        return {
            address: addresses[i].toString(),
            data: v,
            type: "DigitalProduct"
        }
    })
}

GetPhysicalProduct = async(address) =>{
    if(typeof address == "string"){
        address = new PublicKey(address)
    }
    return {
        address: address.toString(),
        data: await product_program.account.physicalProduct.fetch(address),
        type: "PhysicalProduct"
    };
}

GetMultiplePhysicalProducts = async(addresses) =>{
    let prods = await product_program.account.physicalProduct.fetchMultiple(addresses);
    return prods.map((v, i)=>{
        return {
            address: addresses[i].toString(),
            data: v,
            type: "PhysicalProduct"
        }
    })
}

GetCommissionProduct = async(address) =>{
    if(typeof address == "string"){
        address = new PublicKey(address)
    }
    return {
        address: address.toString(),
        data: await product_program.account.commissionProduct.fetch(address),
        type: "CommissionProduct"
    };
}

GetMultipleCommissionProducts = async(addresses) =>{
    let prods = await product_program.account.commissionProduct.fetchMultiple(addresses);
    return prods.map((v, i)=>{
        return {
            address: addresses[i].toString(),
            data: v,
            type: "CommissionProduct"
        }
    })
}

GetRecentMarketListings = async(address) =>{
    if(typeof address == "string"){
        address = new PublicKey(address)
    }
    try{
        return {
            address: address.toString(),
            data: await product_program.account.recentMarketListings.fetch(address),
            type: "RecentMarketListings"
        }
    }catch(e){
        return undefined
    };
}

///////////////////////////////////////
/// PURE UTILS

FindProductAvailability = (product_struct, listings_struct) => {
    let outerind = Math.floor((product_struct.metadata.index)/64);
    let innerind = product_struct.metadata.index%64;
    return listings_struct.productAvailable[outerind].toString(2).split("").reverse().join("").charAt(innerind) == "1"
}

FindNextAvailableListingsAddress = (listings_struct) => {
    let all_addresses = listings_struct.addressAvailable[0].toString(2).split("").reverse().join("") + listings_struct.addressAvailable[1].toString(2).split("").reverse().join("") + listings_struct.addressAvailable[2].toString(2).split("").reverse().join("") + listings_struct.addressAvailable[3].toString(2).toString(2).split("").reverse().join("");
    return all_addresses.indexOf("1")
}

FindAllListings = (listings_struct) => {
    let all_addresses = listings_struct.addressAvailable[0].toString(2).split("").reverse().join("") + listings_struct.addressAvailable[1].toString(2).split("").reverse().join("") + listings_struct.addressAvailable[2].toString(2).split("").reverse().join("") + listings_struct.addressAvailable[3].toString(2).toString(2).split("").reverse().join("");
    let avail = all_addresses.split("").reduce((prev, curr, ind) =>{
        if(curr == "0") prev.push(ind);
        return prev;
    },[])
    return avail
}