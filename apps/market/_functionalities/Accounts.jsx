import { useContext, useCallback } from "react";

import {ArQueryClient} from "data-transfer-clients";
import BundlrCtx from "@contexts/BundlrCtx";
import { ACCOUNTS_PROGRAM, TRANSACTION_PROGRAM } from "orbit-clients";

export function MarketAccountFunctionalities(props){
    const {bundlrClient} = useContext(BundlrCtx);


    // AFTER CREATING MAKE SURE TO CALL MATRIX REGISTER/LOGIN ALL THAT SHIT
    // CHECK HEADER
    // pfp is a file
    const CreateAccount = async(user_metadata, pfp = undefined, reflink = undefined, payer_wallet)=>{
        if (reflink == ""){
            reflink = undefined
        }

        let ixs = [];
        let dataitems = [];

        let pfp_data_item = undefined;
        if(pfp != ""){
            pfp_data_item = await bundlrClient.UploadBufferInstruction(pfp);
            dataitems.push(pfp_data_item);
        }

        let metadata_item = await bundlrClient.UploadBufferInstruction(
            JSON.stringify(user_metadata)
        );
        dataitems.push(metadata_item);

        ixs.push(
            await ACCOUNTS_PROGRAM.CreateAccount(
                metadata_item.id,
                pfp_data_item?.id,
                reflink,
                payer_wallet
            )
        );

        return [ixs,dataitems];
    }

    const SetPfp = async(file, payer_wallet)=>{
        let pfp_data_item = await bundlrClient.UploadBufferInstruction(file, payer_wallet);

        let update_ix = await ACCOUNTS_PROGRAM.UpdatePFP(pfp_data_item.id, payer_wallet);
        return [update_ix, [pfp_data_item]];
    }

    const UpdateMetadata = async(user_metadata, payer_wallet) =>{
        let metadata_item = await bundlrClient.UploadBufferInstruction(
            JSON.stringify(user_metadata)
        );
        let update_ix = await ACCOUNTS_PROGRAM.UpdateMetadata(metadata_item.id, payer_wallet);
        return [[update_ix], [metadata_item]];
    }

    const SetReflink = async(reflink, payer_wallet) => {
        await ACCOUNTS_PROGRAM.SetReflink(reflink, payer_wallet)
    }

    const UnsetReflink = async(payer_wallet) =>{
        await ACCOUNTS_PROGRAM.RemoveReflink(payer_wallet);
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
    const AddBuyerPhysicalTransactions = async(payer_wallet, voter_id) => {
        return ACCOUNTS_PROGRAM.AddBuyerPhysicalTransactions(
            TRANSACTION_PROGRAM.GenBuyerTransactionLog("physical", voter_id),
            payer_wallet
        );
    }
    const AddBuyerDigitalTransactions = async(payer_wallet, voter_id) => {
        return ACCOUNTS_PROGRAM.AddBuyerDigitalTransactions(
            TRANSACTION_PROGRAM.GenBuyerTransactionLog("digital", voter_id),
            payer_wallet
        );
    }
    const AddBuyerCommissionTransactions = async(payer_wallet, voter_id) => {
        return ACCOUNTS_PROGRAM.AddBuyerCommissionTransactions(
            TRANSACTION_PROGRAM.GenBuyerTransactionLog("commission", voter_id),
            payer_wallet
        );
    }

    /// :SELLER
    const AddSellerPhysicalTransactions = async(voter_id) => {
        return ACCOUNTS_PROGRAM.AddSellerPhysicalTransactions(
            TRANSACTION_PROGRAM.GenSellerTransactionLog("physical", voter_id)
        );
    }
    const AddSellerDigitalTransactions = async(voter_id) => {
        return ACCOUNTS_PROGRAM.AddSellerDigitalTransactions(
            TRANSACTION_PROGRAM.GenSellerTransactionLog("digital", voter_id)
        );
    }
    const AddSellerCommissionTransactions = async(voter_id) => {
        return ACCOUNTS_PROGRAM.AddSellerCommissionTransactions(
            TRANSACTION_PROGRAM.GenSellerTransactionLog("commission", voter_id)
        );
    }

    /////////////////////////////////////////////////////////////
    /// TRANSFER

    const InitiateTransfer = async(destination_wallet) =>{
        return ACCOUNTS_PROGRAM.InitiateTransfer(destination_wallet)
    }

    const ConfirmTransfer = async() =>{
        return ACCOUNTS_PROGRAM.ConfirmTransfer()
    }

    const DeclineTransfer = async() =>{
        return ACCOUNTS_PROGRAM.DeclineTransfer()
    }

    return {
        CreateAccount,
        SetPfp,
        SetReflink,
        UpdateMetadata,
        UnsetReflink,
        CreateReflink,
        DeleteReflink,
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