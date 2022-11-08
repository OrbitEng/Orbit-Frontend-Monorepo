import * as anchor from '@project-serum/anchor';
import {PublicKey} from "@solana/web3.js";

const idl = require("../deps/orbit_product");

export default class ProductClient{
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

    ////////////////////////////////////
    /// ADMIN INITIALIZE

    InitRecentListings = async() => {
        return this.program.methods
        .initRecentListings()
        .accounts({
            physicalRecentListings: this.GenRecentListings("physical"),
            digitalRecentListings:  this.GenRecentListings("digital"),
            commissionRecentListings:  this.GenRecentListings("commission"),
            payer: this.provider.wallet.publicKey
        })
        .rpc()
    }

    ///////////////////////////////////////////////////////
    /// VENDOR LISTINGS

    InitVendorListings = async(market_type) => {
        let listings_address = this.GenListingsAddress(market_type);

        await this.program.methods
        .initVendorListings(market_type)
        .accounts({
            vendorListings: listings_address,
            wallet: this.provider.wallet.publicKey
        })
        .rpc()
    }

    ///////////////////////////////////////////////////
    /// LIST PRODUCT

    // can add recent_catalog to remaining accounts
    ListCommissionProduct = async(
        product,
        metadata,
        add_to_recent
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

        await this.program.methods
        .listCommissionProduct(metadata)
        .accounts({
            commissionProduct: product,
            vendorListings: vendor_listings,
            sellerWallet: this.provider.wallet.publicKey
        })
        .remainingAccounts(remaining_accounts)
        .rpc()
    }
    ListDigitalProduct = async(
        product,
        metadata,
        filetype,
        add_to_recent
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

        await this.program.methods
        .listDigitalProduct(metadata, filetype)
        .accounts({
            digitalProduct: product,
            vendorListings: vendor_listings,
            sellerWallet: this.provider.wallet.publicKey
        })
        .remainingAccounts(remaining_accounts)
        .rpc()
    }
    ListPhysicalProduct = async(
        product,
        metadata,
        quantity,
        add_to_recent
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


        await this.program.methods
        .listPhysicalProduct(metadata, new anchor.BN(quantity))
        .accounts({
            physProduct: product,
            vendorListings: vendor_listings,
            sellerWallet: this.provider.wallet.publicKey
        })
        .remainingAccounts(remaining_accounts)
        .rpc()
    }

    UnlistProduct = async(
        product,
        listings
    ) => {
        if(typeof product == "string"){
            product = new PublicKey(product)
        }
        if(typeof listings == "string"){
            listings = new PublicKey(listings)
        }

        await this.program.methods
        .unlistProduct()
        .accounts({
            prod: product,
            vendorListings: listings,
            sellerWallet: this.provider.wallet.publicKey
        })
        .rpc()
    }

    /// EMERGENCY
    FlushListings = async(
        listings_addr
    ) => {
        if(typeof listings_addr == "string"){
            listings_addr = new PublicKey(listings_addr)
        }

        return this.program.methods
        .flushListings()
        .accounts({
            vendorListings: listings_addr,
            sellerWallet: this.provider.wallet.publicKey
        })
        .rpc()
    }

    //////////////////////////////////////////////////////////////
    /// TRANSFER LISTINGS

    TransferVendorListingsOwnership = async(
        listings_type,
        new_wallet_addr
    ) => {
        if(typeof new_wallet_addr == "string"){
            new_wallet_addr = new PublicKey(new_wallet_addr)
        }

        let vendor_listings = this.GenListingsAddress(listings_type);

        await this.program.methods
        .transferVendorListingsOwnership()
        .accounts({
            vendorListings: vendor_listings,
            destinationWallet: new_wallet_addr,
            wallet: this.provider.wallet.publicKey
        })
        .rpc()
    }

    TransferAllVendorListingsOwnership = async(
        new_wallet_addr
    ) => {

        if(typeof new_wallet_addr == "string"){
            new_wallet_addr = new PublicKey(new_wallet_addr)
        }

        let commission_listings = this.GenListingsAddress("commission");
        let digital_listings = this.GenListingsAddress("digital");
        let physical_listings = this.GenListingsAddress("physical");

        await this.program.methods
        .transferAllVendorListingsOwnership()
        .accounts({
            physicalVendorListings: physical_listings,
            digitalVendorListings: digital_listings,
            commissionVendorListings: commission_listings,
            destinationWallet: new_wallet_addr,
            listingsOwner: this.provider.wallet.publicKey
        })
        .rpc()
    }

    
    ///////////////////////////////////////////////
    /// PRODUCT COMMON MODIFIERS
    
    MarkProdAvailable = async(
        product,
        listings_address
    ) => {

        if(typeof product == "string"){
            product = new PublicKey(product)
        }

        if(typeof listings_address == "string"){
            listings_address = new PublicKey(listings_address)
        }

        await this.program.methods
        .markProdAvailable()
        .accounts({
            product: product,
            vendorListings: listings_address,
            sellerWallet: this.provider.wallet.publicKey
        })
        .rpc()
    }
    MarkProdUnavailable = async(
        product,
        listings_address
    ) => {

        if(typeof product == "string"){
            product = new PublicKey(product)
        }

        if(typeof listings_address == "string"){
            listings_address = new PublicKey(listings_address)
        }

        await this.program.methods
        .markProdUnavailable()
        .accounts({
            product: product,
            vendorListings: listings_address,
            sellerWallet: this.provider.wallet.publicKey
        })
        .rpc()
    }
    
    UpdateProductPrice = async(
        product,
        listings_address,
        price
    ) => {
        if(typeof product == "string"){
            product = new PublicKey(product)
        }

        if(typeof listings_address == "string"){
            listings_address = new PublicKey(listings_address)
        }

        await this.program.methods
        .updateProductPrice(new anchor.BN(price))
        .accounts({
            product: product,
            vendorListings: listings_address,
            sellerWallet: this.provider.wallet.publicKey
        })
        .rpc()
    }

    SetMedia = async(
        product,
        listings_address,
        media_address
    ) => {
        if(typeof product == "string"){
            product = new PublicKey(product)
        }

        if(typeof listings_address == "string"){
            listings_address = new PublicKey(listings_address)
        }

        await this.program.methods
        .setMedia(
            media_address
        )
        .accounts({
            product: product,
            vendorListings: listings_address,
            sellerWallet: this.provider.wallet.publicKey
        })
        .rpc()
    }

    SetProdInfo = async(
        product,
        listings_address,
        info_address
    ) => {
        if(typeof product == "string"){
            product = new PublicKey(product)
        }

        if(typeof listings_address == "string"){
            listings_address = new PublicKey(listings_address)
        }

        await this.program.methods
        .setProdInfo(
            info_address
        )
        .accounts({
            product: product,
            vendorListings: listings_address,
            sellerWallet: this.provider.wallet.publicKey
        })
        .rpc()
    }

    //////////////////////////////////////////////////
    /// PHYSICAL ONLY

    UpdateProductQuantity = async(
        product,
        qnt = 0
    ) => {
        if(typeof product == "string"){
            product = new PublicKey(product)
        }

        let listings_address = this.GenListingsAddress("physical")

        await this.program.methods
        .updateProductQuantity(new anchor.BN(qnt))
        .accounts({
            product: product,
            vendorListings: listings_address,
            sellerWallet: this.provider.wallet.publicKey
        })
        .rpc()
    }
    
    //////////////////////////////////////////////////
    /// DIGITAL ONLY

    // Text Video Audio Image Folder
    SetFileType = async(
        product,
        filetype = "Image"
    ) => {

        if(typeof product == "string"){
            product = new PublicKey(product)
        }

        let param = {};
        param[filetype] = {};

        let listings_address = this.GenListingsAddress("digital")

        await this.program.methods
        .setFileType(param)
        .accounts({
            product: product,
            vendorListings: listings_address,
            sellerWallet: this.provider.wallet.publicKey
        })
        .rpc()
    }

    //////////////////////////////////
    /// GENERATION UTILTIES

    GenListingsAddress = (product_type, listings_wallet) => {
        if(!listings_wallet){
            listings_wallet = this.provider.wallet.publicKey;
        }

        if(typeof listings_wallet == "string"){
            listings_wallet = new PublicKey(listings_wallet);
        }

        return PublicKey.findProgramAddressSync(
            [
                Buffer.from("vendor_listings"),
                Buffer.from(product_type.toString()),
                listings_wallet.toBuffer()
            ],
            this.programid
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
            this.programid
        )[0]
    }

    GenRecentListings = (product_type) => {
        return PublicKey.findProgramAddressSync(
            [
                Buffer.from("recent_listings"),
                Buffer.from(product_type)
            ],
            this.programid
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
            data: await this.program.account.listingsStruct.fetch(address),
            type: "ListingsStruct"
        };
    }
    GetDigitalProduct = async(address) =>{
        if(typeof address == "string"){
            address = new PublicKey(address)
        }
        return {
            address: address.toString(),
            data: await this.program.account.digitalProduct.fetch(address),
            type: "DigitalProduct"
        };
    }

    GetMultipleDigitalProducts = async(addresses) =>{
        let prods = await this.program.account.digitalProduct.fetchMultiple(addresses);
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
            data: await this.program.account.physicalProduct.fetch(address),
            type: "PhysicalProduct"
        };
    }

    GetMultiplePhysicalProducts = async(addresses) =>{
        let prods = await this.program.account.physicalProduct.fetchMultiple(addresses);
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
            data: await this.program.account.commissionProduct.fetch(address),
            type: "CommissionProduct"
        };
    }

    GetMultipleCommissionProducts = async(addresses) =>{
        let prods = await this.program.account.commissionProduct.fetchMultiple(addresses);
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
                data: await this.program.account.recentMarketListings.fetch(address),
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
}