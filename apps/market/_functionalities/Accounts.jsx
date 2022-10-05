import { useContext, useCallback } from "react";

import ArQueryClient from "data-transfer-clients";
import MarketAccountsCtx from "@contexts/MarketAccountsCtx";
import BundlrCtx from "@contexts/BundlrCtx";
import MatrixClientCtx from "@contexts/MatrixClientCtx";
import {enc_common, file_common} from "browser-clients";

import { ChatClient } from "data-transfer-clients";

export function MarketAccountFunctionalities(props){
    const {marketAccountsClient} = useContext(MarketAccountsCtx);
    const {bundlrClient} = useContext(BundlrCtx);


    // AFTER CREATING MAKE SURE TO CALL MATRIX REGISTER/LOGIN ALL THAT SHIT
    // CHECK HEADER
    // pfp is a file
    const CreateAccount = async(user_metadata, pfp, reflink = undefined)=>{
        console.log("creating account", bundlrClient)

        let pfp_link = "";
        if(pfp){
            pfp_link = await bundlrClient.UploadBuffer(
                enc_common.utos(new Uint8Array.from((pfp).arrayBuffer())) + "<<" + pfp.type
            );
        }

        let metadata_addr = await bundlrClient.UploadBuffer(
            JSON.stringify(user_metadata)
        );

        await marketAccountsClient.CreateAccount(
            metadata_addr,
            pfp_link,
            reflink
        );

        // let chat_client = new ChatClient(master_auth);

        // setMatrixClient(chat_client);

        // await chat_client.CreateAccount(master_auth);
        // await chat_client.Sync();
    }

    const SetPfp = async()=>{
        let file = await file_common.GetFile();
        let ar_addr = await bundlrClient.UploadBuffer(
            enc_common.utos(new Uint8Array.from((file).arrayBuffer())) + "<<" + file.type
        );

        await marketAccountsClient.UpdatePfp(ar_addr);
    }

    const SetReflink = async(reflink = undefined) => {
        await marketAccountsClient.SetReflink(reflink)
    }

    const UnsetReflink = async() =>{
        await marketAccountsClient.RemoveReflink();
    }

    const CreateReflink = async() =>{
        await marketAccountsClient.CreateReflink();
    }

    const DeleteReflink = async() =>{
        await marketAccountsClient.DeleteReflink();
    }

    const GetPfp = async(ar_addr)=>{
        return (await (new ArQueryClient()).GetImageData(ar_addr))[0];
    }

    const GetMetadata = useCallback(()=>{
        let data = (new ArQueryClient()).FetchData(ar_addr);
        return JSON.parse(data)
    }, [])

    return {
        CreateAccount,
        SetPfp,
        GetPfp,
        GetMetadata,
        SetReflink,
        UnsetReflink,
        CreateReflink,
        DeleteReflink
    }
}