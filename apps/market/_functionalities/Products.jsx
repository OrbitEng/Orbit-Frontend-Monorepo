import { useContext, useState, useCallback } from "react";
import {PublicKey} from "@solana/web3.js";
import { BN } from "@project-serum/anchor";
import ProductClientCtx from "@contexts/ProductClientCtx";
import UserAccountCtx from "@contexts/UserAccountCtx";
import BundlrCtx from "@contexts/BundlrCtx";
import { useWallet } from "@solana/wallet-adapter-react";

import { PRODUCT_PROGRAM } from "orbit-clients";

export function DigitalProductFunctionalities(props){
    const {userAccount} = useContext(UserAccountCtx);
    const {bundlrClient} = useContext(BundlrCtx);
    const {productClient} = useContext(ProductClientCtx);
    const wallet = useWallet();

    const CreateDigitalListingsCatalog = async()=>{
        await PRODUCT_PROGRAM.InitDigitalListings(wallet, userAccount.data.metadata.voter_id);
    }

    const ListProduct = async(
        price,
        deliveryEstimate = 14,
        name,
        description,
        files,
        fileType = "Image",
        add_to_recent
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
        let listings_addr = PRODUCT_PROGRAM.GenListingsAddress("digital", userAccount.data.metadata.voter_id.toNumber);

        let next_index = PRODUCT_PROGRAM.FindNextAvailableListingsAddress(
            (await PRODUCT_PROGRAM.GetListingsStruct(
                listings_addr
            )).data
        );

        let prod_addr = PRODUCT_PROGRAM.GenProductAddress(
            next_index, listings_addr, "digital"
        )

        await productClient.ListDigitalProduct(
            prod_addr,
            {
                info: desc_url,
                ownerCatalog: listings_addr,
                index: next_index,
                    price: new BN(price),
                deliveryEstimate: new BN(deliveryEstimate),
                media: media_url
            },
            fileType,
            add_to_recent
        );
    }

    // Text, Video, Audio, Image, Folder
    const SetFileType = async(
        prod_addr,
        file_type = "Image"
    ) =>{
        
        return productClient.SetFileType(
            prod_addr,
            file_type
        )
    }

    const ChangeAvailability = async(prod_addr, available = false) =>{
        if (available){
            await productClient.MarkProdAvailable(prod_addr, PRODUCT_PROGRAM.GenListingsAddress("digital", userAccount.data.metadata.voter_id.toNumber));
        }else{
            await productClient.MarkProdUnavailable(prod_addr, PRODUCT_PROGRAM.GenListingsAddress("digital", userAccount.data.metadata.voter_id.toNumber));
        }
    }

    const ChangePrice = async(prod_addr, new_price = 0) =>{
        
        return productClient.UpdateProductPrice(
            prod_addr,
            PRODUCT_PROGRAM.GenListingsAddress("digital", userAccount.data.metadata.voter_id.toNumber),
            new_price
        )
    }


    const SetMedia = async(prod_addr, files) =>{
        
        let buffers = files.join(">UwU<")

        let tx_id = await bundlrClient.UploadBufferInstruction(buffers);

        productClient.SetMedia(
            prod_addr,
            PRODUCT_PROGRAM.GenListingsAddress("digital", userAccount.data.metadata.voter_id.toNumber),
            tx_id
        )
    }

    const SetInfo = async(prod_addr, name = "prod name", desc = "prod desc") =>{
        let tx_url = await bundlrClient.UploadBufferInstruction(JSON.stringify({
                name: name,
                description: desc
            }))

        productClient.SetProdInfo(
            prod_addr,
            PRODUCT_PROGRAM.GenListingsAddress("digital", userAccount.data.metadata.voter_id.toNumber),
            tx_url
        )
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
        ListProduct,
        SetFileType,
        ChangeAvailability,
        ChangePrice,
        SetMedia,
        SetInfo,
        GetAllVendorDigitalProducts
    }
}

export function PhysicalProductFunctionalities(props){
    const {userAccount} = useContext(UserAccountCtx);
    const {bundlrClient} = useContext(BundlrCtx);
    const {productClient} = useContext(ProductClientCtx);
    const wallet = useWallet();
    

    /// SELLER UTILS
    const CreatePhysicalListingsCatalog = async()=>{
        await PRODUCT_PROGRAM.InitPhysicalListings(wallet, userAccount.data.metadata.voter_id)
    }

    const ListProduct = async(
        price,
        deliveryEstimate = 14,
        name,
        description,
        quantity,
        files,
        add_to_recent
    ) => {
        if(files.length <= 0) return;

        let buffers =files.join(">UwU<");

        let media_url = await bundlrClient.UploadBufferInstruction(buffers);
        let desc_url = await bundlrClient.UploadBufferInstruction(JSON.stringify({
            name: name,
            description: description
        }));

        let listings_addr = PRODUCT_PROGRAM.GenListingsAddress("physical", userAccount.data.metadata.voter_id);

        let next_index = PRODUCT_PROGRAM.FindNextAvailableListingsAddress(
            (await PRODUCT_PROGRAM.GetListingsStruct(
                listings_addr
            )).data
        );

        let prod_addr = PRODUCT_PROGRAM.GenProductAddress(
            next_index, listings_addr, "physical"
        )

        await productClient.ListPhysicalProduct(
            prod_addr,
            {
                info: desc_url,
                ownerCatalog: listings_addr,
                index: next_index,
                    price: new BN(price),
                deliveryEstimate: deliveryEstimate,
                media: media_url
            },
            quantity,
            add_to_recent
        );
    }

    const ChangeAvailability = async(prod_addr, available = false) =>{
        if (available){
            await productClient.MarkProdAvailable(prod_addr, PRODUCT_PROGRAM.GenListingsAddress("physical", userAccount.data.metadata.voter_id.toNumber()));
        }else{
            await productClient.MarkProdUnavailable(prod_addr, PRODUCT_PROGRAM.GenListingsAddress("physical", userAccount.data.metadata.voter_id.toNumber()));
        }
    }

    const ChangePrice = async(prod_addr, new_price = 0) =>{

        return productClient.UpdateProductPrice(
            prod_addr,
            PRODUCT_PROGRAM.GenListingsAddress("physical", userAccount.data.metadata.voter_id.toNumber()),
            new_price
        )
    }
    const ChangeQuantity = async(prod_addr, new_quantity = 0) =>{

        return productClient.UpdateProductQuantity(
            prod_addr,
            new_quantity
        )
    }

    const SetMedia = async(prod_addr, files) =>{

        let buffers = files.join(">UwU<")

        let tx_id = await bundlrClient.UploadBufferInstruction(buffers);

        return productClient.SetMedia(
            prod_addr,
            PRODUCT_PROGRAM.GenListingsAddress("physical", userAccount.data.metadata.voter_id.toNumber()),
            tx_id
        )

    }

    const SetInfo = async(prod_addr, name = "prod name", desc = "prod desc") =>{

        let tx_url = await bundlrClient.UploadBufferInstruction(JSON.stringify({
                name: name,
                description: desc
            }))

        productClient.SetProdInfo(
            prod_addr,
            PRODUCT_PROGRAM.GenListingsAddress("physical", userAccount.data.metadata.voter_id.toNumber()),
            tx_url
        )
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
        ListProduct,
        ChangePrice,
        ChangeAvailability,
        ChangeQuantity,
        SetMedia,
        SetInfo,
        GetAllVendorPhysicalProducts
    }
}

export function CommissionProductFunctionalities(props){
    const {userAccount} = useContext(UserAccountCtx);
    const {bundlrClient} = useContext(BundlrCtx);
    const {productClient} = useContext(ProductClientCtx);
    const wallet = useWallet();
    

    /// SELLER UTILS
    const CreateCommissionsListingsCatalog = async()=>{
        await PRODUCT_PROGRAM.InitCommissionsListings(wallet, userAccount.data.metadata.voter_id);
    }

    const ListProduct = async(
        price,
        deliveryEstimate = 14,
        name,
        description,
        files,
        add_to_recent
    ) => {
        if(files.length <= 0) return;

        let buffers = files.join(">UwU<")

        let media_url = await bundlrClient.UploadBufferInstruction(buffers);
        let desc_url = await bundlrClient.UploadBufferInstruction(JSON.stringify({
                name: name,
                description: description
            }));

        let listings_addr = PRODUCT_PROGRAM.GenListingsAddress("commission", userAccount.data.metadata.voter_id.toNumber);

        let next_index = PRODUCT_PROGRAM.FindNextAvailableListingsAddress(
            (await PRODUCT_PROGRAM.GetListingsStruct(
                listings_addr
            )).data
        );

        let prod_addr = PRODUCT_PROGRAM.GenProductAddress(
            next_index, listings_addr, "commission"
        )

        await productClient.ListCommissionProduct(
            prod_addr,
            {
                info: desc_url,
                ownerCatalog: listings_addr,
                index: next_index,
                    price: new BN(price),
                deliveryEstimate: new BN(deliveryEstimate),
                media: media_url
            },
            add_to_recent
        )
    }

    const ChangeAvailability = async(prod_addr, available = false) =>{
        if (available){
            await productClient.ProductAvailable(prod_addr);
        }else{
            await productClient.ProductUnavailable(prod_addr);
        }
    }

    const ChangePrice = async(prod_addr, new_price = 0) =>{

        return productClient.UpdateProductPrice(
            prod_addr,
            PRODUCT_PROGRAM.GenListingsAddress("commission", userAccount.data.metadata.voter_id.toNumber),
            new_price
        )
    }

    const SetMedia = async(prod_addr, files) =>{

        let buffers = files.join(">UwU<")

        let tx_id = await bundlrClient.UploadBufferInstruction(buffers);

        return productClient.SetMedia(
            prod_addr,
            PRODUCT_PROGRAM.GenListingsAddress("commission", userAccount.data.metadata.voter_id.toNumber),
            tx_id
        )

    }

    const SetInfo = async(prod_addr, name = "prod name", desc = "prod desc") =>{

        let tx_url = await bundlrClient.UploadBufferInstruction(JSON.stringify({
                name: name,
                description: desc
            }))

        productClient.SetProdInfo(
            prod_addr,
            PRODUCT_PROGRAM.GenListingsAddress("commission", userAccount.data.metadata.voter_id.toNumber),
            tx_url
        )
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
        ListProduct,
        ChangePrice,
        ChangeAvailability,
        SetMedia,
        SetInfo,
        GetAllVendorCommissionProducts
    }
}