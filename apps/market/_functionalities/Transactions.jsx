import { useContext, useState, useCallback } from "react";
import PhysicalMarketCtx from "@contexts/PhysicalMarketCtx";
import DigitalMarketCtx from "@contexts/DigitalMarketCtx";
import MarketAccountsCtx from "@contexts/MarketAccountsCtx";
import MatrixClientCtx from "@contexts/MatrixClientCtx";
import BundlrCtx from "@contexts/BundlrCtx";


import {file_client, file_common, enc_common} from "browser-clients";
import { ArQueryClient } from "data-transfer-clients";
import { PublicKey } from "@solana/web3.js";
import DisputeProgramCtx from "@contexts/DisputeProgramCtx";

export function TransactionsGeneralFunctionalities(){
    const {physicalMarketClient} = useContext(PhysicalMarketCtx);
    const {digitalMarketClient} = useContext(DigitalMarketCtx);

    const [openPhysicalTransactions, setOpenPhysicalTransactions] = useState();
    const [openDigitalTransactions, setOpenDigitalTransactions] = useState();
    const [openServices, setOpenServices] = useState();

    const [pastPhysicalTransactions, setPastPhysicalTransactions] = useState();
    const [pastTransactions, setPastDigitalTransactions] = useState();
    const [pastServices, setPastServices] = useState();

    const GetOpenTransactions = useCallback(async ()=>{
        setOpenPhysicalTransactions(
            await physicalMarketClient.GetMultipleTransactions(
                await physicalMarketClient.GetOpenTransactionAddresses()
            )
        );

        let digital_txs = await digitalMarketClient.GetMultipleTransactions(
            await digitalMarketClient.GetOpenTransactionAddresses()
        );

        let tx_metas = await digitalMarketClient.GetOpenTransactionsValues();

        console.log("digital_tx_metas: ", tx_metas);

        setOpenDigitalTransactions(
            digital_txs.filter((a, ind) => {
                return (tx_metas[ind]["digital_type"]["Template"] != undefined)
            })
        );

        setOpenServices(
            digital_txs.filter((a, ind) => {
                return (tx_metas[ind]["digital_type"]["Commission"] != undefined)
            })
        )
        
    },[physicalMarketClient, digitalMarketClient])

    const GetPastTransactions = useCallback(async ()=>{
        let [pastPhysTx, pastPhysTxMetas] = await physicalMarketClient.GetClosedTransactionsProducts();
        let pastPhysMetas = await this.physicalMarketClient.GetMultiplePhyiscalProducts(pastPhysTxMetas);
        
        setPastPhysicalTransactions(
            pastPhysTx.map((tx_addr, ind) => {
                return {
                    tx_addr: tx_addr,
                    product: pastPhysMetas[ind]
                }
            })
        );

        let [pastDigitalTxs, pastDigitalTxMetas] = await digitalMarketClient.GetClosedTransactionsProducts();
        let pastDigitalMetas = await this.digitalMarketClient.GetMultiplePhyiscalProducts(pastDigitalTxMetas);

        pastDigitalTxs = pastDigitalTxs.map((tx_addr, ind) => {
            return {
                tx_addr: tx_addr,
                product: pastDigitalMetas[ind]
            }
        })

        let pastDigitalMetasIDB = await this.digitalMarketClient.GetClosedTransactionsValues();


        setPastDigitalTransactions(
            pastDigitalTxs.filter((a, ind) => {
                return (pastDigitalMetasIDB[ind]["digital_type"]["Template"] != undefined)
            })
        );

        setPastServices(
            pastDigitalTxs.filter((a, ind) => {
                return (pastDigitalMetasIDB[ind]["digital_type"]["Commission"] != undefined)
            })
        )

        
    },[physicalMarketClient, digitalMarketClient])


    const MarkTxClosed = useCallback(async (tx_type, tx_addr)=>{
        let client =  [digitalMarketClient, physicalMarketClient][+(tx_type == "physical")];
        let tx = await client.GetTransaction(tx_addr);
        if(!tx.data.metadata.transactionState["Closed"]){
            client.MarkAsClosedIDB(tx_addr);
        }
    }, []);

    const DeleteClosedTx = useCallback(async (tx_type, tx_addr)=>{
        let client =  [digitalMarketClient, physicalMarketClient][+(tx_type == "physical")];
        client.DeleteClosedTransactionIDB(tx_addr);
    }, []);

    return {
        GetOpenTransactions,
        GetPastTransactions,
        MarkTxClosed,
        DeleteClosedTx,

        openPhysicalTransactions,
        openDigitalTransactions,
        openServices,

        pastPhysicalTransactions,
        pastTransactions,
        pastServices,
    }    
}

export function DigitalFunctionalities(){
    const {digitalMarketClient} = useContext(DigitalMarketCtx);
    const {marketAccountsClient} = useContext(MarketAccountsCtx);
    const {bundlrClient} = useContext(BundlrCtx);
    const {matrixClient} = useContext(MatrixClientCtx);

    //// SELLER UTILS

    const ConfirmUpload = useCallback(async(tx_addr)=>{
        let market_acc = marketAccountsClient.market_account;
        let market_auth = marketAccountsClient.master_auth;

        await digitalMarketClient.UpdateStatusToShipping(
            tx_addr,
            market_acc,
            market_auth
        );

        await matrixClient.SendNotice(await digitalMarketClient.GetRoomId(tx_addr), "link set");
    },[])

    const UploadImage = useCallback(async(tx_addr) =>{
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
    }, [])

    const UploadAudio = useCallback(async (tx_addr)=>{}, []);
    const UploadVideo = useCallback(async (tx_addr)=>{}, []);

    const CommitNKeys = useCallback(async (tx_addr, indexes)=>{
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
    }, []);


    const CommitAllKeys = useCallback(async (tx_addr)=>{
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
    }, []);

    /////// BUYER UTILS

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

        return file_client.StitchEncryptedImage(
            raw_blocks[0],
            raw_blocks[1],
            raw_blocks[2],
            raw_blocks[3],
            await enc_common.DecryptStrings(await digitalMarketClient.GetCommittedKeys(), raw_blocks.slice(4))
        )
    }

    return {
        ConfirmUpload,
        UploadImageFinal,
        UploadAudio,
        UploadVideo,
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

    const UploadPreview = useCallback(async(tx_addr) =>{
        let market_acc = marketAccountsClient.market_account;
        let market_auth = marketAccountsClient.master_auth;

        let tx = await digitalMarketClient.GetTransaction(tx_addr);
        console.log("has comish", tx.data.hasComish);
        if(!tx.data.hasComish){
            return
        }

        // btoa(
        //     enc_common.utos(
        //         new Uint8Array(
        //             Buffer.from(
        //                 await file_common.GetFile()
        //             )
        //         )
        //     )
        // )

        let ar_addr = await bundlrClient.UploadBuffer(
            Buffer.from(
                await file_common.GetFile()
            ).toString()
        );

        await digitalMarketClient.CommitPreview(
            tx_addr,
            market_acc,
            market_auth,
            ar_addr
        );
    }, [])

    /**
     * 
     * @param {*} tx_addr 
     * @returns {Blob} for now. add proper decoding later
     */
    const SeePreview = async(tx_addr) =>{
        let comish_addr = digitalMarketClient.GetTransaction(tx_addr).data.comishAccount;
        let comish_data = digitalMarketClient.getComish(new PublicKey(comish_addr));
        let ar_addr = enc_common.utos(comish_data.data.previewAddress);

        let data = (new ArQueryClient()).FetchData(ar_addr);
        return new Blob([Buffer.from(data)]);
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

    const CommitMessage = async()
}