import { useContext, useState, useCallback } from "react";
import PhysicalMarketCtx from "@contexts/PhysicalMarketCtx";
import DigitalMarketCtx from "@contexts/DigitalMarketCtx";
import MarketAccountsCtx from "@contexts/MarketAccountsCtx";
import MatrixClientCtx from "@contexts/MatrixClientCtx";
import TransactionClientCtx from "@contexts/TransactionClientCtx";
import ProductClientCtx from "@contexts/ProductClientCtx";
import BundlrCtx from "@contexts/BundlrCtx";


import {file_client, file_common, enc_common} from "browser-clients";
import { ArQueryClient } from "data-transfer-clients";
import { PublicKey } from "@solana/web3.js";
import DisputeProgramCtx from "@contexts/DisputeProgramCtx";

/// OPENING TX TAKE STRUCTS
export function DigitalFunctionalities(){
    const {digitalMarketClient} = useContext(DigitalMarketCtx);
    const {marketAccountsClient} = useContext(MarketAccountsCtx);
    const {bundlrClient} = useContext(BundlrCtx);
    const {matrixClient} = useContext(MatrixClientCtx);
    const {transactionClient} = useContext(TransactionClientCtx);
    const {productClient} = useContext(ProductClientCtx);

    ////////////////////////////////////////////////////////////
    /// TRANSACTIONS

    /// :SOL
    OpenTransactionSol = async(
        product,
        use_discount
    )=>{
        let product_addr = product.address;
        let listings_addr = product.data.metadata.ownerCatalog;

        let listing_struct = await productClient.GetListingsStruct(listings_addr);
        let vendor_account = await marketAccountsClient.GetAccount(
            marketAccountsClient.GenAccountAddress(
                listing_struct.data.listingsOwner
            )
        );
        let seller_tx_log_addr = vendor_account.sellerDigitalTransactions;

        let next_open_seller_index = transactionClient.FindNextOpenSellerTransaction(seller_tx_log_addr);

        let buyer_tx_log_addr = transactionClient.GenBuyerTransactionLog("digital");
        let next_open_buyer_index = transactionClient.FindNextOpenBuyerTransaction(buyer_tx_log_addr);

        let buyer_account_addr = marketAccountsClient.GenAccountAddress();
        return digitalMarketClient.OpenTransactionSol(
            next_open_seller_index,
            seller_tx_log_addr,
            listings_addr,
            next_open_buyer_index,
            buyer_tx_log_addr,
            buyer_account_addr,
            product_addr,
            product.price,
            use_discount
        )
    }

    CloseTransactionSol = async(

    )=>{

    }

    FundEscrowSol = async(

    )=>{

    }

    SellerEarlyDeclineSol = async(

    )=>{

    }

    /// :SPL
    OpenTransactionSpl = async(

    )=>{

    }

    CloseTransactionSpl = async(

    )=>{

    }

    FundEscrowSpl = async(

    )=>{

    }

    sellerEarlyDeclineSpl = async(

    )=>{

    }


    //////////////////////////////////////////////////////
    /// SELLER UTILS

    const ConfirmUpload = async(tx_addr)=>{
        let market_acc = marketAccountsClient.market_account;
        let market_auth = marketAccountsClient.master_auth;

        await digitalMarketClient.UpdateStatusToShipping(
            tx_addr,
            market_acc,
            market_auth
        );

        await matrixClient.SendNotice(await digitalMarketClient.GetRoomId(tx_addr), "link set");
    }

    const UploadImage = async(tx_addr) =>{
        let market_acc = marketAccountsClient.market_account;
        let market_auth = marketAccountsClient.master_auth;

        let [ar_addr, kps] = await bundlrClient.UploadImageFinal(await file_common.GetFile());

        await digitalMarketClient.CommitInitKeys(
            kps.map(k => k.publicKey),
            tx_addr,
            market_acc,
            market_auth
        )

        await digitalMarketClient.CommitLink(
            ar_addr,
            tx_addr,
            market_acc,
            market_auth
        );
    }

    const CommitNKeys = async (tx_addr, indexes)=>{
        let market_auth = marketAccountsClient.market_account;
        let market_acc = marketAccountsClient.master_auth;

        let link = await digitalMarketClient.GetLink(tx_addr);
        let kps = bundlrClient.GetTransactionsKp(link);
        let kp_dict = {};
        
        indexes.forEach((ind)=>{
            kp_dict[ind] = kps[ind]
        });
        await this.digitalMarketClient.CommitSubkeys(
            kp_dict,
            tx_addr,
            market_acc,
            market_auth
        );
    };


    const CommitAllKeys = async (tx_addr)=>{
        let market_auth = marketAccountsClient.master_auth;
        let market_acc = marketAccountsClient.market_account;

        let missing_keys = await digitalMarketClient.CommitSubkeys(tx_addr);

        let link = await digitalMarketClient.GetLink(tx_addr);
        let kps = bundlrClient.GetTransactionsKp(link);
        let kp_dict = {};
        
        missing_keys.forEach((ind)=>{
            kp_dict[ind] = kps[ind]
        });

        await this.digitalMarketClient.CommitSubkeys(
            kp_dict,
            tx_addr,
            market_acc,
            market_auth
        );
    };

    ///////////////////////////////////////////////////////////////
    /// BUYER UTILS

    /**
     * 
     * @param {number[]} blocks 
     * @param {string} roomid 
     */
    const ChooseBlocks = async(blocks, roomid) =>{
        await matrixClient.SendNotice(roomid, "choose blocks" + blocks.join(","))
    }

    /**
     * 
     * @param {string} tx_addr 
     * @returns {DataUrl}
     */
    const DecryptImage = async(tx_addr) =>{

        let raw_blocks = await (new ArQueryClient()).FetchData( await digitalMarketClient.GetLink(tx_addr) ).split("||");

        return file_client.AssembleImage(
            raw_blocks[0],
            raw_blocks[1],
            raw_blocks[2],
            raw_blocks[3],
            await enc_common.DecryptStrings(await digitalMarketClient.GetCommittedKeys(), raw_blocks.slice(4))
        )
    }

    return {
        ConfirmUpload,
        UploadImage,
        CommitNKeys,
        CommitAllKeys,
        ChooseBlocks,
        DecryptImage,
    }
}

export function ServiceFunctionalities(){
    const {digitalMarketClient} = useContext(DigitalMarketCtx);
    const {marketAccountsClient} = useContext(MarketAccountsCtx);
    const {bundlrClient} = useContext(BundlrCtx);

    const UploadPreview = async(tx_addr) =>{
        let market_acc = marketAccountsClient.market_account;
        let market_auth = marketAccountsClient.master_auth;

        let tx = await digitalMarketClient.GetTransaction(tx_addr);
        console.log("has comish", tx.data.hasComish);
        if(!tx.data.hasComish){
            return
        }

        let ar_addr = await bundlrClient.UploadBuffer(
            enc_common.utos(new Uint8Array((await file_common.GetFile()).arrayBuffer()))
        );

        await digitalMarketClient.CommitPreview(
            tx_addr,
            market_acc,
            market_auth,
            ar_addr
        );
    }

    /**
     * 
     * @param {*} tx_addr 
     * @returns {Blob} for now. add proper decoding later
     */
    const SeePreview = async(tx_addr) =>{
        let comish_addr = digitalMarketClient.GetTransaction(tx_addr).data.comishAccount;
        let comish_data = digitalMarketClient.getComish(new PublicKey(comish_addr));
        let ar_addr = enc_common.utos(comish_data.data.previewAddress);

        return (new ArQueryClient()).GetImageData(ar_addr);
    }

    return {
        UploadPreview,
        SeePreview
    }
}

export function PhysicalFunctionalities(){
    const {physicalMarketClient} = useContext(PhysicalMarketCtx);
    const {marketAccountsClient} = useContext(MarketAccountsCtx);
    const {bundlrClient} = useContext(BundlrCtx);
    const {disputeProgramClient} = useContext(DisputeProgramCtx);

    const OpenDispute = async(tx_addr, threshold_voters)=>{
        let market_acc = marketAccountsClient.market_account;
        let market_auth = marketAccountsClient.master_auth;

        await physicalMarketClient.OpenDispute(
            tx_addr,
            threshold_voters,
            market_acc,
            market_auth
        )
    }

    return {
        OpenDispute
    }
}