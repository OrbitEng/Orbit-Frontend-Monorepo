import { useContext, useState, useCallback } from "react";

import DigitalMarketCtx from "@contexts/DigitalMarketCtx";
import PhysicalMarketCtx from "@contexts/PhysicalMarketCtx";
import CommissionMarketCtx from "@contexts/CommissionMarketCtx";
import ProductClientCtx from "@contexts/ProductClientCtx";
import MarketAccountsCtx from "@contexts/MarketAccountsCtx";
import BundlrCtx from "@contexts/BundlrCtx";

import { ArQueryClient } from "data-transfer-clients";

export function DigitalProductFunctionalities(props){
    const {digitalMarketClient} = useContext(DigitalMarketCtx);
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
        add_to_recent = false
    ) => {
        let buffers = await Promise.all(
            files.map((fil)=>{
                return fil.arrayBuffer();
            })
        );

        let media_url = await bundlrClient.UploadBuffer(buffers);
        let desc_url = await bundlrClient.UploadBuffer(name + "||" + description);
        let listings_addr = productClient.GetListingsStruct("digital");

        let next_index = productClient.FindNextAvailableAddress(
            await productClient.GetListingsStruct(
                listings_addr
            )
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
                currency: currency,
                price: price,
                deliveryEstimate: deliveryEstimate,
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
        
        return digitalMarketClient.SetFileType(
            prod_addr,
            file_type
        )
    }

    const ChangeAvailability = async(prod_addr, available = false) =>{
        if (available){
            await catalogClient.ProductAvailable(prod_addr);
        }else{
            await catalogClient.ProductUnavailable(prod_addr);
        }
    }

    const ChangePrice = async(prod_addr, new_price = 0) =>{
        
        return digitalMarketClient.ChangeProductPrice(
            prod_addr,
            new_price
        )
    }

    const ChangeCurrency = async(prod_addr, new_currency = "11111111111111111111111111111111") =>{
        
        return digitalMarketClient.UpdateCurrency(
            prod_addr,
            new_currency
        )
    }

    const SetMedia = async(prod_addr, files) =>{
        
        let buffers = (await Promise.all(
            files.map(async (fil)=>{      
                return enc_common.utos(new Uint8Array.from(await fil.arrayBuffer())) + "<<" + fil.type;
            })
        )).join("||")

        let tx_id = await bundlrClient.UploadBuffer(buffers);

        digitalMarketClient.SetMedia(
            prod_addr,
            tx_id
        )
    }

    const SetInfo = async(prod_addr, name = "prod name", desc = "prod desc") =>{
        let tx_url = await bundlrClient.UploadBuffer(name + "||" + desc)

        digitalMarketClient.SetProdInfo(
            prod_addr,
            tx_url
        )
    }

    /// BUYER UTILS

    const GetAllVendorDigitalProducts = async(market_acc) =>{
        let listings_addr= (await marketAccountsClient.GetAccount(market_acc)).data.digitalVendorCatalog;
        let listings_struct = (await productClient.GetListingsStruct(listings_addr)).data;
        if(!listings_struct){
            return ""
        }

        let all_prods = listings_struct.addressAvailable[0].toString(2) + listings_struct.addressAvailable[1].toString(2) + listings_struct.addressAvailable[2].toString(2) + listings_struct.addressAvailable[3].toString(2);
        let indexes = [];
        for(let i = 0; i < 256; i++){
            if(all_prods[i] == "0"){
                indexes.push(
                    digitalMarketClient.GenProductAddress(
                        catalog_addr, i
                    )
                )
            }
        };

        return (await digitalMarketClient.GetMultipleDigitalProducts(
            (await Promise.all(indexes)).map(n => n[0])
        )).filter(prod => prod.data != undefined);
    }

    const ResolveProductMedia = async(product_addr) => {
        let arclient = new ArQueryClient();
        let product = await digitalMarketClient.GetDigitalProduct(product_addr);
        if(!(product.data && product.data.metadata.images)){
            return undefined
        }
        return arclient.GetImagesData(product.data.metadata.media);
    }

    /**
     * should return [name, desc]
     */
    const ResolveProductInfo = async(product_addr) => {
        let arclient = new ArQueryClient();
        let product = await digitalMarketClient.GetDigitalProduct(product_addr);
        if(!(product.data && product.data.metadata.info)){
            return undefined
        }
        return (await arclient.FetchData(product.data.metadata.info)).split("||");
    };

    return {
        CreateDigitalListingsCatalog,
        ListProduct,
        SetFileType,
        ChangeAvailability,
        ChangePrice,
        ChangeCurrency,
        SetMedia,
        SetInfo,
        GetAllVendorDigitalProducts,
        ResolveProductMedia,
        ResolveProductInfo
    }
}

export function PhysicalProductFunctionalities(props){
    const {physicalMarketClient} = useContext(PhysicalMarketCtx);
    const {marketAccountsClient} = useContext(MarketAccountsCtx);
    const {bundlrClient} = useContext(BundlrCtx);
    

    /// SELLER UTILS
    const CreatePhysicalListingsCatalog = async()=>{
        await catalogClient.InitVendorCatalog("physical")
    }

    const ListProduct = async(
        currency = "11111111111111111111111111111111",
        price,
        deliveryEstimate = 14,
        name,
        description,
        files
    ) => {

        let buffers = await Promise.all(
            files.map((fil)=>{
                return fil.arrayBuffer();
            })
        );

        let media_url = await bundlrClient.UploadBuffer(buffers);
        let desc_url = await bundlrClient.UploadBuffer(name + "||" + description);

        await physicalMarketClient.ListPhysicalProduct(
            desc_url,
            currency,
            price,
            deliveryEstimate,
            media_url
        )
    }

    const ChangeAvailability = async(prod_addr, available = false) =>{
        if (available){
            await catalogClient.ProductAvailable(prod_addr);
        }else{
            await catalogClient.ProductUnavailable(prod_addr);
        }
    }

    const ChangePrice = async(prod_addr, new_price = 0) =>{

        return physicalMarketClient.ChangeProductPrice(
            prod_addr,
            new_price
        )
    }
    const ChangeQuantity = async(prod_addr, new_quantity = 0) =>{

        return physicalMarketClient.ChangeProductQuantity(
            prod_addr,
            new_quantity
        )
    }
    const ChangeCurrency = async(prod_addr, new_currency = "11111111111111111111111111111111") =>{

        return physicalMarketClient.UpdateCurrency(
            prod_addr,
            new_currency
        )
    };

    const SetMedia = async(prod_addr, files) =>{

        let buffers = (await Promise.all(
            files.map(async (fil)=>{      
                return enc_common.utos(new Uint8Array.from(await fil.arrayBuffer())) + "<<" + fil.type;
            })
        )).join("||")

        let tx_id = await bundlrClient.UploadBuffer(buffers);

        return physicalMarketClient.SetMedia(
            prod_addr,
            tx_id
        )

    }

    const SetInfo = async(prod_addr, name = "prod name", desc = "prod desc") =>{

        let tx_url = await bundlrClient.UploadBuffer(name + "||" + desc)

        physicalMarketClient.SetProdInfo(
            prod_addr,
            tx_url
        )
    }

    /// BUYER UTILS

    const GetAllVendorPhysicalProducts = async(market_acc) =>{
        let listings_addr= (await marketAccountsClient.GetAccount(market_acc)).data.physicalVendorCatalog;
        let listings_struct = (await productClient.GetListingsStruct(listings_addr)).data;
        if(!listings_struct){
            return ""
        }

        let all_prods = listings_struct.addressAvailable[0].toString(2) + listings_struct.addressAvailable[1].toString(2) + listings_struct.addressAvailable[2].toString(2) + listings_struct.addressAvailable[3].toString(2);
        let indexes = [];
        for(let i = 0; i < 256; i++){
            if(all_prods[i] == "0"){
                indexes.push(
                    physicalMarketClient.GenProductAddress(
                        catalog_addr, i
                    )
                )
            }
        };

        return (await physicalMarketClient.GetMultipleDigitalProducts(
            (await Promise.all(indexes)).map(n => n[0])
        )).filter(prod => prod.data != undefined);
    };

    const ResolveProductMedia = async(product_addr) => {
        let arclient = new ArQueryClient();
        let product = await physicalMarketClient.GetPhysicalProduct(product_addr);
        if(!(product.data && product.data.metadata.images)){
            return undefined
        }
        return arclient.GetImagesData(product.data.metadata.media);
    }

    /**
     * should return [name, desc]
     */
    const ResolveProductInfo = async(product_addr) => {
        let arclient = new ArQueryClient();
        let product = await physicalMarketClient.GetPhysicalProduct(product_addr);
        if(!(product.data && product.data.metadata.info)){
            return undefined
        }
        return (await arclient.FetchData(product.data.metadata.info)).split("||");
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
        GetAllVendorPhysicalProducts,
        ResolveProductMedia,
        ResolveProductInfo
    }
}

export function CommissionProductFunctionalities(props){
    const {commissionMarketClient} = useContext(CommissionMarketCtx);
    const {marketAccountsClient} = useContext(MarketAccountsCtx);
    const {bundlrClient} = useContext(BundlrCtx);
    

    /// SELLER UTILS
    const CreateCommissionsListingsCatalog = async()=>{
        await catalogClient.InitVendorCatalog("commissions")
    }

    const ListProduct = async(
        currency = "11111111111111111111111111111111",
        price,
        deliveryEstimate = 14,
        name,
        description,
        files
    ) => {

        let buffers = await Promise.all(
            files.map((fil)=>{
                return fil.arrayBuffer();
            })
        );

        let media_url = await bundlrClient.UploadBuffer(buffers);
        let desc_url = await bundlrClient.UploadBuffer(name + "||" + description);

        await commissionMarketClient.ListProduct(
            desc_url,
            currency,
            price,
            deliveryEstimate,
            media_url
        )
    }

    const ChangeAvailability = async(prod_addr, available = false) =>{
        if (available){
            await catalogClient.ProductAvailable(prod_addr);
        }else{
            await catalogClient.ProductUnavailable(prod_addr);
        }
    }

    const ChangePrice = async(prod_addr, new_price = 0) =>{

        return commissionMarketClient.ChangeProductPrice(
            prod_addr,
            new_price
        )
    }
    
    const ChangeCurrency = async(prod_addr, new_currency = "11111111111111111111111111111111") =>{

        return commissionMarketClient.UpdateCurrency(
            prod_addr,
            new_currency
        )
    };

    const SetMedia = async(prod_addr, files) =>{

        let buffers = (await Promise.all(
            files.map(async (fil)=>{      
                return enc_common.utos(new Uint8Array.from(await fil.arrayBuffer())) + "<<" + fil.type;
            })
        )).join("||")

        let tx_id = await bundlrClient.UploadBuffer(buffers);

        return commissionMarketClient.SetMedia(
            prod_addr,
            tx_id
        )

    }

    const SetInfo = async(prod_addr, name = "prod name", desc = "prod desc") =>{

        let tx_url = await bundlrClient.UploadBuffer(name + "||" + desc)

        commissionMarketClient.SetProdInfo(
            prod_addr,
            tx_url
        )
    }

    /// BUYER UTILS

    const GetAllVendorCommissionProducts = async(market_acc) =>{
        let listings_addr= (await marketAccountsClient.GetAccount(market_acc)).data.commissionVendorCatalog;
        let listings_struct = (await productClient.GetListingsStruct(listings_addr)).data;
        if(!listings_struct){
            return ""
        }

        let all_prods = listings_struct.addressAvailable[0].toString(2) + listings_struct.addressAvailable[1].toString(2) + listings_struct.addressAvailable[2].toString(2) + listings_struct.addressAvailable[3].toString(2);
        let indexes = [];
        for(let i = 0; i < 256; i++){
            if(all_prods[i] == "0"){
                indexes.push(
                    commissionMarketClient.GenProductAddress(
                        catalog_addr, i
                    )
                )
            }
        };

        return (await commissionMarketClient.GetMultipleDigitalProducts(
            (await Promise.all(indexes)).map(n => n[0])
        )).filter(prod => prod.data != undefined);
    };

    const ResolveProductMedia = async(product_addr) => {
        let arclient = new ArQueryClient();
        let product = await commissionMarketClient.GetCommissionProduct(product_addr);
        if(!(product.data && product.data.metadata.images)){
            return undefined
        }
        return arclient.GetImagesData(product.data.metadata.media);
    }

    /**
     * should return [name, desc]
     */
    const ResolveProductInfo = async(product_addr) => {
        let arclient = new ArQueryClient();
        let product = await commissionMarketClient.GetCommissionProduct(product_addr);
        if(!(product.data && product.data.metadata.info)){
            return undefined
        }
        return (await arclient.FetchData(product.data.metadata.info)).split("||");
    };

    return {
        CreateCommissionsListingsCatalog,
        ListProduct,
        ChangePrice,
        ChangeAvailability,
        ChangeCurrency,
        SetMedia,
        SetInfo,
        GetAllVendorCommissionProducts,
        ResolveProductMedia,
        ResolveProductInfo
    }
}