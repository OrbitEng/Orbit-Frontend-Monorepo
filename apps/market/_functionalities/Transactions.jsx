import { useContext, useState, useCallback } from "react";
import { DIGITAL_MARKET, PHYSICAL_MARKET, COMMISSION_MARKET, TRANSACTION_PROGRAM, PRODUCT_PROGRAM, DISPUTE_PROGRAM } from "orbit-clients";
import MatrixClientCtx from "@contexts/MatrixClientCtx";
import BundlrCtx from "@contexts/BundlrCtx";


import {file_client, file_common, enc_common} from "browser-clients";
import { PublicKey } from "@solana/web3.js";
import UserAccountCtx from "@contexts/UserAccountCtx";
import ArweaveCtx from "@contexts/ArweaveCtx";

export function CommonTxFunctionalities(props){
    const {matrixClient} = useContext(MatrixClientCtx);


    const OpenChat = async(other_party, txid) => {
        let roomid =  await matrixClient.StartConvo(other_party)
        await matrixClient.SendMessage(roomid, "Hi I've opened transaction: " + txid)
    }

    return{
        OpenChat
    }
}

/// OPENING TX TAKE STRUCTS
export function DigitalFunctionalities(){
    const {OpenChat} = CommonTxFunctionalities();

    const {bundlrClient} = useContext(BundlrCtx);
    const {matrixClient} = useContext(MatrixClientCtx);
    const {userAccount} = useContext(UserAccountCtx);
    const {arweaveClient} = useContext(ArweaveCtx);

    ////////////////////////////////////////////////////////////
    /// TRANSACTIONS

    /// :SOL
    const OpenTransactionSol = async(
        product,
        use_discount,
        payer_wallet
    )=>{
        let product_addr = product.address;
        let listings_addr = product.data.metadata.ownerCatalog;

        let vendor_account = product.data.metadata.seller.data;
        let seller_tx_log_addr = vendor_account.sellerDigitalTransactions;

        let next_open_seller_index = await TRANSACTION_PROGRAM.FindNextOpenSellerTransaction(seller_tx_log_addr);

        let buyer_tx_log_addr = userAccount.data.buyerDigitalTransactions;
        let next_open_buyer_index = await TRANSACTION_PROGRAM.FindNextOpenBuyerTransaction(buyer_tx_log_addr);
        let tx_addr = DIGITAL_PROGRAM.GenTransactionAddress(vendor_log_address, sellerIndex);
        let buyer_account_addr = userAccount.address;
        await OpenChat(vendor_account.address.toString(), tx_addr)
        return DIGITAL_PROGRAM.DigitalOpenTransactionSol(
            tx_addr,
            next_open_seller_index,
            seller_tx_log_addr,
            listings_addr,
            next_open_buyer_index,
            buyer_tx_log_addr,
            buyer_account_addr,
            product_addr,
            product.price,
            use_discount,
        payer_wallet
        );

    }

    const CloseTransactionSol = async(
        tx_addr
    )=>{

        let tx_struct = (await DIGITAL_PROGRAM.GetDigitalTransaction(tx_addr)).data.metadata;
        let seller_tx_log_struct = await TRANSACTION_PROGRAM.GetSellerOpenTransactions(tx_struct.seller);
        let seller_wallet = seller_tx_log_struct.sellerWallet;
        let seller_market_account_addr = ACCOUNTS_PROGRAM.GenAccountAddress(seller_wallet);
        let buyer_tx_log_struct = await TRANSACTION_PROGRAM.GetBuyerOpenTransactions(tx_struct.buyer);
        let buyer_market_account_addr = ACCOUNTS_PROGRAM.GenAccountAddress(buyer_wallet);
        let buyer_wallet = buyer_tx_log_struct.buyer_wallet;

        let buyer_acc_struct = await ACCOUNTS_PROGRAM.GetAccount(buyer_market_account_addr);
        let reflink_chain;
        if(buyer_acc_struct.used_reflink){
            reflink_chain = ACCOUNTS_PROGRAM.ReflinkSolChain(buyer_acc_struct.used_reflink);
        };


        return DIGITAL_PROGRAM.DigitalCloseTransactionSol(
            tx_addr,
            tx_struct,
            buyer_market_account_addr,
            buyer_wallet,
            seller_market_account_addr,
            seller_wallet,
            reflink_chain
        )

    }

    const FundEscrowSol = async(
        tx_addr,
        payer_wallet
    )=>{
        return DIGITAL_PROGRAM.DigitalFundEscrowSol(
            tx_addr,
            payer_wallet
        )

    }

    const SellerEarlyDeclineSol = async(
        tx_addr,
        payer_wallet
    )=>{
        let tx_struct = (await DIGITAL_PROGRAM.GetDigitalTransaction(tx_addr)).data.metadata;
        let buyer_tx_log = (await TRANSACTION_PROGRAM.GetBuyerOpenTransactions(tx_struct.buyer)).data;
        let buyer_wallet = buyer_tx_log.buyer_wallet;
        let buyer_account = ACCOUNTS_PROGRAM.GenAccountAddress(buyer_wallet);
        return DIGITAL_PROGRAM.DigitalSellerEarlyDeclineSol(
            tx_addr,
            buyer_wallet,
            buyer_account,
            payer_wallet
        )

    }

    /// :SPL
    const OpenTransactionSpl = async(
        product,
        use_discount,
        currency,
        payer_wallet
    )=>{
        let product_addr = product.address;
        let listings_addr = product.data.metadata.ownerCatalog;

        let vendor_account = product.data.metadata.seller.data;;
        let seller_tx_log_addr = vendor_account.sellerDigitalTransactions;

        let next_open_seller_index = await TRANSACTION_PROGRAM.FindNextOpenSellerTransaction(seller_tx_log_addr);

        let buyer_tx_log_addr = userAccount.data.buyerDigitalTransactions;
        let next_open_buyer_index = await TRANSACTION_PROGRAM.FindNextOpenBuyerTransaction(buyer_tx_log_addr);
        let tx_addr = DIGITAL_PROGRAM.GenDigitalTransactionAddress(vendor_log_address, sellerIndex);
        let buyer_account_addr = userAccount.address;

        await OpenChat(vendor_account.address.toString(), tx_addr);
        return DIGITAL_PROGRAM.DigitalOpenTransactionSpl(
            tx_addr,
            next_open_seller_index,
            seller_tx_log_addr,
            listings_addr,
            next_open_buyer_index,
            buyer_tx_log_addr,
            buyer_account_addr,
            product_addr,
            currency,
            product.price,
            use_discount,
            payer_wallet
        );

    }

    const CloseTransactionSpl = async(
        tx_addr
    )=>{
        let tx_struct = (await DIGITAL_PROGRAM.GetDigitalTransaction(tx_addr)).data.metadata;
        let seller_tx_log_struct = (await TRANSACTION_PROGRAM.GetSellerOpenTransactions(tx_struct.seller)).data;
        let seller_wallet = seller_tx_log_struct.sellerWallet;
        let buyer_tx_log_struct = (await TRANSACTION_PROGRAM.GetBuyerOpenTransactions(tx_struct.buyer)).data;
        let buyer_market_account_addr = ACCOUNTS_PROGRAM.GenAccountAddress(buyer_wallet);
        let buyer_wallet = buyer_tx_log_struct.buyer_wallet;

        let buyer_acc_struct = (await ACCOUNTS_PROGRAM.GetAccount(buyer_market_account_addr)).data;
        let reflink_chain;
        if(buyer_acc_struct.used_reflink){
            reflink_chain = ACCOUNTS_PROGRAM.ReflinkSplChain(buyer_acc_struct.used_reflink, tx_struct.metadata.currency);
        };
        return DIGITAL_PROGRAM.DigitalCloseTransactionSpl(
            tx_addr,

            buyer_wallet,
            seller_wallet,

            reflink_chain
        )

    }

    const FundEscrowSpl = async(
        tx_addr,
        payer_wallet
    )=>{
        return DIGITAL_PROGRAM.DigitalFundEscrowSpl(
            tx_addr,
            payer_wallet
            )

    }

    const SellerEarlyDeclineSpl = async(
        tx_addr,
        payer_wallet
    )=>{
        let tx_struct = (await DIGITAL_PROGRAM.GetDigitalTransaction(tx_addr)).data.metadata;
        let buyer_tx_log = (await TRANSACTION_PROGRAM.GetBuyerOpenTransactions(tx_struct.buyer)).data;
        let buyer_wallet = buyer_tx_log.buyer_wallet;
        let buyer_account = ACCOUNTS_PROGRAM.GenAccountAddress(buyer_wallet);

        return DIGITAL_PROGRAM.DigitalSellerEarlyDeclineSpl(
            tx_addr,

            buyer_wallet,
            buyer_account,
            payer_wallet
        )

    }


    //////////////////////////////////////////////////////
    /// SELLER UTILS

    const UpdateStatusToShipping = async(tx_addr, payer_wallet)=>{

        return DIGITAL_PROGRAM.DigitalUpdateStatusToShipping(
            tx_addr,
            market_acc,
            market_auth,
            payer_wallet
        );
    }

    // CommitInitKeys, CommitLink bundled together
    // funding_ix.sendTx, data_item.upload()
    const UploadProductFile = async(tx_addr, datafile, xslices, yslices, payer_wallet) =>{

        let [funding_ix, data_item, kps] = await bundlrClient.UploadFinalBufferInstruction(datafile, xslices, yslices);

        return [
        funding_ix,
        data_item,
        await DIGITAL_PROGRAM.DigitalCommitInitKeys(
            tx_addr,
            kps.map(k => k.publicKey),
            payer_wallet
        ),
        await DIGITAL_PROGRAM.DigitalCommitLink(
            tx_addr,
            data_item.id,
            payer_wallet
        )];
    }

    const CommitSubkeys = async (tx_addr, indexes, payer_wallet)=>{

        let link = (await DIGITAL_PROGRAM.GetDigitalTransaction(tx_addr)).data.dataAddress;
        let kps = bundlrClient.GetTransactionsKp(link);
        let kp_dict = {};
        
        indexes.forEach((ind)=>{
            kp_dict[ind] = kps[ind]
        });
        return DIGITAL_PROGRAM.DigitalCommitSubkeys(
            tx_addr,
            kp_dict,
            payer_wallet
        );
    };

    const SellerAcceptTransaction = async(
        tx_addr,
        payer_wallet
    ) =>{
        return DIGITAL_PROGRAM.DigitalSellerAcceptTransaction(tx_addr, payer_wallet)
    }

    ////////////////////////////////////////////////////
    /// BOTH PARTIES GENERAL UTILS
    const LeaveReview = async(
        tx_addr,
        payer_wallet,
        voter_id
    ) =>{
        let tx_struct = (await DIGITAL_PROGRAM.GetDigitalTransaction(tx_addr)).data.metadata;
        let other_party = (await TRANSACTION_PROGRAM.GetBuyerOpenTransactions(tx_struct.buyer)).data.buyer_wallet;

        if(TRANSACTION_PROGRAM.GenBuyerTransactionLog("digital", voter_id).toString() == other_party.toString()){
            other_party = tx_struct.seller;
        }

        let market_account = ACCOUNTS_PROGRAM.GenAccountAddress(payer_wallet.publicKey);

        return DIGITAL_PROGRAM.DigitalLeaveReview(
            tx_addr,
            other_party,
            market_account
        )

    }

    const CloseTransactionAccount = async(
        tx_addr,
        payer_wallet,
        voter_id
    ) =>{
        let tx_struct = (await DIGITAL_PROGRAM.GetDigitalTransaction(tx_addr)).data.metadata;
        let buyer_tx_log_addr = tx_struct.buyer;
        let buyer_tx_log_struct = await TRANSACTION_PROGRAM.GetBuyerOpenTransactions(buyer_tx_log_addr);
        let tx_log = TRANSACTION_PROGRAM.GenBuyerTransactionLog("digital", voter_id);
        if(TRANSACTION_PROGRAM.GenBuyerTransactionLog("digital", voter_id).toString() != buyer_tx_log_addr.toString()){
            tx_log = TRANSACTION_PROGRAM.GenSellerTransactionLog("digital", voter_id)
        }

        return DIGITAL_PROGRAM.DigitalCloseTransactionAccount(
            tx_addr,
            tx_log,
            buyer_tx_log_struct.data.buyer_wallet,
            payer_wallet
        )
    }

    ///////////////////////////////////////////////////////////////
    /// BUYER UTILS

    const ConfirmDelivered = async(
        tx_addr,
        payer_wallet
    ) => {
        return DIGITAL_PROGRAM.DigitalConfirmDelivered(tx_addr, payer_wallet)
    };

    const ConfirmAccept = async(
        tx_addr,
        payer_wallet
    ) => {
        return DIGITAL_PROGRAM.DigitalConfirmAccept(tx_addr, payer_wallet)
    };

    const DenyAccept = async(
        tx_addr,
        payer_wallet
    ) => {
        let tx_struct = (await DIGITAL_PROGRAM.GetDigitalTransaction(tx_addr)).data.metadata;
        let buyer_tx_log_struct = (await TRANSACTION_PROGRAM.GetBuyerOpenTransactions(tx_struct.buyer)).data;
        let buyer_account = ACCOUNTS_PROGRAM.GenAccountAddress(buyer_tx_log_struct.buyer_wallet);
        
        return DIGITAL_PROGRAM.DigitalDenyAccept(
            tx_addr,
            buyer_account,
            payer_wallet
        )
    };

    /// CHAT ONLY
    
    const ChooseBlocks = async(blocks, roomid) =>{
        await matrixClient.SendNotice(roomid, "chosenblocks:" + blocks.join(","))
    }

    const DecryptImage = async(tx_addr) =>{

        let raw_blocks = await arweaveClient.FetchData( (await DIGITAL_PROGRAM.GetDigitalTransaction(tx_addr)).metadata.dataAddress ).split(">UwU<");

        return file_client.AssembleImage(
            raw_blocks[0],
            raw_blocks[1],
            raw_blocks[2],
            raw_blocks[3],
            await enc_common.DecryptStrings(await DIGITAL_PROGRAM.DigitalGetCommittedKeys(), raw_blocks.slice(4))
        )
    }

    return {
        UpdateStatusToShipping,
        UploadProductFile,
        CommitSubkeys,
        ChooseBlocks,
        DecryptImage,
        OpenTransactionSol,
        CloseTransactionSol,
        FundEscrowSol,
        SellerEarlyDeclineSol,
        OpenTransactionSpl,
        CloseTransactionSpl,
        FundEscrowSpl,
        SellerEarlyDeclineSpl,
        SellerAcceptTransaction,
        LeaveReview,
        CloseTransactionAccount,
        ConfirmDelivered,
        ConfirmAccept,
        DenyAccept,
        ChooseBlocks,
        DecryptImage
    }
}

export function CommissionFunctionalities(){
    const {OpenChat} = CommonTxFunctionalities();

    const {matrixClient} = useContext(MatrixClientCtx);
    const {bundlrClient} = useContext(BundlrCtx);
    const {userAccount} = useContext(UserAccountCtx);
    const {arweaveClient} = useContext(ArweaveCtx);

    ////////////////////////////////////////
    /// TRANSACTIONS

    /// :SOL
    const OpenTransactionSol = async(
        product,
        use_discount,
        payer_wallet
    )=>{
        let product_addr = product.address;
        let listings_addr = product.data.metadata.ownerCatalog;

        let vendor_account = product.data.metadata.seller.data;
        let seller_tx_log_addr = vendor_account.sellerCommissionTransactions;

        let next_open_seller_index = await TRANSACTION_PROGRAM.FindNextOpenSellerTransaction(seller_tx_log_addr);

        let buyer_tx_log_addr = userAccount.data.buyerCommissionTransactions;
        let next_open_buyer_index = await TRANSACTION_PROGRAM.FindNextOpenBuyerTransaction(buyer_tx_log_addr);
        let tx_addr = COMMISSION_MARKET_PROGRAM.GenTransactionAddress(vendor_log_address, sellerIndex);

        let buyer_account_addr = userAccount.address;
        
        await OpenChat(vendor_account.address.toString(), tx_addr);
        return COMMISSION_MARKET_PROGRAM.CommissionOpenTransactionSol(
            tx_addr,
            next_open_seller_index,
            seller_tx_log_addr,
            listings_addr,
            next_open_buyer_index,
            buyer_tx_log_addr,
            buyer_account_addr,
            product_addr,
            product.price,
            use_discount,
            payer_wallet
        )
    }

    const CloseTransactionSol = async(
        tx_addr
    )=>{

        let tx_struct = (await COMMISSION_MARKET_PROGRAM.GetCommissionTransaction(tx_addr)).data.metadata;
        let seller_tx_log_struct = await TRANSACTION_PROGRAM.GetSellerOpenTransactions(tx_struct.seller);
        let seller_wallet = seller_tx_log_struct.sellerWallet;
        let seller_market_account_addr = ACCOUNTS_PROGRAM.GenAccountAddress(seller_wallet);
        let buyer_tx_log_struct = await TRANSACTION_PROGRAM.GetBuyerOpenTransactions(tx_struct.buyer);
        let buyer_market_account_addr = ACCOUNTS_PROGRAM.GenAccountAddress(buyer_wallet);
        let buyer_wallet = buyer_tx_log_struct.buyer_wallet;

        let buyer_acc_struct = await ACCOUNTS_PROGRAM.GetAccount(buyer_market_account_addr);
        let reflink_chain;
        if(buyer_acc_struct.used_reflink){
            reflink_chain = ACCOUNTS_PROGRAM.ReflinkSolChain(buyer_acc_struct.used_reflink);
        };


        return COMMISSION_MARKET_PROGRAM.CommissionCloseTransactionSol(
            tx_addr,
            tx_struct,
            buyer_market_account_addr,
            buyer_wallet,
            seller_market_account_addr,
            seller_wallet,
            reflink_chain
        )

    }

    const FundEscrowSol = async(
        tx_addr,
        payer_wallet
    )=>{
        return COMMISSION_MARKET_PROGRAM.CommissionFundEscrowSol(tx_addr, payer_wallet)

    }

    const SellerEarlyDeclineSol = async(
        tx_addr,
        payer_wallet
    )=>{
        let tx_struct = (await COMMISSION_MARKET_PROGRAM.GetCommissionTransaction(tx_addr)).data.metadata;
        let buyer_tx_log = (await TRANSACTION_PROGRAM.GetBuyerOpenTransactions(tx_struct.buyer)).data;
        let buyer_wallet = buyer_tx_log.buyer_wallet;
        let buyer_account = ACCOUNTS_PROGRAM.GenAccountAddress(buyer_wallet);
        return COMMISSION_MARKET_PROGRAM.CommissionSellerEarlyDeclineSol(
            tx_addr,
            buyer_wallet,
            buyer_account,
            payer_wallet
        )

    }

    /// :SPL
    const OpenTransactionSpl = async(
        product,
        use_discount,
        currency,
        payer_wallet
    )=>{
        let product_addr = product.address;
        let listings_addr = product.data.metadata.ownerCatalog;

        let vendor_account = product.data.metadata.seller.data;
        let seller_tx_log_addr = vendor_account.sellerCommissionTransactions;

        let next_open_seller_index = await TRANSACTION_PROGRAM.FindNextOpenSellerTransaction(seller_tx_log_addr);

        let buyer_tx_log_addr = userAccount.data.buyerCommissionTransactions;
        let next_open_buyer_index = await TRANSACTION_PROGRAM.FindNextOpenBuyerTransaction(buyer_tx_log_addr);

        let tx_addr = COMMISSION_MARKET_PROGRAM.GenCommissionTransactionAddress(vendor_log_address, sellerIndex);
        let buyer_account_addr = userAccount.address;

        await OpenChat(vendor_account.address.toString(), tx_addr);
        return COMMISSION_MARKET_PROGRAM.CommissionOpenTransactionSpl(
            tx_addr,
            next_open_seller_index,
            seller_tx_log_addr,
            listings_addr,
            
            next_open_buyer_index,
            buyer_tx_log_addr,
            buyer_account_addr,

            product_addr,
            currency,
            product.price,
            
            use_discount,
            payer_wallet
        )
    }

    const CloseTransactionSpl = async(
        tx_addr
    )=>{
        let tx_struct = (await COMMISSION_MARKET_PROGRAM.GetCommissionTransaction(tx_addr)).data.metadata;
        let seller_tx_log_struct = (await TRANSACTION_PROGRAM.GetSellerOpenTransactions(tx_struct.seller)).data;
        let seller_wallet = seller_tx_log_struct.sellerWallet;
        let buyer_tx_log_struct = (await TRANSACTION_PROGRAM.GetBuyerOpenTransactions(tx_struct.buyer)).data;
        let buyer_market_account_addr = ACCOUNTS_PROGRAM.GenAccountAddress(buyer_wallet);
        let buyer_wallet = buyer_tx_log_struct.buyer_wallet;

        let buyer_acc_struct = (await ACCOUNTS_PROGRAM.GetAccount(buyer_market_account_addr)).data;
        let reflink_chain;
        if(buyer_acc_struct.used_reflink){
            reflink_chain = ACCOUNTS_PROGRAM.ReflinkSplChain(buyer_acc_struct.used_reflink, tx_struct.metadata.currency);
        };
        return COMMISSION_MARKET_PROGRAM.CommissionCloseTransactionSpl(
            tx_addr,

            buyer_wallet,
            seller_wallet,

            reflink_chain
        )

    }

    const FundEscrowSpl = async(
        tx_addr,
        payer_wallet
    )=>{
        return COMMISSION_MARKET_PROGRAM.CommissionFundEscrowSpl(tx_addr, payer_wallet)
    }

    const SellerEarlyDeclineSpl = async(
        tx_addr,
        payer_wallet
    )=>{
        let tx_struct = (await COMMISSION_MARKET_PROGRAM.GetCommissionTransaction(tx_addr)).data.metadata;
        let buyer_tx_log = (await TRANSACTION_PROGRAM.GetBuyerOpenTransactions(tx_struct.buyer)).data;
        let buyer_wallet = buyer_tx_log.buyer_wallet;
        let buyer_account = ACCOUNTS_PROGRAM.GenAccountAddress(buyer_wallet);

        return COMMISSION_MARKET_PROGRAM.CommissionSellerEarlyDeclineSpl(
            tx_addr,

            buyer_wallet,
            buyer_account,
            payer_wallet
        )

    }


    ////////////////////////////////////////
    /// BUYER UTILS

    const ConfirmDelivered = async(
        tx_addr,
        payer_wallet
    ) => {
        return COMMISSION_MARKET_PROGRAM.CommissionConfirmDelivered(tx_addr, payer_wallet)
    };

    const ConfirmAccept = async(
        tx_addr,
        payer_wallet
    ) => {
        return COMMISSION_MARKET_PROGRAM.CommissionConfirmAccept(tx_addr, payer_wallet)
    };
    const DenyAccept = async(
        tx_addr,
        payer_wallet
    ) => {
        let tx_struct = (await COMMISSION_MARKET_PROGRAM.GetCommissionTransaction(tx_addr)).data.metadata;
        let buyer_tx_log_struct = (await TRANSACTION_PROGRAM.GetBuyerOpenTransactions(tx_struct.buyer)).data;
        let buyer_account = ACCOUNTS_PROGRAM.GenAccountAddress(buyer_tx_log_struct.buyer_wallet);
        
        return COMMISSION_MARKET_PROGRAM.CommissionDenyAccept(
            tx_addr,
            buyer_account,
            payer_wallet
        )
    }

    ////////////////////////////////////////
    /// SELLER COMMITS

    // commit keys and commit link together
    const UploadProductFile = async(tx_addr, datafile, xslices, yslices,
        payer_wallet) =>{
        let [funding_ix, data_item, kps] = await bundlrClient.UploadFinalBufferInstruction(datafile, xslices, yslices);

        return [
            funding_ix,
            data_item,
            await COMMISSION_MARKET_PROGRAM.CommissionCommitInitKeys(
                tx_addr,
                kps.map(k => k.publicKey),
                payer_wallet
            ),
            await COMMISSION_MARKET_PROGRAM.CommissionCommitLink(
                tx_addr,
                ar_addr,
                payer_wallet
            )
        ]
    }

    const UpdateStatusToShipping = async(tx_addr,
        payer_wallet)=>{

        return COMMISSION_MARKET_PROGRAM.CommissionUpdateStatusToShipping(
            tx_addr,
            market_acc,
            market_auth,
            payer_wallet
        );
    }

    const CommitSubkeys = async (tx_addr, indexes,
        payer_wallet)=>{

        let link = (await COMMISSION_MARKET_PROGRAM.GetCommissionTransaction(tx_addr)).data.dataAddress;
        let kps = bundlrClient.GetTransactionsKp(link);
        let kp_dict = {};
        
        indexes.forEach((ind)=>{
            kp_dict[ind] = kps[ind]
        });
        return COMMISSION_MARKET_PROGRAM.CommissionCommitSubkeys(
            kp_dict,
            tx_addr,
            market_acc,
            market_auth,
            payer_wallet
        );
    };

    
    /////////////////////////////////
    /// SELLER UTILS
    
    const SellerAcceptTransaction = async(
        tx_addr,
        payer_wallet
    ) =>{
        return COMMISSION_MARKET_PROGRAM.CommissionSellerAcceptTransaction(tx_addr,
            payer_wallet)
    }

    ////////////////////////////////////////////////////
    /// POST TX

    const LeaveReview = async(
        tx_addr,
        payer_wallet,
        voter_id
    ) =>{
        let tx_struct = (await COMMISSION_MARKET_PROGRAM.GetCommissionTransaction(tx_addr)).data.metadata;
        let other_party = (await COMMISSION_MARKET_PROGRAM.GetBuyerOpenTransactions(tx_struct.buyer)).data.buyer_wallet;

        if(TRANSACTION_PROGRAM.GenBuyerTransactionLog("commission", voter_id).toString() == other_party.toString()){
            other_party = tx_struct.seller;
        }

        let market_account = ACCOUNTS_PROGRAM.GenAccountAddress(payer_wallet.publicKey);

        return COMMISSION_MARKET_PROGRAM.CommissionLeaveReview(
            tx_addr,
            other_party,
            market_account,
            payer_wallet
        )

    }

    const CloseTransactionAccount = async(
        tx_addr,
        payer_wallet,
        voter_id
    ) =>{
        let tx_struct = (await COMMISSION_MARKET_PROGRAM.GetCommissionTransaction(tx_addr)).data.metadata;
        let buyer_tx_log_addr = tx_struct.buyer;
        let buyer_tx_log_struct = await TRANSACTION_PROGRAM.GetBuyerOpenTransactions(buyer_tx_log_addr);
        let tx_log = TRANSACTION_PROGRAM.GenBuyerTransactionLog("commission", voter_id);
        if(tx_log.toString() != buyer_tx_log_addr.toString()){
            tx_log = TRANSACTION_PROGRAM.GenSellerTransactionLog("commission", voter_id)
        }

        return COMMISSION_MARKET_PROGRAM.CommissionCloseTransactionAccount(
            tx_addr,
            tx_log,
            buyer_tx_log_struct.data.buyer_wallet,
            payer_wallet
        )
    }

    /////////////////////////////////////////////////
    /// COMISSION SPECIFIC

    const CommitPreview = async(
        tx_addr,
        preview_file_dataurl,
        payer_wallet
    ) =>{

        if(preview_file_dataurl.join){
            preview_file_dataurl = preview_file_dataurl.join(">UwU<")
        }
        let ar_addr = await bundlrClient.UploadBufferInstruction(preview_file_dataurl);
        let funding_ix = (await bundlrClient.FundInstructionSizes([ar_addr.size]));

        let update_ix = await COMMISSION_MARKET_PROGRAM.CommissionCommitPreview(
            tx_addr,
            ar_addr,
            payer_wallet
        );

        return [
            [funding_ix, update_ix],
            [ar_addr]
        ]
    }

    const ProposeRate = async(
        tx_addr,
        new_rate,
        payer_wallet,
        voter_id
    ) =>{
        let tx_struct = (await COMMISSION_MARKET_PROGRAM.GetCommissionTransaction(tx_addr)).data;
        let tx_log_addr = TRANSACTION_PROGRAM.GenBuyerTransactionLog("commission", voter_id);
        if(tx_log_addr.toString() != tx_struct.buyer){
            tx_log_addr = tx_struct.seller;
        }
        return COMMISSION_MARKET_PROGRAM.CommissionProposeRate(
            tx_addr,
            tx_log_addr,
            new_rate,
            payer_wallet
        )
    }
    const AcceptRate = async(
        tx_addr,
        payer_wallet,
        voter_id
    ) =>{
        let tx_struct = (await COMMISSION_MARKET_PROGRAM.GetCommissionTransaction(tx_addr)).data;
        let tx_log_addr = TRANSACTION_PROGRAM.GenBuyerTransactionLog("commission", voter_id);
        if(tx_log_addr.toString() != tx_struct.buyer){
            tx_log_addr = tx_struct.seller;
        }
        return COMMISSION_MARKET_PROGRAM.CommissionAcceptRate(
            tx_addr,
            tx_log_addr,
            payer_wallet
        )
    }

    //////////////////////////////////////////////
    /// CHAT ONLY
    
    const ChooseBlocks = async(blocks, roomid) =>{
        await matrixClient.SendNotice(roomid, "chosenblocks:" + blocks.join(","))
    }

    const DecryptImage = async(tx_addr) =>{

        let raw_blocks = await arweaveClient.FetchData((await COMMISSION_MARKET_PROGRAM.GetCommissionTransaction(tx_addr)).metadata.dataAddress ).split(">UwU<");

        return file_client.AssembleImage(
            raw_blocks[0],
            raw_blocks[1],
            raw_blocks[2],
            raw_blocks[3],
            await enc_common.DecryptStrings(await COMMISSION_MARKET_PROGRAM.CommissionGetCommittedKeys(), raw_blocks.slice(4))
        )
    }

    /// :COMMISSION SPECIFIC

    /**
     * 
     * @param {*} tx_addr 
     * @returns {Blob} for now. add proper decoding later
     */
    const SeePreview = async(tx_addr) =>{
        let ar_addr = (await COMMISSION_MARKET_PROGRAM.GetCommissionTransaction(tx_addr)).data.previewAddress;

        return arweaveClient.GetImageData(ar_addr);
    }

    return {
        OpenTransactionSol,
        CloseTransactionSol,
        FundEscrowSol,
        SellerEarlyDeclineSol,
        OpenTransactionSpl,
        CloseTransactionSpl,
        FundEscrowSpl,
        SellerEarlyDeclineSpl,
        ConfirmDelivered,
        ConfirmAccept,
        DenyAccept,
        UploadProductFile,
        UpdateStatusToShipping,
        CommitSubkeys,
        SellerAcceptTransaction,
        LeaveReview,
        CloseTransactionAccount,
        CommitPreview,
        ProposeRate,
        AcceptRate,
        ChooseBlocks,
        DecryptImage,
        SeePreview
    }
}

export function PhysicalFunctionalities(){
    const {OpenChat} = CommonTxFunctionalities();
    const {arweaveClient} = useContext(ArweaveCtx);
    const {userAccount} = useContext(UserAccountCtx);

    ////////////////////////////////////////
    /// TRANSACTIONS

    /// :SOL
    const OpenTransactionSol = async(
        product,
        use_discount,
        payer_wallet
    )=>{
        let product_addr = product.address;
        let listings_addr = product.data.metadata.ownerCatalog;

        let vendor_account = product.data.metadata.seller.data;
        let seller_tx_log_addr = vendor_account.sellerPhysicalTransactions;

        let next_open_seller_index = await TRANSACTION_PROGRAM.FindNextOpenSellerTransaction(seller_tx_log_addr);

        let buyer_tx_log_addr = userAccount.data.buyerPhysicalTransactions;
        let next_open_buyer_index = await TRANSACTION_PROGRAM.FindNextOpenBuyerTransaction(buyer_tx_log_addr);
        let tx_addr = PHYSICAL_PROGRAM.GenPhysicalTransactionAddress(vendor_log_address, sellerIndex);

        let buyer_account_addr = userAccount.address;

        await  PHYSICAL_PROGRAM.PhysicalOpenTransactionSol(
            tx_addr,
            next_open_seller_index,
            seller_tx_log_addr,
            listings_addr,

            next_open_buyer_index,
            userAccount.data.buyerPhysicalTransactions,
            buyer_account_addr,

            product_addr,
            product.price,
            
            use_discount,
            payer_wallet
        );

        await OpenChat(vendor_account.address.toString(), tx_addr);
    }

    const CloseTransactionSol = async(
        tx_addr
    )=>{

        let tx_struct = (await PHYSICAL_PROGRAM.GetPhysicalTransaction(tx_addr)).data.metadata;
        let seller_tx_log_struct = await TRANSACTION_PROGRAM.GetSellerOpenTransactions(tx_struct.seller);
        let seller_wallet = seller_tx_log_struct.sellerWallet;
        let seller_market_account_addr = ACCOUNTS_PROGRAM.GenAccountAddress(seller_wallet);
        let buyer_tx_log_struct = await TRANSACTION_PROGRAM.GetBuyerOpenTransactions(tx_struct.buyer);
        let buyer_market_account_addr = ACCOUNTS_PROGRAM.GenAccountAddress(buyer_wallet);
        let buyer_wallet = buyer_tx_log_struct.buyer_wallet;

        let buyer_acc_struct = await ACCOUNTS_PROGRAM.GetAccount(buyer_market_account_addr);
        let reflink_chain;
        if(buyer_acc_struct.used_reflink){
            reflink_chain = ACCOUNTS_PROGRAM.ReflinkSolChain(buyer_acc_struct.used_reflink);
        };


        return PHYSICAL_PROGRAM.PhysicalCloseTransactionSol(
            tx_addr,
            tx_struct,
            buyer_market_account_addr,
            buyer_wallet,
            seller_market_account_addr,
            seller_wallet,
            reflink_chain
        )

    }

    const FundEscrowSol = async(
        tx_addr,
        payer_wallet
    )=>{
        return PHYSICAL_PROGRAM.PhysicalFundEscrowSol(tx_addr, payer_wallet)

    }

    const SellerEarlyDeclineSol = async(
        tx_addr,
        payer_wallet
    )=>{
        let tx_struct = (await PHYSICAL_PROGRAM.GetPhysicalTransaction(tx_addr)).data.metadata;
        let buyer_tx_log = (await TRANSACTION_PROGRAM.GetBuyerOpenTransactions(tx_struct.buyer)).data;
        let buyer_wallet = buyer_tx_log.buyer_wallet;
        let buyer_account = ACCOUNTS_PROGRAM.GenAccountAddress(buyer_wallet);
        return PHYSICAL_PROGRAM.PhysicalSellerEarlyDeclineSol(
            tx_addr,
            buyer_wallet,
            buyer_account,
            payer_wallet
        )

    }

    /// :SPL
    const OpenTransactionSpl = async(
        product,
        use_discount,
        currency,
        payer_wallet,
        voter_id
    )=>{
        let product_addr = product.address;
        let listings_addr = product.data.metadata.ownerCatalog;

        let vendor_account = product.data.metadata.seller.data;
        let seller_tx_log_addr = vendor_account.sellerPhysicalTransactions;

        let next_open_seller_index = await TRANSACTION_PROGRAM.FindNextOpenSellerTransaction(seller_tx_log_addr);

        let buyer_tx_log_addr = TRANSACTION_PROGRAM.GenBuyerTransactionLog("physical", voter_id);
        let next_open_buyer_index = await TRANSACTION_PROGRAM.FindNextOpenBuyerTransaction(buyer_tx_log_addr);
        let tx_addr = PHYSICAL_PROGRAM.GenPhysicalTransactionAddress(vendor_log_address, sellerIndex);
        let buyer_account_addr = ACCOUNTS_PROGRAM.GenAccountAddress(payer_wallet.publicKey);

        await PHYSICAL_PROGRAM.PhysicalOpenTransactionSpl(
            tx_addr,
            next_open_seller_index,
            seller_tx_log_addr,
            listings_addr,
            
            next_open_buyer_index,
            buyer_tx_log_addr,
            buyer_account_addr,

            product_addr,
            currency,
            product.price,
            
            use_discount,
            payer_wallet
        );

        await OpenChat(vendor_account.address.toString(), tx_addr);

    }

    const CloseTransactionSpl = async(
        tx_addr
    )=>{
        let tx_struct = (await PHYSICAL_PROGRAM.GetPhysicalTransaction(tx_addr)).data.metadata;
        let seller_tx_log_struct = (await TRANSACTION_PROGRAM.GetSellerOpenTransactions(tx_struct.seller)).data;
        let seller_wallet = seller_tx_log_struct.sellerWallet;
        let buyer_tx_log_struct = (await TRANSACTION_PROGRAM.GetBuyerOpenTransactions(tx_struct.buyer)).data;
        let buyer_market_account_addr = ACCOUNTS_PROGRAM.GenAccountAddress(buyer_wallet);
        let buyer_wallet = buyer_tx_log_struct.buyer_wallet;

        let buyer_acc_struct = (await ACCOUNTS_PROGRAM.GetAccount(buyer_market_account_addr)).data;
        let reflink_chain;
        if(buyer_acc_struct.used_reflink){
            reflink_chain = ACCOUNTS_PROGRAM.ReflinkSplChain(buyer_acc_struct.used_reflink, tx_struct.metadata.currency);
        };
        return PHYSICAL_PROGRAM.PhysicalCloseTransactionSpl(
            tx_addr,

            buyer_wallet,
            seller_wallet,

            reflink_chain
        )

    }

    const FundEscrowSpl = async(
        tx_addr,
        payer_wallet
    )=>{
        return PHYSICAL_PROGRAM.PhysicalFundEscrowSpl(tx_addr, payer_wallet)

    }

    const SellerEarlyDeclineSpl = async(
        tx_addr,
        payer_wallet
    )=>{
        let tx_struct = (await PHYSICAL_PROGRAM.GetPhysicalTransaction(tx_addr)).data.metadata;
        let buyer_tx_log = (await TRANSACTION_PROGRAM.GetBuyerOpenTransactions(tx_struct.buyer)).data;
        let buyer_wallet = buyer_tx_log.buyer_wallet;
        let buyer_account = ACCOUNTS_PROGRAM.GenAccountAddress(buyer_wallet);

        return PHYSICAL_PROGRAM.PhysicalSellerEarlyDeclineSpl(
            tx_addr,

            buyer_wallet,
            buyer_account,
            payer_wallet
        )

    }


    ////////////////////////////////////////////////////
    /// BOTH PARTIES GENERAL UTILS
    const LeaveReview = async(
        tx_addr,
        payer_wallet,
        voter_id
    ) =>{
        let tx_struct = (await PHYSICAL_PROGRAM.GetPhysicalTransaction(tx_addr)).data.metadata;
        let other_party = (await TRANSACTION_PROGRAM.GetBuyerOpenTransactions(tx_struct.buyer)).data.buyer_wallet;

        if(TRANSACTION_PROGRAM.GenBuyerTransactionLog("digital", voter_id).toString() == other_party.toString()){
            other_party = tx_struct.seller;
        }

        let market_account = ACCOUNTS_PROGRAM.GenAccountAddress(payer_wallet.publicKey);

        await PHYSICAL_PROGRAM.PhysicalLeaveReview(
            tx_addr,
            other_party,
            market_account,
            payer_wallet
        )

    }

    const CloseTransactionAccount = async(
        tx_addr,
        payer_wallet,
        voter_id
    ) =>{
        let tx_struct = (await PHYSICAL_PROGRAM.GetPhysicalTransaction(tx_addr)).data.metadata;
        let buyer_tx_log_addr = tx_struct.buyer;
        let buyer_tx_log_struct = await TRANSACTION_PROGRAM.GetBuyerOpenTransactions(buyer_tx_log_addr);
        let tx_log = TRANSACTION_PROGRAM.GenBuyerTransactionLog("physical", voter_id);
        if(TRANSACTION_PROGRAM.GenBuyerTransactionLog("physical", payer_wallet.publicKey).toString() != buyer_tx_log_addr.toString()){
            tx_log = TRANSACTION_PROGRAM.GenSellerTransactionLog("physical", voter_id)
        }

        return PHYSICAL_PROGRAM.PhysicalCloseTransactionAccount(
            tx_addr,
            tx_log,
            buyer_tx_log_struct.data.buyer_wallet,
            payer_wallet
        )
    }

    //////////////////////////////////////////////////////
    /// DISPUTE UTILS


    // todo: populate more
    const OpenDispute = async(
        tx_addr,
        threshold = 3,
        payer_wallet
    ) =>{
        let tx_struct = (await PHYSICAL_PROGRAM.GetPhysicalTransaction(tx_addr)).data.metadata;
        let buyer_tx_log_struct = (await TRANSACTION_PROGRAM.GetBuyerOpenTransactions(tx_struct.buyer)).data;
        let seller_tx_log_struct = (await TRANSACTION_PROGRAM.GetBuyerOpenTransactions(tx_struct.seller)).data;

        let buyer_account = ACCOUNTS_PROGRAM.GenAccountAddress(buyer_tx_log_struct.buyer_wallet)
        let seller_account = ACCOUNTS_PROGRAM.GenAccountAddress(seller_tx_log_struct.seller_wallet);

        let dispute_addr = DISPUTE_PROGRAM.GenDisputeAddress(tx_addr);

        return PHYSICAL_PROGRAM.PhysicalOpenDispute(
            tx_addr,
            threshold,
            
            buyer_account,
            seller_account,
            payer_wallet
        )
    }
    const CloseDisputeSol = async(
        tx_addr
    ) =>{
        let tx_struct = (await PHYSICAL_PROGRAM.GetPhysicalTransaction(tx_addr)).data.metadata;
        let dispute_addr = DISPUTE_PROGRAM.GenDisputeAddress(tx_addr);
        let dispute_struct = (await DISPUTE_PROGRAM.GetDispute(dispute_addr)).data;

        
        let buyer_tx_logs = (await TRANSACTION_PROGRAM.GetBuyerOpenTransactions(tx_struct.buyer)).data;
        let seller_tx_logs= (await TRANSACTION_PROGRAM.GetSellerOpenTransactions(tx_struct.seller)).data;
        let buyer_market_acc_addr = ACCOUNTS_PROGRAM.GenAccountAddress(buyer_tx_logs.buyer_wallet);
        let seller_market_acc_addr = ACCOUNTS_PROGRAM.GenAccountAddress(seller_tx_logs.seller_wallet);

        let buyer_account = (await ACCOUNTS_PROGRAM.GetAccount(buyer_market_acc_addr));
        let seller_account = (await ACCOUNTS_PROGRAM.GetAccount(seller_market_acc_addr));

        let favor = buyer_account;
        if(favor.data.voterId != dispute_struct.favor){
            favor = seller_account;
        }

        return PHYSICAL_PROGRAM.PhysicalCloseDisputeSol(
            tx_addr,
            tx_struct,
            dispute_addr,
            dispute_struct.funder,
            
            favor.data.wallet,
            favor.address,
            
            buyer_tx_logs.buyer_wallet,
            buyer_market_acc_addr,
            
            seller_market_acc_addr
        )
    }
    const CloseDisputeSpl = async(
        tx_addr
    ) =>{

        let tx_struct = (await PHYSICAL_PROGRAM.GetPhysicalTransaction(tx_addr)).data.metadata;
        let dispute_addr = DISPUTE_PROGRAM.GenDisputeAddress(tx_addr);
        let dispute_struct = (await DISPUTE_PROGRAM.GetDispute(dispute_addr)).data;

        
        let buyer_tx_logs = (await TRANSACTION_PROGRAM.GetBuyerOpenTransactions(tx_struct.buyer)).data;
        let seller_tx_logs= (await TRANSACTION_PROGRAM.GetSellerOpenTransactions(tx_struct.seller)).data;
        let buyer_market_acc_addr = ACCOUNTS_PROGRAM.GenAccountAddress(buyer_tx_logs.buyer_wallet);
        let seller_market_acc_addr = ACCOUNTS_PROGRAM.GenAccountAddress(seller_tx_logs.seller_wallet);

        let buyer_account = (await ACCOUNTS_PROGRAM.GetAccount(buyer_market_acc_addr));
        let seller_account = (await ACCOUNTS_PROGRAM.GetAccount(seller_market_acc_addr));

        let favor = buyer_account;
        if(favor.data.voterId != dispute_struct.favor){
            favor = seller_account;
        }

        const TOKEN_PROGRAM_ID = new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA');
        const ASSOCIATED_TOKEN_PROGRAM_ID = new PublicKey('ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL');

        return PHYSICAL_PROGRAM.PhysicalCloseDisputeSpl(
            tx_addr,
            dispute_addr,
            dispute_struct.funder,
            
            PublicKey.findProgramAddressSync(
                [favor.data.wallet.toBuffer(), TOKEN_PROGRAM_ID.toBuffer(), tx_struct.currency.toBuffer()],
                ASSOCIATED_TOKEN_PROGRAM_ID
            )[0],
            favor.address,
            
            PublicKey.findProgramAddressSync(
                [buyer_account.wallet.toBuffer(), TOKEN_PROGRAM_ID.toBuffer(), tx_struct.currency.toBuffer()],
                ASSOCIATED_TOKEN_PROGRAM_ID
            )[0],

            buyer_market_acc_addr,
            
            seller_market_acc_addr
        )
    }
    
    return {
        OpenTransactionSol,
        CloseTransactionSol,
        FundEscrowSol,
        SellerEarlyDeclineSol,
        OpenTransactionSpl,
        CloseTransactionSpl,
        FundEscrowSpl,
        SellerEarlyDeclineSpl,
        LeaveReview,
        CloseTransactionAccount,
        CloseDisputeSol,
        CloseDisputeSpl,
        OpenDispute
    }
}