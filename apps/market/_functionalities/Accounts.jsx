import { useContext, useCallback } from "react";

import {ArQueryClient} from "data-transfer-clients";
import MarketAccountsCtx from "@contexts/MarketAccountsCtx";
import BundlrCtx from "@contexts/BundlrCtx";
import TransactionClientCtx from "@contexts/TransactionClientCtx";
import ProductClientCtx from "@contexts/ProductClientCtx";

export function MarketAccountFunctionalities(props){
    const {marketAccountsClient} = useContext(MarketAccountsCtx);
    const {bundlrClient} = useContext(BundlrCtx);
    const {transactionClient} = useContext(TransactionClientCtx);
    const {productClient} = useContext(ProductClientCtx);


    // AFTER CREATING MAKE SURE TO CALL MATRIX REGISTER/LOGIN ALL THAT SHIT
    // CHECK HEADER
    // pfp is a file
    const CreateAccount = async(user_metadata, pfp = undefined, reflink = undefined)=>{
        if (reflink == ""){
            reflink = undefined
        }
        let pfp_link = "";
        if(pfp != ""){
            pfp_link = await bundlrClient.UploadBuffer(pfp);
        }

        let metadata_addr = await bundlrClient.UploadBuffer(
            JSON.stringify(user_metadata)
        );

        await marketAccountsClient.CreateAccount(
            metadata_addr,
            pfp_link,
            reflink
        );

        return marketAccountsClient.GetAccount(
            marketAccountsClient.GenAccountAddress()
        );
        // try{
            
        // }catch(e){
        //     console.log(e, "error")
        //     return "could not create your account at the current time. please try again later"
        // }
    }

    const SetPfp = async(file)=>{
        let ar_addr = await bundlrClient.UploadBuffer(file);

        await marketAccountsClient.UpdatePFP(ar_addr);
    }

    const UpdateMetadata = async(user_metadata) =>{
        let metadata_addr = await bundlrClient.UploadBuffer(
            JSON.stringify(user_metadata)
        );
        await marketAccountsClient.UpdateMetadata(metadata_addr)
    }

    const SetReflink = async(reflink) => {
        await marketAccountsClient.SetReflink(reflink)
    }

    const UnsetReflink = async() =>{
        await marketAccountsClient.RemoveReflink();
    }

    ////////////////////////////////////////////////////////////////
    /// REFLINK

    const CreateReflink = async() =>{
        await marketAccountsClient.CreateReflink();
    }

    const DeleteReflink = async() =>{
        await marketAccountsClient.DeleteReflink();
    }

    ////////////////////////////////////////////////////////////////
    /// INIT VENDOR LISTINGS

    const AddVendorPhysicalListings = async() => {
        return marketAccountsClient.AddVendorPhysicalListings(
            productClient.GenListingsAddress("physical")
        )
    }
    const AddVendorDigitalListings = async() => {
        return marketAccountsClient.AddVendorDigitalListings(
            productClient.GenListingsAddress("digital")
        )
    }
    const AddVendorCommissionListings = async() => {
        return marketAccountsClient.AddVendorCommissionListings(
            productClient.GenListingsAddress("commission")
        )
    }

    ////////////////////////////////////////////////////////////////
    /// INIT TX LOGS

    /// :BUYER
    const AddBuyerPhysicalTransactions = async() => {
        return marketAccountsClient.AddBuyerPhysicalTransactions(
            transactionClient.GenBuyerTransactionLog("physical")
        );
    }
    const AddBuyerDigitalTransactions = async() => {
        return marketAccountsClient.AddBuyerDigitalTransactions(
            transactionClient.GenBuyerTransactionLog("digital")
        );
    }
    const AddBuyerCommissionTransactions = async() => {
        return marketAccountsClient.AddBuyerCommissionTransactions(
            transactionClient.GenBuyerTransactionLog("commission")
        );
    }

    /// :SELLER
    const AddSellerPhysicalTransactions = async() => {
        return marketAccountsClient.AddSellerPhysicalTransactions(
            transactionClient.GenSellerTransactionLog("physical")
        );
    }
    const AddSellerDigitalTransactions = async() => {
        return marketAccountsClient.AddSellerDigitalTransactions(
            transactionClient.GenSellerTransactionLog("digital")
        );
    }
    const AddSellerCommissionTransactions = async() => {
        return marketAccountsClient.AddSellerCommissionTransactions(
            transactionClient.GenSellerTransactionLog("commission")
        );
    }

    /////////////////////////////////////////////////////////////
    /// TRANSFER

    const InitiateTransfer = async(destination_wallet) =>{
        return marketAccountsClient.InitiateTransfer(destination_wallet)
    }

    const ConfirmTransfer = async() =>{
        return marketAccountsClient.ConfirmTransfer()
    }

    const DeclineTransfer = async() =>{
        return marketAccountsClient.DeclineTransfer()
    }


    /////////////////////////////////////////////////////////////
    /// INFO FETCHING

    const GetPfp = async(ar_addr)=>{
        try{
            let data = (await (new ArQueryClient()).GetImageData(ar_addr))[0];
            return data
        }catch{
            return undefined
        }
    }

    const GetMetadata = async(ar_addr)=>{
        try{
            let data = await (new ArQueryClient()).FetchData(ar_addr);
            return JSON.parse(data)
        }catch{
            return undefined
        }
    }

    return {
        CreateAccount,
        SetPfp,
        GetPfp,
        GetMetadata,
        SetReflink,
        UpdateMetadata,
        UnsetReflink,
        CreateReflink,
        DeleteReflink,
        AddVendorPhysicalListings,
        AddVendorDigitalListings,
        AddVendorCommissionListings,
        AddBuyerPhysicalTransactions,
        AddBuyerDigitalTransactions,
        AddBuyerCommissionTransactions,
        AddSellerPhysicalTransactions,
        AddSellerDigitalTransactions,
        AddSellerCommissionTransactions,
        InitiateTransfer,
        ConfirmTransfer,
        DeclineTransfer
    }
}