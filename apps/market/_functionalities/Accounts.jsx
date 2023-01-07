import { useContext, useCallback } from "react";

import {ArQueryClient} from "data-transfer-clients";
import BundlrCtx from "@contexts/BundlrCtx";
import ProductClientCtx from "@contexts/ProductClientCtx";
import { ACCOUNTS_PROGRAM } from "orbit-clients";

export function MarketAccountFunctionalities(props){
    const {bundlrClient} = useContext(BundlrCtx);
    const {productClient} = useContext(ProductClientCtx);


    // AFTER CREATING MAKE SURE TO CALL MATRIX REGISTER/LOGIN ALL THAT SHIT
    // CHECK HEADER
    // pfp is a file
    const CreateAccount = async(user_metadata, pfp = undefined, reflink = undefined, payer_wallet)=>{
        if (reflink == ""){
            reflink = undefined
        }
        let pfp_link = "";
        if(pfp != ""){
            pfp_link = await bundlrClient.UploadBufferInstruction(pfp);
        }

        let metadata_addr = await bundlrClient.UploadBufferInstruction(
            JSON.stringify(user_metadata)
        );

        return await ACCOUNTS_PROGRAM.CreateAccount(
            metadata_addr,
            pfp_link,
            reflink,
            payer_wallet
        );
    }

    const SetPfp = async(file, payer_wallet)=>{
        let ar_addr = await bundlrClient.UploadBufferInstruction(file, payer_wallet);

        await ACCOUNTS_PROGRAM.UpdatePFP(ar_addr, payer_wallet);
    }

    const UpdateMetadata = async(user_metadata, payer_wallet) =>{
        let metadata_addr = await bundlrClient.UploadBufferInstruction(
            JSON.stringify(user_metadata)
        );
        await ACCOUNTS_PROGRAM.UpdateMetadata(metadata_addr, payer_wallet)
    }

    const SetReflink = async(reflink, payer_wallet) => {
        await ACCOUNTS_PROGRAM.SetReflink(reflink, payer_wallet)
    }

    const UnsetReflink = async(payer_wallet) =>{
        await marketAccountsClient.RemoveReflink(payer_wallet);
    }

    ////////////////////////////////////////////////////////////////
    /// REFLINK

    const CreateReflink = async(payer_wallet) =>{
        await ACCOUNTS_PROGRAM.CreateReflink(payer_wallet);
    }

    const DeleteReflink = async(payer_wallet) =>{
        await ACCOUNTS_PROGRAM.DeleteReflink(payer_wallet);
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

    return {
        CreateAccount,
        SetPfp,
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