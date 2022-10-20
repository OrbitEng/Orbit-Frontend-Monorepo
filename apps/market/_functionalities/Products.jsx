import { useContext, useState, useCallback } from "react";
import {PublicKey} from "@solana/web3.js";
import { BN } from "@project-serum/anchor";
import ProductClientCtx from "@contexts/ProductClientCtx";
import MarketAccountsCtx from "@contexts/MarketAccountsCtx";
import BundlrCtx from "@contexts/BundlrCtx";

import { ArQueryClient } from "data-transfer-clients";

export function ProductCommonUtils(props){
    const {productClient} = useContext(ProductClientCtx);
    
    /**
     * should return [name, desc]
     */
     const ResolveProductInfo = async(metadata_addr) => {
        let arclient = new ArQueryClient();
        let data = (await arclient.FetchData(metadata_addr)).split(">UwU<");
        // let data = JSON.parse(await arclient.FetchData(metadata_addr));
        return {
            name: data[0],
            description: data[1]
        };
    };

    const ResolveProductMedia = async(media_addr) => {
        let arclient = new ArQueryClient();
        return arclient.GetImageData(media_addr);
    }

    return{
        ResolveProductInfo,
        ResolveProductMedia
    }
}

export function DigitalProductFunctionalities(props){
    const {bundlrClient} = useContext(BundlrCtx);
    const {productClient} = useContext(ProductClientCtx);

    const CreateDigitalListingsCatalog = async()=>{
        await productClient.InitVendorListings("digital");
    }

    const ListProduct = async(
        currency = "11111111111111111111111111111111",
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

        let media_url = await bundlrClient.UploadBuffer(buffers);
        let desc_url = await bundlrClient.UploadBuffer(
            JSON.stringify({
                name: name,
                description: description
            })
        );
        let listings_addr = productClient.GenListingsAddress("digital");

        let next_index = productClient.FindNextAvailableListingsAddress(
            (await productClient.GetListingsStruct(
                listings_addr
            )).data
        );

        let prod_addr = productClient.GenProductAddress(
            next_index, listings_addr, "digital"
        )

        await productClient.ListDigitalProduct(
            prod_addr,
            {
                info: desc_url,
                ownerCatalog: listings_addr,
                index: next_index,
                currency: new PublicKey(currency),
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
            await productClient.MarkProdAvailable(prod_addr, productClient.GenListingsAddress("digital"));
        }else{
            await productClient.MarkProdUnavailable(prod_addr, productClient.GenListingsAddress("digital"));
        }
    }

    const ChangePrice = async(prod_addr, new_price = 0) =>{
        
        return productClient.UpdateProductPrice(
            prod_addr,
            productClient.GenListingsAddress("digital"),
            new_price
        )
    }

    const ChangeCurrency = async(prod_addr, new_currency = "11111111111111111111111111111111") =>{
        
        return productClient.UpdateCurrency(
            prod_addr,
            productClient.GenListingsAddress("digital"),
            new_currency
        )
    }

    const SetMedia = async(prod_addr, files) =>{
        
        let buffers = files.join(">UwU<")

        let tx_id = await bundlrClient.UploadBuffer(buffers);

        productClient.SetMedia(
            prod_addr,
            productClient.GenListingsAddress("digital"),
            tx_id
        )
    }

    const SetInfo = async(prod_addr, name = "prod name", desc = "prod desc") =>{
        let tx_url = await bundlrClient.UploadBuffer(JSON.stringify({
                name: name,
                description: desc
            }))

        productClient.SetProdInfo(
            prod_addr,
            productClient.GenListingsAddress("digital"),
            tx_url
        )
    }

    ////////////////////////////////////////////////
    /// FETCHING UTILS

    const GetAllVendorDigitalProducts = async(listings_addr) =>{
        let listings_struct = (await productClient.GetListingsStruct(listings_addr)).data;
        let indexes = productClient.FindAllListings(listings_struct).map((ind)=>{
            return productClient.GenProductAddress(
                ind, listings_addr, "digital"
            )
        })

        return (await productClient.GetMultipleDigitalProducts(
            indexes
        )).filter(prod => prod.data != undefined);
    }

    return {
        CreateDigitalListingsCatalog,
        ListProduct,
        SetFileType,
        ChangeAvailability,
        ChangePrice,
        ChangeCurrency,
        SetMedia,
        SetInfo,
        GetAllVendorDigitalProducts
    }
}

export function PhysicalProductFunctionalities(props){
    const {bundlrClient} = useContext(BundlrCtx);
    const {productClient} = useContext(ProductClientCtx);
    

    /// SELLER UTILS
    const CreatePhysicalListingsCatalog = async()=>{
        await productClient.InitVendorCatalog("physical")
    }

    const ListProduct = async(
        currency = "11111111111111111111111111111111",
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

        let media_url = await bundlrClient.UploadBuffer(buffers);
        let desc_url = await bundlrClient.UploadBuffer(JSON.stringify({
            name: name,
            description: description
        }));

        let listings_addr = await productClient.GenListingsAddress("physical");

        let next_index = productClient.FindNextAvailableListingsAddress(
            (await productClient.GetListingsStruct(
                listings_addr
            )).data
        );

        let prod_addr = productClient.GenProductAddress(
            next_index, listings_addr, "physical"
        )

        await productClient.ListPhysicalProduct(
            prod_addr,
            {
                info: desc_url,
                ownerCatalog: listings_addr,
                index: next_index,
                currency: new PublicKey(currency),
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
            await productClient.MarkProdAvailable(prod_addr, productClient.GenListingsAddress("physical"));
        }else{
            await productClient.MarkProdUnavailable(prod_addr, productClient.GenListingsAddress("physical"));
        }
    }

    const ChangePrice = async(prod_addr, new_price = 0) =>{

        return productClient.UpdateProductPrice(
            prod_addr,
            productClient.GenListingsAddress("physical"),
            new_price
        )
    }
    const ChangeQuantity = async(prod_addr, new_quantity = 0) =>{

        return productClient.UpdateProductQuantity(
            prod_addr,
            new_quantity
        )
    }
    const ChangeCurrency = async(prod_addr, new_currency = "11111111111111111111111111111111") =>{

        return productClient.UpdateCurrency(
            prod_addr,
            productClient.GenListingsAddress("physical"),
            new_currency
        )
    };

    const SetMedia = async(prod_addr, files) =>{

        let buffers = files.join(">UwU<")

        let tx_id = await bundlrClient.UploadBuffer(buffers);

        return productClient.SetMedia(
            prod_addr,
            productClient.GenListingsAddress("physical"),
            tx_id
        )

    }

    const SetInfo = async(prod_addr, name = "prod name", desc = "prod desc") =>{

        let tx_url = await bundlrClient.UploadBuffer(JSON.stringify({
                name: name,
                description: desc
            }))

        productClient.SetProdInfo(
            prod_addr,
            productClient.GenListingsAddress("physical"),
            tx_url
        )
    }

    /////////////////////////////////////////////////
    /// FETCHING UTILS

    const GetAllVendorPhysicalProducts = async(listings_addr) =>{
        let listings_struct = (await productClient.GetListingsStruct(listings_addr)).data;
        if(!listings_struct){
            return ""
        }
        let indexes = productClient.FindAllListings(listings_struct).map((ind)=>{
            return productClient.GenProductAddress(
                ind, listings_addr, "physical"
            )
        })

        return (await productClient.GetMultiplePhysicalProducts(
            indexes
        )).filter(prod => prod.data != undefined);
    };

    return {
        CreatePhysicalListingsCatalog,
        ListProduct,
        ChangePrice,
        ChangeAvailability,
        ChangeQuantity,
        ChangeCurrency,
        SetMedia,
        SetInfo,
        GetAllVendorPhysicalProducts
    }
}

export function CommissionProductFunctionalities(props){
    const {marketAccountsClient} = useContext(MarketAccountsCtx);
    const {bundlrClient} = useContext(BundlrCtx);
    const {productClient} = useContext(ProductClientCtx);
    

    /// SELLER UTILS
    const CreateCommissionsListingsCatalog = async()=>{
        await productClient.InitVendorCatalog("commissions")
    }

    const ListProduct = async(
        currency = "11111111111111111111111111111111",
        price,
        deliveryEstimate = 14,
        name,
        description,
        files,
        add_to_recent
    ) => {
        if(files.length <= 0) return;

        let buffers = files.join(">UwU<")

        let media_url = await bundlrClient.UploadBuffer(buffers);
        let desc_url = await bundlrClient.UploadBuffer(JSON.stringify({
                name: name,
                description: description
            }));

        let listings_addr = await productClient.GenListingsAddress("commission");

        let next_index = productClient.FindNextAvailableListingsAddress(
            (await productClient.GetListingsStruct(
                listings_addr
            )).data
        );

        let prod_addr = productClient.GenProductAddress(
            next_index, listings_addr, "commission"
        )

        await productClient.ListCommissionProduct(
            prod_addr,
            {
                info: desc_url,
                ownerCatalog: listings_addr,
                index: next_index,
                currency: new PublicKey(currency),
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
            productClient.GenListingsAddress("commission"),
            new_price
        )
    }
    
    const ChangeCurrency = async(prod_addr, new_currency = "11111111111111111111111111111111") =>{

        return productClient.UpdateCurrency(
            prod_addr,
            productClient.GenListingsAddress("commission"),
            new_currency
        )
    };

    const SetMedia = async(prod_addr, files) =>{

        let buffers = files.join(">UwU<")

        let tx_id = await bundlrClient.UploadBuffer(buffers);

        return productClient.SetMedia(
            prod_addr,
            productClient.GenListingsAddress("commission"),
            tx_id
        )

    }

    const SetInfo = async(prod_addr, name = "prod name", desc = "prod desc") =>{

        let tx_url = await bundlrClient.UploadBuffer(JSON.stringify({
                name: name,
                description: desc
            }))

        productClient.SetProdInfo(
            prod_addr,
            productClient.GenListingsAddress("commission"),
            tx_url
        )
    }

    /// BUYER UTILS

    const GetAllVendorCommissionProducts = async(listings_addr) =>{
        let listings_struct = (await productClient.GetListingsStruct(listings_addr)).data;
        if(!listings_struct){
            return ""
        }

        let indexes = productClient.FindAllListings(listings_struct).map((ind)=>{
            return productClient.GenProductAddress(
                ind, listings_addr, "commission"
            )
        })

        return (await productClient.GetMultipleCommissionProducts(
            indexes
        )).filter(prod => prod.data != undefined);
    };

    return {
        CreateCommissionsListingsCatalog,
        ListProduct,
        ChangePrice,
        ChangeAvailability,
        ChangeCurrency,
        SetMedia,
        SetInfo,
        GetAllVendorCommissionProducts
    }
}