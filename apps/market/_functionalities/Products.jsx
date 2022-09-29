import { useContext, useState, useCallback } from "react";

import DigitalMarketCtx from "@contexts/DigitalMarketCtx";
import PhysicalMarketCtx from "@contexts/PhysicalMarketCtx";
import MarketAccountsCtx from "@contexts/MarketAccountsCtx";
import BundlrCtx from "@contexts/BundlrCtx";
import CatalogCtx from "@contexts/CatalogCtx";

import { ArQueryClient } from "data-transfer-clients";
import { utos } from "browser-clients/src/encryption/enc-common";

// check if catalog.index == 24

export function DigitalProductFunctionalities(props){
    const {digitalMarketClient} = useContext(DigitalMarketCtx);
    const {marketAccountsClient} = useContext(MarketAccountsCtx);
    const {bundlrClient} = useContext(BundlrCtx);
    const {catalogClient} = useContext(CatalogCtx);

    const {physicalMarketClient} = useContext(PhysicalMarketCtx);

    /// SELLER UTILS
    const MfreeVendorListings = async() => {
        let vendor_catalog = await catalogClient.GetCacheCatalog(
            catalogClient.GenVendorListingsAddress(
                marketAccountsClient.market_account
            )
        )
        if(!(vendor_catalog.data)){
            return ""
        }

        let arclient = new ArQueryClient();
        let cache = vendor_catalog.data.cache;

        if(vendor_catalog.data.full){
            for(let link of vendor_catalog.data.memory){
                cache.push(...(await arclient.FetchData(link)).split("||"));
            }

            let phys_prods = (await physicalMarketClient.GetMultiplePhysicalProducts(cache)).filter(prod => prod.data != undefined);
            let digi_prods = (await digitalMarketClient.GetMultipleDigitalProducts(cache)).filter(prod => prod.data != undefined);
            let prods = [...phys_prods, ...digi_prods];

            let buff = prods.map(pk => pk.toString()).join("||");
            let link = await bundlrClient.UploadBuffer(buff);

            return catalogClient.RemapVendorCatalog(
                marketAccountsClient.market_account,
                marketAccountsClient.master_auth,
                link
            )
        }else if(vendor_catalog.data.flag){
            let buff = cache.map(pk => pk.toString()).join("||");
            
            return catalogClient.DrainVendorCatalog(
                marketAccountsClient.market_account,
                marketAccountsClient.master_auth,
                await bundlrClient.UploadBuffer(buff)
            );   
        }
    }

    const ListProductCommission = async(
        currency = "11111111111111111111111111111111",
        price,
        available = true,
        deliveryEstimate = 14,
        name,
        description,
        files
    ) => {
        let market_acc = marketAccountsClient.market_account;
        let market_auth = marketAccountsClient.master_auth;

        let buffers = await Promise.all(
            files.map((fil)=>{
                return fil.arrayBuffer();
            })
        );

        let media_url = await bundlrClient.UploadBuffer(buffers);
        let desc_url = await bundlrClient.UploadBuffer(name + "||" + description);

        let prod = await digitalMarketClient.ListDigitalProductCommission(
            desc_url,
            market_acc,
            currency,
            price,
            available,
            deliveryEstimate,
            media_url
        );

        let listings_catalog = catalogClient.GenVendorListingsAddress(market_acc);

        if((!await catalogClient.GetCatalogAddrLocal(listings_catalog)) && !(await catalogClient.GetCacheCatalog(listings_catalog)).data){
            await catalogClient.InitVendorCatalog(
                market_acc,
                market_auth
            )
        }

        await catalogClient.AddToVendorCatalog(
            market_acc,
            market_auth,
            prod.publicKey
        );

        return MfreeVendorListings();
    }

    const ListProductTemplate = async(
        currency = "11111111111111111111111111111111",
        price,
        available = true,
        deliveryEstimate = 14,
        name,
        files
    ) => {
        let market_acc = marketAccountsClient.market_account;
        let market_auth = marketAccountsClient.master_auth;

        let buffers = await Promise.all(
            files.map((fil)=>{
                return fil.arrayBuffer();
            })
        );

        let media_url = await bundlrClient.UploadBuffer(buffers);
        let desc_url = await bundlrClient.UploadBuffer(name + "||" + description);

        let prod = await digitalMarketClient.ListDigitalProductTemplate(
            desc_url,
            market_acc,
            currency,
            price,
            available,
            deliveryEstimate,
            media_url
        );

        let listings_catalog = catalogClient.GenVendorListingsAddress(market_acc);

        if((!await catalogClient.GetCatalogAddrLocal(listings_catalog)) && !(await catalogClient.GetCacheCatalog(listings_catalog)).data){
            await catalogClient.InitVendorCatalog(
                market_acc,
                market_auth
            )
        }

        await catalogClient.AddToVendorCatalog(
            market_acc,
            market_auth,
            prod.publicKey
        );

        return MfreeVendorListings();
    }

    // Text, Video, Audio, Image, Folder
    const SetFileType = async(
        prod_addr,
        file_type = "Image"
    ) =>{
        let market_acc = marketAccountsClient.market_account;
        let market_auth = marketAccountsClient.master_auth;
        
        return digitalMarketClient.SetFileType(
            prod_addr,
            market_acc,
            market_auth,
            file_type
        )
    }

    const ChangeAvailability = async(prod_addr, available = false) =>{
        let market_acc = marketAccountsClient.market_account;
        let market_auth = marketAccountsClient.master_auth;
        
        return digitalMarketClient.ChangeAvailability(
            prod_addr,
            market_acc,
            market_auth,
            available
        )
    }

    const ChangePrice = async(prod_addr, new_price = 0) =>{
        let market_acc = marketAccountsClient.market_account;
        let market_auth = marketAccountsClient.master_auth;
        
        return digitalMarketClient.ChangeProductPrice(
            prod_addr,
            market_acc,
            market_auth,
            new_price
        )
    }

    const ChangeCurrency = async(prod_addr, new_currency = "11111111111111111111111111111111") =>{
        let market_acc = marketAccountsClient.market_account;
        let market_auth = marketAccountsClient.master_auth;
        
        return digitalMarketClient.UpdateCurrency(
            prod_addr,
            market_acc,
            market_auth,
            new_currency
        )
    }

    const SetMedia = async(prod_addr, files) =>{
        let market_acc = marketAccountsClient.market_account;
        let market_auth = marketAccountsClient.master_auth;
        
        let buffers = (await Promise.all(
            files.map(async (fil)=>{      
                return enc_common.utos(new Uint8Array.from(await fil.arrayBuffer())) + "<<" + fil.type;
            })
        )).join("||")

        let tx_id = await bundlrClient.UploadBuffer(buffers);

        digitalMarketClient.SetMedia(
            prod_addr,
            market_acc,
            market_auth,
            tx_id
        )
    }

    const SetInfo = async(prod_addr, name = "prod name", desc = "prod desc") =>{
        let market_acc = marketAccountsClient.market_account;
        let market_auth = marketAccountsClient.master_auth;

        let tx_url = await bundlrClient.UploadBuffer(name + "||" + desc)

        digitalMarketClient.SetProdInfo(
            prod_addr,
            market_acc,
            market_auth,
            tx_url
        )
    }

    /// BUYER UTILS

    const GetAllVendorDigitalProducts = async(market_acc) =>{
        let vendor_catalog = await catalogClient.GetCacheCatalog(
            catalogClient.GenVendorListingsAddress(
                market_acc
            )
        )
        if(!(vendor_catalog.data)){
            return ""
        }

        let arclient = new ArQueryClient();
        let cache = vendor_catalog.data.cache;

        for(let link of vendor_catalog.data.memory){
            cache.push(...(await arclient.FetchData(link)).split("||"));
        }

        return (await digitalMarketClient.GetMultipleDigitalProducts(cache)).filter(prod => prod.data != undefined);
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
        MfreeVendorListings,
        ListProductCommission,
        ListProductTemplate,
        SetFileType,
        ChangeAvailability,
        ChangePrice,
        ChangeCurrency,
        SetMedia,
        SetInfo,
        GetAllVendorDigitalProducts,
        ResolveProductMedia,
        ListProductCommission,
        ListProductTemplate,
        ResolveProductInfo
    }
}

export function PhysicalProductFunctionalities(props){
    const {digitalMarketClient} = useContext(DigitalMarketCtx);

    const {physicalMarketClient} = useContext(PhysicalMarketCtx);
    const {marketAccountsClient} = useContext(MarketAccountsCtx);
    const {bundlrClient} = useContext(BundlrCtx);
    const {catalogClient} = useContext(CatalogCtx);

    /// SELLER UTILS
    const MfreeVendorListings = async() => {
        let vendor_catalog = await catalogClient.GetCacheCatalog(
            catalogClient.GenVendorListingsAddress(
                marketAccountsClient.market_account
            )
        )
        if(!(vendor_catalog.data)){
            return ""
        }

        let arclient = new ArQueryClient();
        let cache = vendor_catalog.data.cache;

        if(vendor_catalog.data.full){
            for(let link of vendor_catalog.data.memory){
                cache.push(...(await arclient.FetchData(link)).split("||"));
            }

            let phys_prods = (await physicalMarketClient.GetMultiplePhysicalProducts(cache)).filter(prod => prod.data != undefined);
            let digi_prods = (await digitalMarketClient.GetMultipleDigitalProducts(cache)).filter(prod => prod.data != undefined);
            let prods = [...phys_prods, ...digi_prods];

            let buff = prods.map(pk => pk.toString()).join("||");
            let link = await bundlrClient.UploadBuffer(buff);

            return catalogClient.RemapVendorCatalog(
                marketAccountsClient.market_account,
                marketAccountsClient.master_auth,
                link
            )
        }else if(vendor_catalog.data.flag){
            let buff = cache.map(pk => pk.toString()).join("||");
            
            return catalogClient.DrainVendorCatalog(
                marketAccountsClient.market_account,
                marketAccountsClient.master_auth,
                await bundlrClient.UploadBuffer(buff)
            );   
        }
    }

    const ListProduct = async(
        currency = "11111111111111111111111111111111",
        price,
        available = true,
        deliveryEstimate = 14,
        name,
        description,
        files
    ) => {
        let market_acc = marketAccountsClient.market_account;

        let buffers = await Promise.all(
            files.map((fil)=>{
                return fil.arrayBuffer();
            })
        );

        let media_url = await bundlrClient.UploadBuffer(buffers);
        let desc_url = await bundlrClient.UploadBuffer(name + "||" + description);

        await physicalMarketClient.ListPhysicalProduct(
            desc_url,
            market_acc,
            currency,
            price,
            available,
            deliveryEstimate,
            media_url
        )

        let listings_catalog = catalogClient.GenVendorListingsAddress(market_acc);

        if((!await catalogClient.GetCatalogAddrLocal(listings_catalog)) && !(await catalogClient.GetCacheCatalog(listings_catalog)).data){
            await catalogClient.InitVendorCatalog(
                market_acc,
                market_auth
            )
        }

        await catalogClient.AddToVendorCatalog(
            market_acc,
            market_auth,
            prod.publicKey
        );

        return MfreeVendorListings();
    }

    const ChangePrice = async(prod_addr, new_price = 0) =>{
        let market_acc = marketAccountsClient.market_account;
        let market_auth = marketAccountsClient.master_auth;

        return physicalMarketClient.ChangeProductPrice(
            prod_addr,
            market_acc,
            market_auth,
            new_price
        )
    }
    const ChangeQuantity = async(prod_addr, new_quantity = 0) =>{
        let market_acc = marketAccountsClient.market_account;
        let market_auth = marketAccountsClient.master_auth;

        return physicalMarketClient.ChangeProductQuantity(
            prod_addr,
            market_acc,
            market_auth,
            new_quantity
        )
    }
    const ChangeCurrency = async(prod_addr, new_currency = "11111111111111111111111111111111") =>{
        let market_acc = marketAccountsClient.market_account;
        let market_auth = marketAccountsClient.master_auth;

        return physicalMarketClient.UpdateCurrency(
            prod_addr,
            market_acc,
            market_auth,
            new_currency
        )
    };

    const SetMedia = async(prod_addr, files) =>{
        let market_acc = marketAccountsClient.market_account;
        let market_auth = marketAccountsClient.master_auth;

        let buffers = (await Promise.all(
            files.map(async (fil)=>{      
                return enc_common.utos(new Uint8Array.from(await fil.arrayBuffer())) + "<<" + fil.type;
            })
        )).join("||")

        let tx_id = await bundlrClient.UploadBuffer(buffers);

        return physicalMarketClient.SetMedia(
            prod_addr,
            market_acc,
            market_auth,
            tx_id
        )

    }

    const SetInfo = async(prod_addr, name = "prod name", desc = "prod desc") =>{
        let market_acc = marketAccountsClient.market_account;
        let market_auth = marketAccountsClient.master_auth;

        let tx_url = await bundlrClient.UploadBuffer(name + "||" + desc)

        physicalMarketClient.SetProdInfo(
            prod_addr,
            market_acc,
            market_auth,
            tx_url
        )
    }

    /// BUYER UTILS

    const GetAllVendorPhysicalProducts = async(market_acc) =>{
        let vendor_catalog = await catalogClient.GetCacheCatalog(
            catalogClient.GenVendorListingsAddress(
                market_acc
            )
        )
        if(!(vendor_catalog.data)){
            return ""
        }

        let arclient = new ArQueryClient();
        let cache = vendor_catalog.data.cache;

        for(let link of vendor_catalog.data.memory){
            cache.push(...(await arclient.FetchData(link)).split("||"));
        }

        return (await physicalMarketClient.GetMultiplePhysicalProducts(cache)).filter(prod => prod.data != undefined);
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
        MfreeVendorListings,
        ListProduct,
        ChangePrice,
        ChangeQuantity,
        ChangeCurrency,
        SetMedia,
        SetInfo,
        GetAllVendorPhysicalProducts,
        ResolveProductMedia,
        ResolveProductInfo
    }
}