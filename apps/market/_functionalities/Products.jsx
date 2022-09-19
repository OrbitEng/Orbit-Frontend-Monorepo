import { useContext, useState, useCallback } from "react";

import DigitalMarketCtx from "@contexts/DigitalMarketCtx";
import PhysicalMarketCtx from "@contexts/PhysicalMarketCtx";
import MarketAccountsCtx from "@contexts/MarketAccountsCtx";
import BundlrCtx from "@contexts/BundlrCtx";
import CatalogCtx from "@contexts/CatalogCtx";

import { ArQueryClient } from "data-transfer-clients";

// check if catalog.index == 24

export function DigitalProductFunctionalities(props){
    const {digitalMarketClient} = useContext(DigitalMarketCtx);
    const {marketAccountsClient} = useContext(MarketAccountsCtx);
    const {bundlrClient} = useContext(BundlrCtx);
    const {catalogClient} = useContext(CatalogCtx);

    /// SELLER UTILS
    MfreeVendorListings = async() => {
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

            let prods = (await digitalMarketClient.GetMultipleDigitalProducts(cache)).filter(prod => prod.data != undefined);
            let buff = prods.map(pk => pk.toString()).join("||");
            let link = await bundlrClient.UploadBuffer(buff);

            await catalogClient.RemapVendorCatalog(
                marketAccountsClient.market_account,
                marketAccountsClient.master_auth,
                link
            )
        }else if(vendor_catalog.data.flag){
            let buff = cache.map(pk => pk.toString()).join("||");
            
            await catalogClient.DrainVendorCatalog(
                marketAccountsClient.market_account,
                marketAccountsClient.master_auth,
                await bundlrClient.UploadBuffer(buff)
            );   
        }
    }


    ListProduct = async(
        currency = "11111111111111111111111111111111",
        price,
        available = true,
        deliveryEstimate = 14,
        files
    ) => {
        let market_acc = marketAccountsClient.market_account;
        let market_auth = marketAccountsClient.master_auth;

        let buffers = await Promise.all(
            files.map((fil)=>{
                return fil.arrayBuffer();
            })
        );

        let tx_id = await bundlrClient.UploadBuffer(buffers);

        let prod = await digitalMarketClient.ListDigitalProduct(
            market_acc,
            currency,
            price,
            available,
            deliveryEstimate,
            tx_id
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

        await MfreeVendorListings();
    }

    // Commission, Template
    ChangeProdType = async(
        prod_addr,
        prod_type = "Template"
    ) =>{
        let market_acc = marketAccountsClient.market_account;
        let market_auth = marketAccountsClient.master_auth;

        await digitalMarketClient.SetProductType(
            prod_addr,
            market_acc,
            market_auth,
            prod_type
        )   
    }

    // Text, Video, Audio, Image, Folder
    SetFileType = async(
        prod_addr,
        file_type = "Image"
    ) =>{
        let market_acc = marketAccountsClient.market_account;
        let market_auth = marketAccountsClient.master_auth;
        
        await digitalMarketClient.SetFileType(
            prod_addr,
            market_acc,
            market_auth,
            file_type
        )
    }

    ChangeAvailability = async(prod_addr, available = false) =>{
        let market_acc = marketAccountsClient.market_account;
        let market_auth = marketAccountsClient.master_auth;
        
        await digitalMarketClient.ChangeAvailability(
            prod_addr,
            market_acc,
            market_auth,
            available
        )
    }

    ChangePrice = async(prod_addr, new_price = 0) =>{
        let market_acc = marketAccountsClient.market_account;
        let market_auth = marketAccountsClient.master_auth;
        
        digitalMarketClient.ChangeProductPrice(
            prod_addr,
            market_acc,
            market_auth,
            new_price
        )
    }

    ChangeCurrency = async(prod_addr, new_currency = "11111111111111111111111111111111") =>{
        let market_acc = marketAccountsClient.market_account;
        let market_auth = marketAccountsClient.master_auth;
        
        digitalMarketClient.UpdateCurrency(
            prod_addr,
            market_acc,
            market_auth,
            new_currency
        )
    }

    SetMedia = async(prod_addr, files) =>{
        let market_acc = marketAccountsClient.market_account;
        let market_auth = marketAccountsClient.master_auth;
        
        let buffers = (await Promise.all(
            files.map((fil)=>{
                return fil.arrayBuffer();
            })
        )).join("||");

        let tx_id = await bundlrClient.UploadBuffer(buffers);

        digitalMarketClient.SetMedia(
            prod_addr,
            market_acc,
            market_auth,
            tx_id
        )
    }
}

export function PhysicalProductFunctionalities(props){
    const {physicalMarketClient} = useContext(PhysicalMarketCtx);
    const {marketAccountsClient} = useContext(MarketAccountsCtx);
    const {bundlrClient} = useContext(BundlrCtx);
    const {catalogClient} = useContext(CatalogCtx);

    /// SELLER UTILS
    MfreeVendorListings = async() => {
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

            let prods = (await physicalMarketClient.GetMultiplePhysicalProducts(cache)).filter(prod => prod.data != undefined);
            let buff = prods.map(pk => pk.toString()).join("||");
            let link = await bundlrClient.UploadBuffer(buff);

            await catalogClient.RemapVendorCatalog(
                marketAccountsClient.market_account,
                marketAccountsClient.master_auth,
                link
            )
        }else if(vendor_catalog.data.flag){
            let buff = cache.map(pk => pk.toString()).join("||");
            
            await catalogClient.DrainVendorCatalog(
                marketAccountsClient.market_account,
                marketAccountsClient.master_auth,
                await bundlrClient.UploadBuffer(buff)
            );   
        }
    }

    ListProduct = async(
        currency = "11111111111111111111111111111111",
        price,
        available = true,
        deliveryEstimate = 14,
        files
    ) => {
        let market_acc = marketAccountsClient.market_account;

        let buffers = await Promise.all(
            files.map((fil)=>{
                return fil.arrayBuffer();
            })
        );

        let tx_id = await bundlrClient.UploadBuffer(buffers);

        await physicalMarketClient.ListPhysicalProduct(
            market_acc,
            currency,
            price,
            available,
            deliveryEstimate,
            tx_id
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

        await MfreeVendorListings();
    }

    ChangePrice = async(prod_addr, new_price = 0) =>{
        let market_acc = marketAccountsClient.market_account;
        let market_auth = marketAccountsClient.master_auth;

        physicalMarketClient.ChangeProductPrice(
            prod_addr,
            market_acc,
            market_auth,
            new_price
        )
    }
    ChangeQuantity = async(prod_addr, new_quantity = 0) =>{
        let market_acc = marketAccountsClient.market_account;
        let market_auth = marketAccountsClient.master_auth;

        physicalMarketClient.ChangeProductQuantity(
            prod_addr,
            market_acc,
            market_auth,
            new_quantity
        )
    }
    ChangeCurrency = async(prod_addr, new_currency = "11111111111111111111111111111111") =>{
        let market_acc = marketAccountsClient.market_account;
        let market_auth = marketAccountsClient.master_auth;

        physicalMarketClient.UpdateCurrency(
            prod_addr,
            market_acc,
            market_auth,
            new_currency
        )
    }
    SetMedia = async(prod_addr, files) =>{
        let market_acc = marketAccountsClient.market_account;
        let market_auth = marketAccountsClient.master_auth;

        let buffers = await Promise.all(
            files.map((fil)=>{
                return fil.arrayBuffer();
            })
        );

        let tx_id = await bundlrClient.UploadBuffer(buffers);

        physicalMarketClient.SetMedia(
            prod_addr,
            market_acc,
            market_auth,
            tx_id
        )

    }
}