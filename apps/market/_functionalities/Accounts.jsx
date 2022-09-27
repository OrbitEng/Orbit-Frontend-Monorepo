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
    const {matrixClient, setMatrixClient} = useContext(MatrixClientCtx);


    // AFTER CREATING MAKE SURE TO CALL MATRIX REGISTER/LOGIN ALL THAT SHIT
    // CHECK HEADER
    const CreateAccount = useCallback(async(user_metadata, payer_as_wallet = true)=>{
        let ar_addr = await bundlrClient.UploadBuffer(
            enc_common.stou(
                JSON.stringify(user_metadata)
            )
        );

        await marketAccountsClient.CreateAccount(
            ar_addr,
            payer_as_wallet
        );

        let master_auth = marketAccountsClient.master_auth; //keypair

        let chat_client = new ChatClient(master_auth);

        setMatrixClient(chat_client);

        await chat_client.CreateAccount(master_auth);
        await chat_client.Sync();
    }, [])

    const SetPfp = useCallback(async()=>{
        let ar_addr = await bundlrClient.UploadBuffer(
            enc_common.utos(new Uint8Array((await file_common.GetFile()).arrayBuffer()))
        );

        await marketAccountsClient.UpdatePfp(ar_addr);
    }, [])

    const GetPfp = useCallback(async(ar_addr)=>{
        return (await (new ArQueryClient()).GetImageData(ar_addr))[0];
    }, [])

    const GetMetadata = useCallback(()=>{
        let data = (new ArQueryClient()).FetchData(ar_addr);
        return JSON.parse(data)
    }, [])

    return {
        CreateAccount,
        SetPfp,
        GetPfp,
        GetMetadata
    }
}