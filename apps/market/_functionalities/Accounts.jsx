import { useContext, useCallback } from "react";


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
    const CreateAccount = useCallback(async(user_metadata, payer_as_wallet = true, save_authority = true)=>{
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
        let ar_addr = await bundlrClient.UploadBuffer(Buffer.from(await file_common.GetFile()));

        await marketAccountsClient.UpdatePfp(ar_addr);
    }, [])

}