import { useContext, useState, useCallback } from "react";

import DigitalMarketCtx from "@contexts/DigitalMarketCtx";
import PhysicalMarketCtx from "@contexts/PhysicalMarketCtx";
import MarketAccountsCtx from "@contexts/MarketAccountsCtx";
import BundlrCtx from "@contexts/BundlrCtx";


export function DigitalProductFunctionalities(props){
    const {digitalMarketClient} = useContext(DigitalMarketCtx);
    const {marketAccountsClient} = useContext(MarketAccountsCtx);
    const {bundlrClient} = useContext(BundlrCtx);

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

        await digitalMarketClient.ListDigitalProduct(
            market_acc,
            currency,
            price,
            available,
            deliveryEstimate,
            tx_id
        );
    }

    // Commission, Template
    ChangeProdType = async() =>{
        let market_acc = marketAccountsClient.market_account;
        let market_auth = marketAccountsClient.master_auth;
    }

    // Text, Video, Audio, Folder
    SetFileType = async() =>{
        let market_acc = marketAccountsClient.market_account;
        let market_auth = marketAccountsClient.master_auth;
        
    }

    ChangeAvailability = async(prod_addr, available = false) =>{
        let market_acc = marketAccountsClient.market_account;
        let market_auth = marketAccountsClient.master_auth;
        
        digitalMarketClient.ChangeAvailability(

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
        
        let buffers = await Promise.all(
            files.map((fil)=>{
                return fil.arrayBuffer();
            })
        );

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