import { useContext, useState, useCallback } from "react";
import {PublicKey} from "@solana/web3.js";
import { BN } from "@coral-xyz/anchor";
import BundlrCtx from "@contexts/BundlrCtx";

import { PRODUCT_PROGRAM } from "orbit-clients";

export function DigitalProductFunctionalities(props){
    const {bundlrClient} = useContext(BundlrCtx);
    

    const CreateDigitalListingsCatalog = async(market_acc, wallet)=>{
        await PRODUCT_PROGRAM.InitDigitalListings(wallet, market_acc);
    }

    const ListDigitalProduct = async(
        market_acc,
        next_index,
        prod_addr,
        listings_addr,
        price,
        deliveryEstimate = 14,
        name,
        description,
        files,
        fileType = "Image",
        add_to_recent,
        payer_wallet
    ) => {
        if(files.length <= 0) return;
        
        let buffers = files.join(">UwU<");

        let media_url = await bundlrClient.UploadBufferInstruction(buffers);
        let desc_url = await bundlrClient.UploadBufferInstruction(
            JSON.stringify({
                name: name,
                description: description
            })
        );
        

        let funding_ix = (await bundlrClient.FundInstructionFiles([media_url, desc_url])).tx.instructions[0];
        let update_ix = await PRODUCT_PROGRAM.ListDigitalProduct(
            prod_addr,
            {
                info: desc_url.id,
                ownerCatalog: market_acc.data.voterId,
                index: next_index,
                price: new BN(price),
                deliveryEstimate: new BN(deliveryEstimate),
                media: media_url.id,
                timesSold: new BN(0),
                searchIndexed: false
            },
            fileType,
            add_to_recent,
            market_acc,
            listings_addr,
            payer_wallet
        );

        return [
            [funding_ix, update_ix],
            [desc_url, media_url]
        ];
    }

    // Text, Video, Audio, Image, Folder
    const SetFileType = async(
        prod_addr,
        file_type = "Image"
    ) =>{
        
        return PRODUCT_PROGRAM.SetFileType(
            prod_addr,
            file_type
        )
    }

    const ChangeAvailability = async(market_acc, prod_addr, vendor_wallet, available = false) =>{
        if (available){
            await PRODUCT_PROGRAM.MarkProdAvailable(prod_addr, prod_addr, market_acc, vendor_wallet);
        }else{
            await PRODUCT_PROGRAM.MarkProdUnavailable(prod_addr, prod_addr, market_acc, vendor_wallet);
        }
    }

    const ChangePrice = async(market_acc, prod_addr, new_price = 0) =>{
        
        return PRODUCT_PROGRAM.UpdateProductPrice(
            prod_addr,
            PRODUCT_PROGRAM.GenListingsAddress("digital", market_acc.data.voterId),
            new_price
        )
    }


    const SetMedia = async(market_acc, prod_addr, files) =>{
        
        let buffers = files.join(">UwU<")

        let media_item = await bundlrClient.UploadBufferInstruction(buffers);

        let update_ix = await PRODUCT_PROGRAM.SetMedia(
            prod_addr,
            PRODUCT_PROGRAM.GenListingsAddress("digital", market_acc.data.voterId),
            media_item.id
        );
        let funding_ix = (await bundlrClient.FundInstructionFiles([media_item])).tx.instructions[0];

        return [
            [funding_ix, update_ix],
            [media_item]
        ]
    }

    const SetInfo = async (market_acc, prod_addr, name = "prod name", desc = "prod desc") =>{
        let info_item = await bundlrClient.UploadBufferInstruction(JSON.stringify({
            name: name,
            description: desc
        }));

        let funding_ix = (await bundlrClient.FundInstructionFiles([info_item])).tx.instructions[0];

        let update_ix = await PRODUCT_PROGRAM.SetProdInfo(
            prod_addr,
            PRODUCT_PROGRAM.GenListingsAddress("digital", market_acc.data.voterId),
            info_item.id
        );

        return [
            [funding_ix, update_ix],
            [info_item]
        ]
    }

    ////////////////////////////////////////////////
    /// FETCHING UTILS

    const GetAllVendorDigitalProducts = async(voter_id) =>{
        let listings_addr = PRODUCT_PROGRAM.GenListingsAddress("digital", voter_id);
        let listings_struct = (await PRODUCT_PROGRAM.GetListingsStruct(listings_addr)).data;
        let indexes = PRODUCT_PROGRAM.FindAllListings(listings_struct).map((ind)=>{
            return PRODUCT_PROGRAM.GenProductAddress(
                ind, listings_addr, "digital"
            )
        })

        return (await PRODUCT_PROGRAM.GetMultipleDigitalProducts(
            indexes
        )).filter(prod => prod.data != undefined);
    }

    return {
        CreateDigitalListingsCatalog,
        ListDigitalProduct,
        SetFileType,
        ChangeAvailability,
        ChangePrice,
        SetMedia,
        SetInfo,
        GetAllVendorDigitalProducts
    }
}

export function PhysicalProductFunctionalities(props){
    
    const {bundlrClient} = useContext(BundlrCtx);
    

    /// SELLER UTILS
    const CreatePhysicalListingsCatalog = async(market_acc, wallet)=>{
        await PRODUCT_PROGRAM.InitPhysicalListings(wallet, market_acc)
    }

    const ListPhysicalProduct = async(
        market_acc,
        next_index,
        prod_addr,
        listings_addr,
        price,
        deliveryEstimate = 14,
        name,
        description,
        quantity,
        files,
        add_to_recent,
        payer_wallet
    ) => {
        if(files.length <= 0) return;

        let buffers = files.join(">UwU<");

        let media_url = await bundlrClient.UploadBufferInstruction(buffers);
        let desc_url = await bundlrClient.UploadBufferInstruction(JSON.stringify({
            name: name,
            description: description
        }));

        let funding_ix = (await bundlrClient.FundInstructionFiles([media_url, desc_url])).tx.instructions[0];

        let update_ix = await PRODUCT_PROGRAM.ListPhysicalProduct(
            prod_addr,
            {
                info: desc_url.id,
                ownerCatalog: market_acc.data.voterId,
                index: next_index,
                price: new BN(price),
                deliveryEstimate: deliveryEstimate,
                media: media_url.id,
                timesSold: new BN,
                searchIndexed: false,
            },
            quantity,
            add_to_recent,
            market_acc,
            listings_addr,
            payer_wallet
        );

        return [
            [funding_ix, update_ix],
            [desc_url, media_url]
        ];
    }

    const ChangeAvailability = async(market_acc, prod_addr, vendor_wallet, available = false) =>{
        if (available){
            await PRODUCT_PROGRAM.PhysicalMarkProdAvailable(prod_addr, market_acc, vendor_wallet);
        }else{
            await PRODUCT_PROGRAM.PhysicalMarkProdUnavailable(prod_addr, market_acc, vendor_wallet);
        }
    }

    const ChangePrice = async(market_acc, prod_addr, new_price = 0) =>{

        return PRODUCT_PROGRAM.UpdateProductPrice(
            prod_addr,
            PRODUCT_PROGRAM.GenListingsAddress("physical", market_acc.data.voterId),
            new_price
        )
    }
    const ChangeQuantity = async(prod_addr, new_quantity = 0) =>{

        return PRODUCT_PROGRAM.UpdateProductQuantity(
            prod_addr,
            new_quantity
        )
    }

    const SetMedia = async(market_acc, prod_addr, files) =>{

        let buffers = files.join(">UwU<")

        let media_item = await bundlrClient.UploadBufferInstruction(buffers);

        let update_ix = await PRODUCT_PROGRAM.SetMedia(
            prod_addr,
            PRODUCT_PROGRAM.GenListingsAddress("physical", market_acc.data.voterId),
            media_item.id
        )

        let funding_ix = (await bundlrClient.FundInstructionFiles([media_item])).tx.instructions[0];

        return [
            [funding_ix, update_ix],
            [media_item]
        ]

    }

    const SetInfo = async (market_acc, prod_addr, name = "prod name", desc = "prod desc") =>{

        let info_item = await bundlrClient.UploadBufferInstruction(JSON.stringify({
            name: name,
            description: desc
        }));

        let funding_ix = (await bundlrClient.FundInstructionFiles([info_item])).tx.instructions[0];

        let update_ix = await PRODUCT_PROGRAM.SetProdInfo(
            prod_addr,
            PRODUCT_PROGRAM.GenListingsAddress("physical", market_acc.data.voterId),
            info_item.id
        );

        return [
            [funding_ix, update_ix],
            [info_item]
        ]
    }

    /////////////////////////////////////////////////
    /// FETCHING UTILS

    const GetAllVendorPhysicalProducts = async(voter_id) =>{
        let listings_addr = PRODUCT_PROGRAM.GenListingsAddress("physical", voter_id);
        let listings_struct = (await PRODUCT_PROGRAM.GetListingsStruct(listings_addr)).data;
        if(!listings_struct){
            return ""
        }
        let indexes = PRODUCT_PROGRAM.FindAllListings(listings_struct).map((ind)=>{
            return PRODUCT_PROGRAM.GenProductAddress(
                ind, listings_addr, "physical"
            )
        });

        return (await PRODUCT_PROGRAM.GetMultiplePhysicalProducts(
            indexes
        )).filter(prod => prod.data != undefined);
    };

    return {
        CreatePhysicalListingsCatalog,
        ListPhysicalProduct,
        ChangePrice,
        ChangeAvailability,
        ChangeQuantity,
        SetMedia,
        SetInfo,
        GetAllVendorPhysicalProducts
    }
}

export function CommissionProductFunctionalities(props){
    
    const {bundlrClient} = useContext(BundlrCtx);
    
    

    /// SELLER UTILS
    const CreateCommissionsListingsCatalog = async(market_acc, wallet)=>{
        await PRODUCT_PROGRAM.InitCommissionsListings(wallet, market_acc);
    }

    const ListCommissionProduct = async(
        market_acc,
        next_index,
        prod_addr,
        listings_addr,
        price,
        deliveryEstimate = 14,
        name,
        description,
        files,
        add_to_recent,
        payer_wallet
    ) => {
        if(files.length <= 0) return;

        let buffers = files.join(">UwU<")

        let media_url = await bundlrClient.UploadBufferInstruction(buffers);
        let desc_url = await bundlrClient.UploadBufferInstruction(JSON.stringify({
                name: name,
                description: description
            }));

        let funding_ix = (await bundlrClient.FundInstructionFiles([media_url, desc_url])).tx.instructions[0];
        let update_ix = await PRODUCT_PROGRAM.ListCommissionProduct(
            prod_addr,
            {
                info: desc_url.id,
                ownerCatalog: market_acc.data.voterId,
                index: next_index,
                price: new BN(price),
                deliveryEstimate: new BN(deliveryEstimate),
                media: media_url.id,
                timesSold: new BN(0),
                searchIndexed: false,
            },
            add_to_recent,
            market_acc,
            listings_addr,
            payer_wallet
        );

        return [
            [funding_ix, update_ix],
            [desc_url, media_url]
        ];
    }

    const ChangeAvailability = async(market_acc, prod_addr, vendor_wallet, available = false) =>{
        if (available){
            await PRODUCT_PROGRAM.ProductAvailable(prod_addr, market_acc, vendor_wallet);
        }else{
            await PRODUCT_PROGRAM.ProductUnavailable(prod_addr, market_acc, vendor_wallet);
        }
    }

    const ChangePrice = async(market_acc, prod_addr, new_price = 0) =>{

        return PRODUCT_PROGRAM.UpdateProductPrice(
            prod_addr,
            PRODUCT_PROGRAM.GenListingsAddress("commission", market_acc.data.voterId),
            new_price
        )
    }

    const SetMedia = async(market_acc, prod_addr, files) =>{

        let buffers = files.join(">UwU<")

        let media_item = await bundlrClient.UploadBufferInstruction(buffers);

        let update_ix = await PRODUCT_PROGRAM.SetMedia(
            prod_addr,
            PRODUCT_PROGRAM.GenListingsAddress("commission", market_acc.data.voterId),
            media_item.id
        )

        let funding_ix = (await bundlrClient.FundInstructionFiles([media_item])).tx.instructions[0];

        return [
            [funding_ix, update_ix],
            [media_item]
        ]

    }

    const SetInfo = async (market_acc, prod_addr, name = "prod name", desc = "prod desc") =>{

        let info_item = await bundlrClient.UploadBufferInstruction(JSON.stringify({
            name: name,
            description: desc
        }))

        let funding_ix = (await bundlrClient.FundInstructionFiles([info_item])).tx.instructions[0];

        let update_ix = await PRODUCT_PROGRAM.SetProdInfo(
            prod_addr,
            PRODUCT_PROGRAM.GenListingsAddress("commission", market_acc.data.voterId),
            info_item.id
        );

        return [
            [funding_ix, update_ix],
            [info_item]
        ]
    }

    /// BUYER UTILS

    const GetAllVendorCommissionProducts = async(voter_id) =>{
        let listings_addr = PRODUCT_PROGRAM.GenListingsAddress("commission", voter_id);
        let listings_struct = (await PRODUCT_PROGRAM.GetListingsStruct(listings_addr)).data;
        if(!listings_struct){
            return ""
        }

        let indexes = PRODUCT_PROGRAM.FindAllListings(listings_struct).map((ind)=>{
            return PRODUCT_PROGRAM.GenProductAddress(
                ind, listings_addr, "commission"
            )
        })

        return (await PRODUCT_PROGRAM.GetMultipleCommissionProducts(
            indexes
        )).filter(prod => prod.data != undefined);
    };

    return {
        CreateCommissionsListingsCatalog,
        ListCommissionProduct,
        ChangePrice,
        ChangeAvailability,
        SetMedia,
        SetInfo,
        GetAllVendorCommissionProducts
    }
}