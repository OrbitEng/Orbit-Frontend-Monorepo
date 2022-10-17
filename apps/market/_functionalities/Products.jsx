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
     const ResolveProductInfo = async(product_addr) => {
        let arclient = new ArQueryClient();
        let product = await productClient.GetDigitalProduct(product_addr);
        if(!(product.data && product.data.metadata.info)){
            return undefined
        }
        return (await arclient.FetchData(product.data.metadata.info)).split("||");
    };

    const ResolveProductMedia = async(product_addr) => {
        let arclient = new ArQueryClient();
        let product = await productClient.GetPhysicalProduct(product_addr);
        if(!(product.data && product.data.metadata.media)){
            return undefined
        }
        return arclient.GetImagesData(product.data.metadata.media);
    }

    return{
        ResolveProductInfo,
        ResolveProductMedia
    }
}

export function DigitalProductFunctionalities(props){
    const {marketAccountsClient} = useContext(MarketAccountsCtx);
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
        
        let buffers = await Promise.all(
            files.map((fil)=>{
                return fil.arrayBuffer();
            })
        );

        let media_url = await bundlrClient.UploadBuffer(buffers);
        let desc_url = await bundlrClient.UploadBuffer(name + "||" + description);
        let listings_addr = productClient.GenListingsAddress("digital");

        let next_index = productClient.FindNextAvailableAddress(
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
        
        return productClient.ChangeProductPrice(
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
        
        let buffers = (await Promise.all(
            files.map(async (fil)=>{      
                return enc_common.utos(new Uint8Array(await fil.arrayBuffer())) + "<<" + fil.type;
            })
        )).join("||")

        let tx_id = await bundlrClient.UploadBuffer(buffers);

        productClient.SetMedia(
            prod_addr,
            productClient.GenListingsAddress("digital"),
            tx_id
        )
    }

    const SetInfo = async(prod_addr, name = "prod name", desc = "prod desc") =>{
        let tx_url = await bundlrClient.UploadBuffer(name + "||" + desc)

        productClient.SetProdInfo(
            prod_addr,
            productClient.GenListingsAddress("digital"),
            tx_url
        )
    }

    ////////////////////////////////////////////////
    /// FETCHING UTILS

    const GetAllVendorDigitalProducts = async(market_acc) =>{
        let listings_addr = (await marketAccountsClient.GetAccount(market_acc)).data.digitalVendorCatalog;
        let listings_struct = (await productClient.GetListingsStruct(listings_addr)).data;
        if(!listings_struct){
            return ""
        }

        let all_prods = listings_struct.addressAvailable[0].toString(2) + listings_struct.addressAvailable[1].toString(2) + listings_struct.addressAvailable[2].toString(2) + listings_struct.addressAvailable[3].toString(2);
        let indexes = [];
        for(let i = 0; i < 256; i++){
            if(all_prods[i] == "0"){
                indexes.push(
                    productClient.GenProductAddress(
                        i, listings_addr, "digital"
                    )
                )
            }
        };

        return (await productClient.GetMultipleDigitalProducts(
            (await Promise.all(indexes)).map(n => n[0])
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
    const {marketAccountsClient} = useContext(MarketAccountsCtx);
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

        let buffers = await Promise.all(
            files.map((fil)=>{
                return fil.arrayBuffer();
            })
        );

        let media_url = await bundlrClient.UploadBuffer(buffers);
        let desc_url = await bundlrClient.UploadBuffer(name + "||" + description);

        let listings_addr = await productClient.GenListingsAddress("physical");

        let next_index = productClient.FindNextAvailableAddress(
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

        return productClient.ChangeProductPrice(
            prod_addr,
            productClient.GenListingsAddress("physical"),
            new_price
        )
    }
    const ChangeQuantity = async(prod_addr, new_quantity = 0) =>{

        return productClient.ChangeProductQuantity(
            prod_addr,
            productClient.GenListingsAddress("physical"),
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

        let buffers = (await Promise.all(
            files.map(async (fil)=>{      
                return enc_common.utos(new Uint8Array(await fil.arrayBuffer())) + "<<" + fil.type;
            })
        )).join("||")

        let tx_id = await bundlrClient.UploadBuffer(buffers);

        return productClient.SetMedia(
            prod_addr,
            productClient.GenListingsAddress("physical"),
            tx_id
        )

    }

    const SetInfo = async(prod_addr, name = "prod name", desc = "prod desc") =>{

        let tx_url = await bundlrClient.UploadBuffer(name + "||" + desc)

        productClient.SetProdInfo(
            prod_addr,
            productClient.GenListingsAddress("physical"),
            tx_url
        )
    }

    /////////////////////////////////////////////////
    /// FETCHING UTILS

    const GetAllVendorPhysicalProducts = async(market_acc) =>{
        let listings_addr = (await marketAccountsClient.GetAccount(market_acc)).data.physicalVendorCatalog;
        let listings_struct = (await productClient.GetListingsStruct(listings_addr)).data;
        if(!listings_struct){
            return ""
        }

        let all_prods = listings_struct.addressAvailable[0].toString(2) + listings_struct.addressAvailable[1].toString(2) + listings_struct.addressAvailable[2].toString(2) + listings_struct.addressAvailable[3].toString(2);
        let indexes = [];
        for(let i = 0; i < 256; i++){
            if(all_prods[i] == "0"){
                indexes.push(
                    productClient.GenProductAddress(
                        i, listings_addr, "physical"
                    )
                )
            }
        };

        return (await productClient.GetMultiplePhysicalProducts(
            (await Promise.all(indexes)).map(n => n[0])
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

        let buffers = await Promise.all(
            files.map((fil)=>{
                return fil.arrayBuffer();
            })
        );

        let media_url = await bundlrClient.UploadBuffer(buffers);
        let desc_url = await bundlrClient.UploadBuffer(name + "||" + description);

        console.log("genning addr");
        let listings_addr = await productClient.GenListingsAddress("commission");

        console.log("getting next index")
        let next_index = productClient.FindNextAvailableAddress(
            (await productClient.GetListingsStruct(
                listings_addr
            )).data
        );

        console.log("generating")
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

        return productClient.ChangeProductPrice(
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

        let buffers = (await Promise.all(
            files.map(async (fil)=>{      
                return enc_common.utos(new Uint8Array(await fil.arrayBuffer())) + "<<" + fil.type;
            })
        )).join("||")

        let tx_id = await bundlrClient.UploadBuffer(buffers);

        return productClient.SetMedia(
            prod_addr,
            productClient.GenListingsAddress("commission"),
            tx_id
        )

    }

    const SetInfo = async(prod_addr, name = "prod name", desc = "prod desc") =>{

        let tx_url = await bundlrClient.UploadBuffer(name + "||" + desc)

        productClient.SetProdInfo(
            prod_addr,
            productClient.GenListingsAddress("commission"),
            tx_url
        )
    }

    /// BUYER UTILS

    const GetAllVendorCommissionProducts = async(market_acc) =>{
        let listings_addr = (await marketAccountsClient.GetAccount(market_acc)).data.commissionVendorCatalog;
        let listings_struct = (await productClient.GetListingsStruct(listings_addr)).data;
        if(!listings_struct){
            return ""
        }

        let all_prods = listings_struct.addressAvailable[0].toString(2) + listings_struct.addressAvailable[1].toString(2) + listings_struct.addressAvailable[2].toString(2) + listings_struct.addressAvailable[3].toString(2);
        let indexes = [];
        for(let i = 0; i < 256; i++){
            if(all_prods[i] == "0"){
                indexes.push(
                    productClient.GenProductAddress(
                        i, listings_addr, "commission"
                    )
                )
            }
        };

        return (await productClient.GetMultipleCommissionProducts(
            (await Promise.all(indexes)).map(n => n[0])
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