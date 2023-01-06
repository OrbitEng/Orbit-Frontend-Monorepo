import { useContext, useState, useCallback } from "react";
import PhysicalMarketCtx from "@contexts/PhysicalMarketCtx";
import DigitalMarketCtx from "@contexts/DigitalMarketCtx";
import MarketAccountsCtx from "@contexts/MarketAccountsCtx";
import MatrixClientCtx from "@contexts/MatrixClientCtx";
import TransactionClientCtx from "@contexts/TransactionClientCtx";
import BundlrCtx from "@contexts/BundlrCtx";


import {file_client, file_common, enc_common} from "browser-clients";
import { ArQueryClient } from "data-transfer-clients";
import { PublicKey } from "@solana/web3.js";
import DisputeProgramCtx from "@contexts/DisputeProgramCtx";
import CommissionMarketCtx from "@contexts/CommissionMarketCtx";
import UserAccountCtx from "@contexts/UserAccountCtx";

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

    const {digitalMarketClient} = useContext(DigitalMarketCtx);
    const {marketAccountsClient} = useContext(MarketAccountsCtx);
    const {bundlrClient} = useContext(BundlrCtx);
    const {matrixClient} = useContext(MatrixClientCtx);
    const {transactionClient} = useContext(TransactionClientCtx);
    const {userAccount} = useContext(UserAccountCtx);

    ////////////////////////////////////////////////////////////
    /// TRANSACTIONS

    /// :SOL
    const OpenTransactionSol = async(
        product,
        use_discount
    )=>{
        let product_addr = product.address;
        let listings_addr = product.data.metadata.ownerCatalog;

        let vendor_account = product.data.metadata.seller.data;
        let seller_tx_log_addr = vendor_account.sellerDigitalTransactions;

        let next_open_seller_index = await transactionClient.FindNextOpenSellerTransaction(seller_tx_log_addr);

        let buyer_tx_log_addr = userAccount.data.buyerDigitalTransactions;
        let next_open_buyer_index = await transactionClient.FindNextOpenBuyerTransaction(buyer_tx_log_addr);
        let tx_addr = digitalMarketClient.GenTransactionAddress(vendor_log_address, sellerIndex);
        let buyer_account_addr = userAccount.address;
        await digitalMarketClient.OpenTransactionSol(
            tx_addr,
            next_open_seller_index,
            seller_tx_log_addr,
            listings_addr,
            next_open_buyer_index,
            buyer_tx_log_addr,
            buyer_account_addr,
            product_addr,
            product.price,
            use_discount
        );

        await OpenChat(vendor_account.address.toString(), tx_addr)
    }

    const CloseTransactionSol = async(
        tx_addr
    )=>{

        let tx_struct = (await digitalMarketClient.GetTransaction(tx_addr)).data.metadata;
        let seller_tx_log_struct = await transactionClient.GetSellerOpenTransactions(tx_struct.seller);
        let seller_wallet = seller_tx_log_struct.sellerWallet;
        let seller_market_account_addr = marketAccountsClient.GenAccountAddress(seller_wallet);
        let buyer_tx_log_struct = await transactionClient.GetBuyerOpenTransactions(tx_struct.buyer);
        let buyer_market_account_addr = marketAccountsClient.GenAccountAddress(buyer_wallet);
        let buyer_wallet = buyer_tx_log_struct.buyer_wallet;

        let buyer_acc_struct = await marketAccountsClient.GetAccount(buyer_market_account_addr);
        let reflink_chain;
        if(buyer_acc_struct.used_reflink){
            reflink_chain = marketAccountsClient.ReflinkSolChain(buyer_acc_struct.used_reflink);
        };


        return digitalMarketClient.CloseTransactionSol(
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
        tx_addr
    )=>{
        return digitalMarketClient.FundEscrowSol(tx_addr)

    }

    const SellerEarlyDeclineSol = async(
        tx_addr
    )=>{
        let tx_struct = (await digitalMarketClient.GetTransaction(tx_addr)).data.metadata;
        let buyer_tx_log = (await transactionClient.GetBuyerOpenTransactions(tx_struct.buyer)).data;
        let buyer_wallet = buyer_tx_log.buyer_wallet;
        let buyer_account = marketAccountsClient.GenAccountAddress(buyer_wallet);
        return digitalMarketClient.SellerEarlyDeclineSol(
            tx_addr,
            buyer_wallet,
            buyer_account
        )

    }

    /// :SPL
    const OpenTransactionSpl = async(
        product,
        use_discount,
        currency
    )=>{
        let product_addr = product.address;
        let listings_addr = product.data.metadata.ownerCatalog;

        let vendor_account = product.data.metadata.seller.data;;
        let seller_tx_log_addr = vendor_account.sellerDigitalTransactions;

        let next_open_seller_index = await transactionClient.FindNextOpenSellerTransaction(seller_tx_log_addr);

        let buyer_tx_log_addr = userAccount.data.buyerDigitalTransactions;
        let next_open_buyer_index = await transactionClient.FindNextOpenBuyerTransaction(buyer_tx_log_addr);
        let tx_addr = digitalMarketClient.GenTransactionAddress(vendor_log_address, sellerIndex);
        let buyer_account_addr = userAccount.address;

        await digitalMarketClient.OpenTransactionSpl(
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
            use_discount
        );
        await OpenChat(vendor_account.address.toString(), tx_addr);

    }

    const CloseTransactionSpl = async(
        tx_addr
    )=>{
        let tx_struct = (await digitalMarketClient.GetTransaction(tx_addr)).data.metadata;
        let seller_tx_log_struct = (await transactionClient.GetSellerOpenTransactions(tx_struct.seller)).data;
        let seller_wallet = seller_tx_log_struct.sellerWallet;
        let buyer_tx_log_struct = (await transactionClient.GetBuyerOpenTransactions(tx_struct.buyer)).data;
        let buyer_market_account_addr = marketAccountsClient.GenAccountAddress(buyer_wallet);
        let buyer_wallet = buyer_tx_log_struct.buyer_wallet;

        let buyer_acc_struct = (await marketAccountsClient.GetAccount(buyer_market_account_addr)).data;
        let reflink_chain;
        if(buyer_acc_struct.used_reflink){
            reflink_chain = marketAccountsClient.ReflinkSplChain(buyer_acc_struct.used_reflink, tx_struct.metadata.currency);
        };
        return digitalMarketClient.CloseTransactionSpl(
            tx_addr,

            buyer_wallet,
            seller_wallet,

            reflink_chain
        )

    }

    const FundEscrowSpl = async(
        tx_addr
    )=>{
        return digitalMarketClient.FundEscrowSpl(tx_addr)

    }

    const SellerEarlyDeclineSpl = async(
        tx_addr
    )=>{
        let tx_struct = (await digitalMarketClient.GetTransaction(tx_addr)).data.metadata;
        let buyer_tx_log = (await transactionClient.GetBuyerOpenTransactions(tx_struct.buyer)).data;
        let buyer_wallet = buyer_tx_log.buyer_wallet;
        let buyer_account = marketAccountsClient.GenAccountAddress(buyer_wallet);

        return digitalMarketClient.SellerEarlyDeclineSpl(
            tx_addr,

            buyer_wallet,
            buyer_account
        )

    }


    //////////////////////////////////////////////////////
    /// SELLER UTILS

    const UpdateStatusToShipping = async(tx_addr)=>{

        await digitalMarketClient.UpdateStatusToShipping(
            tx_addr,
            market_acc,
            market_auth
        );
    }

    // CommitInitKeys, CommitLink bundled together
    const UploadProductFile = async(tx_addr, datafile, xslices, yslices) =>{

        let [ar_addr, kps] = await bundlrClient.UploadFinalBufferInstruction(datafile, xslices, yslices);

        await digitalMarketClient.CommitInitKeys(
            kps.map(k => k.publicKey),
            tx_addr,
            market_acc,
            market_auth
        );

        await digitalMarketClient.CommitLink(
            ar_addr,
            tx_addr,
            market_acc,
            market_auth
        );
    }

    const CommitSubkeys = async (tx_addr, indexes)=>{

        let link = await digitalMarketClient.GetLink(tx_addr);
        let kps = bundlrClient.GetTransactionsKp(link);
        let kp_dict = {};
        
        indexes.forEach((ind)=>{
            kp_dict[ind] = kps[ind]
        });
        await digitalMarketClient.CommitSubkeys(
            kp_dict,
            tx_addr,
            market_acc,
            market_auth
        );
    };

    const SellerAcceptTransaction = async(
        tx_addr
    ) =>{
        return digitalMarketClient.SellerAcceptTransaction(tx_addr)
    }

    ////////////////////////////////////////////////////
    /// BOTH PARTIES GENERAL UTILS
    const LeaveReview = async(
        tx_addr
    ) =>{
        let tx_struct = (await digitalMarketClient.GetTransaction(tx_addr)).data.metadata;
        let other_party = (await transactionClient.GetBuyerOpenTransactions(tx_struct.buyer)).data.buyer_wallet;

        if(transactionClient.GenBuyerTransactionLog("digital").toString() == other_party.toString()){
            other_party = tx_struct.seller;
        }

        let market_account = marketAccountsClient.GenAccountAddress();

        await digitalMarketClient.LeaveReview(
            tx_addr,
            other_party,
            market_account
        )

    }

    const CloseTransactionAccount = async(
        tx_addr
    ) =>{
        let tx_struct = (await digitalMarketClient.GetTransaction(tx_addr)).data.metadata;
        let buyer_tx_log_addr = tx_struct.buyer;
        let buyer_tx_log_struct = await transactionClient.GetBuyerOpenTransactions(buyer_tx_log_addr);
        let tx_log = transactionClient.GenBuyerTransactionLog("digital");
        if(transactionClient.GenBuyerTransactionLog("digital").toString() != buyer_tx_log_addr.toString()){
            tx_log = transactionClient.GenSellerTransactionLog("digital")
        }

        return digitalMarketClient.CloseTransactionAccount(
            tx_addr,
            tx_log,
            buyer_tx_log_struct.data.buyer_wallet
        )
    }

    ///////////////////////////////////////////////////////////////
    /// BUYER UTILS

    const ConfirmDelivered = async(
        tx_addr
    ) => {
        return digitalMarketClient.ConfirmDelivered(tx_addr)
    };

    const ConfirmAccept = async(
        tx_addr
    ) => {
        return digitalMarketClient.ConfirmAccept(tx_addr)
    };

    const DenyAccept = async(
        tx_addr
    ) => {
        let tx_struct = (await digitalMarketClient.GetTransaction(tx_addr)).data.metadata;
        let buyer_tx_log_struct = (await transactionClient.GetBuyerOpenTransactions(tx_struct.buyer)).data;
        let buyer_account = marketAccountsClient.GenAccountAddress(buyer_tx_log_struct.buyer_wallet);
        
        return digitalMarketClient.DenyAccept(
            tx_addr,
            buyer_account
        )
    };

    /// CHAT ONLY
    
    const ChooseBlocks = async(blocks, roomid) =>{
        await matrixClient.SendNotice(roomid, "chosenblocks:" + blocks.join(","))
    }

    const DecryptImage = async(tx_addr) =>{

        let raw_blocks = await (new ArQueryClient()).FetchData( (await digitalMarketClient.GetTransaction(tx_addr)).metadata.dataAddress ).split(">UwU<");

        return file_client.AssembleImage(
            raw_blocks[0],
            raw_blocks[1],
            raw_blocks[2],
            raw_blocks[3],
            await enc_common.DecryptStrings(await digitalMarketClient.GetCommittedKeys(), raw_blocks.slice(4))
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

    const {commissionMarketClient} = useContext(CommissionMarketCtx);
    const {marketAccountsClient} = useContext(MarketAccountsCtx);
    const {transactionClient} = useContext(TransactionClientCtx);
    const {userAccount} = useContext(UserAccountCtx);
    const {matrixClient} = useContext(MatrixClientCtx);
    const {bundlrClient} = useContext(BundlrCtx);

    ////////////////////////////////////////
    /// TRANSACTIONS

    /// :SOL
    const OpenTransactionSol = async(
        product,
        use_discount
    )=>{
        let product_addr = product.address;
        let listings_addr = product.data.metadata.ownerCatalog;

        let vendor_account = product.data.metadata.seller.data;
        let seller_tx_log_addr = vendor_account.sellerCommissionTransactions;

        let next_open_seller_index = await transactionClient.FindNextOpenSellerTransaction(seller_tx_log_addr);

        let buyer_tx_log_addr = userAccount.data.buyerCommissionTransactions;
        let next_open_buyer_index = await transactionClient.FindNextOpenBuyerTransaction(buyer_tx_log_addr);
        let tx_addr = commissionMarketClientGenTransactionAddress(vendor_log_address, sellerIndex);

        let buyer_account_addr = userAccount.address;
        await commissionMarketClient.OpenTransactionSol(
            tx_addr,
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

        await OpenChat(vendor_account.address.toString(), tx_addr);
    }

    const CloseTransactionSol = async(
        tx_addr
    )=>{

        let tx_struct = (await commissionMarketClient.GetTransaction(tx_addr)).data.metadata;
        let seller_tx_log_struct = await transactionClient.GetSellerOpenTransactions(tx_struct.seller);
        let seller_wallet = seller_tx_log_struct.sellerWallet;
        let seller_market_account_addr = marketAccountsClient.GenAccountAddress(seller_wallet);
        let buyer_tx_log_struct = await transactionClient.GetBuyerOpenTransactions(tx_struct.buyer);
        let buyer_market_account_addr = marketAccountsClient.GenAccountAddress(buyer_wallet);
        let buyer_wallet = buyer_tx_log_struct.buyer_wallet;

        let buyer_acc_struct = await marketAccountsClient.GetAccount(buyer_market_account_addr);
        let reflink_chain;
        if(buyer_acc_struct.used_reflink){
            reflink_chain = marketAccountsClient.ReflinkSolChain(buyer_acc_struct.used_reflink);
        };


        return commissionMarketClient.CloseTransactionSol(
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
        tx_addr
    )=>{
        return commissionMarketClient.FundEscrowSol(tx_addr)

    }

    const SellerEarlyDeclineSol = async(
        tx_addr
    )=>{
        let tx_struct = (await commissionMarketClient.GetTransaction(tx_addr)).data.metadata;
        let buyer_tx_log = (await transactionClient.GetBuyerOpenTransactions(tx_struct.buyer)).data;
        let buyer_wallet = buyer_tx_log.buyer_wallet;
        let buyer_account = marketAccountsClient.GenAccountAddress(buyer_wallet);
        return commissionMarketClient.SellerEarlyDeclineSol(
            tx_addr,
            buyer_wallet,
            buyer_account
        )

    }

    /// :SPL
    const OpenTransactionSpl = async(
        product,
        use_discount,
        currency
    )=>{
        let product_addr = product.address;
        let listings_addr = product.data.metadata.ownerCatalog;

        let vendor_account = product.data.metadata.seller.data;
        let seller_tx_log_addr = vendor_account.sellerCommissionTransactions;

        let next_open_seller_index = await transactionClient.FindNextOpenSellerTransaction(seller_tx_log_addr);

        let buyer_tx_log_addr = userAccount.data.buyerCommissionTransactions;
        let next_open_buyer_index = await transactionClient.FindNextOpenBuyerTransaction(buyer_tx_log_addr);

        let tx_addr = commissionMarketClientGenTransactionAddress(vendor_log_address, sellerIndex);
        let buyer_account_addr = userAccount.address;

        await commissionMarketClient.OpenTransactionSpl(
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
            
            use_discount
        )

        await OpenChat(vendor_account.address.toString(), tx_addr);
    }

    const CloseTransactionSpl = async(
        tx_addr
    )=>{
        let tx_struct = (await commissionMarketClient.GetTransaction(tx_addr)).data.metadata;
        let seller_tx_log_struct = (await transactionClient.GetSellerOpenTransactions(tx_struct.seller)).data;
        let seller_wallet = seller_tx_log_struct.sellerWallet;
        let buyer_tx_log_struct = (await transactionClient.GetBuyerOpenTransactions(tx_struct.buyer)).data;
        let buyer_market_account_addr = marketAccountsClient.GenAccountAddress(buyer_wallet);
        let buyer_wallet = buyer_tx_log_struct.buyer_wallet;

        let buyer_acc_struct = (await marketAccountsClient.GetAccount(buyer_market_account_addr)).data;
        let reflink_chain;
        if(buyer_acc_struct.used_reflink){
            reflink_chain = marketAccountsClient.ReflinkSplChain(buyer_acc_struct.used_reflink, tx_struct.metadata.currency);
        };
        return commissionMarketClient.CloseTransactionSpl(
            tx_addr,

            buyer_wallet,
            seller_wallet,

            reflink_chain
        )

    }

    const FundEscrowSpl = async(
        tx_addr
    )=>{
        return commissionMarketClient.FundEscrowSpl(tx_addr)

    }

    const SellerEarlyDeclineSpl = async(
        tx_addr
    )=>{
        let tx_struct = (await commissionMarketClient.GetTransaction(tx_addr)).data.metadata;
        let buyer_tx_log = (await transactionClient.GetBuyerOpenTransactions(tx_struct.buyer)).data;
        let buyer_wallet = buyer_tx_log.buyer_wallet;
        let buyer_account = marketAccountsClient.GenAccountAddress(buyer_wallet);

        return commissionMarketClient.SellerEarlyDeclineSpl(
            tx_addr,

            buyer_wallet,
            buyer_account
        )

    }


    ////////////////////////////////////////
    /// BUYER UTILS

    const ConfirmDelivered = async(
        tx_addr
    ) => {
        return commissionMarketClient.ConfirmDelivered(tx_addr)
    };

    const ConfirmAccept = async(
        tx_addr
    ) => {
        return commissionMarketClient.ConfirmAccept(tx_addr)
    };
    const DenyAccept = async(
        tx_addr
    ) => {
        let tx_struct = (await commissionMarketClient.GetTransaction(tx_addr)).data.metadata;
        let buyer_tx_log_struct = (await transactionClient.GetBuyerOpenTransactions(tx_struct.buyer)).data;
        let buyer_account = marketAccountsClient.GenAccountAddress(buyer_tx_log_struct.buyer_wallet);
        
        return commissionMarketClient.DenyAccept(
            tx_addr,
            buyer_account
        )
    }

    ////////////////////////////////////////
    /// SELLER COMMITS

    // commit keys and commit link together
    const UploadProductFile = async(tx_addr, datafile, xslices, yslices) =>{
        let [ar_addr, kps] = await bundlrClient.UploadFinalBufferInstruction(datafile, xslices, yslices);

        await commissionMarketClient.CommitInitKeys(
            kps.map(k => k.publicKey),
            tx_addr,
            market_acc,
            market_auth
        )

        await commissionMarketClient.CommitLink(
            ar_addr,
            tx_addr,
            market_acc,
            market_auth
        );
    }

    const UpdateStatusToShipping = async(tx_addr)=>{

        await commissionMarketClient.UpdateStatusToShipping(
            tx_addr,
            market_acc,
            market_auth
        );
    }

    const CommitSubkeys = async (tx_addr, indexes)=>{

        let link = await commissionMarketClient.GetLink(tx_addr);
        let kps = bundlrClient.GetTransactionsKp(link);
        let kp_dict = {};
        
        indexes.forEach((ind)=>{
            kp_dict[ind] = kps[ind]
        });
        await commissionMarketClient.CommitSubkeys(
            kp_dict,
            tx_addr,
            market_acc,
            market_auth
        );
    };

    
    /////////////////////////////////
    /// SELLER UTILS
    
    const SellerAcceptTransaction = async(
        tx_addr
    ) =>{
        return commissionMarketClient.SellerAcceptTransaction(tx_addr)
    }

    ////////////////////////////////////////////////////
    /// POST TX

    const LeaveReview = async(
        tx_addr
    ) =>{
        let tx_struct = (await commissionMarketClient.GetTransaction(tx_addr)).data.metadata;
        let other_party = (await commissionMarketClient.GetBuyerOpenTransactions(tx_struct.buyer)).data.buyer_wallet;

        if(transactionClient.GenBuyerTransactionLog("commission").toString() == other_party.toString()){
            other_party = tx_struct.seller;
        }

        let market_account = marketAccountsClient.GenAccountAddress();

        await commissionMarketClient.LeaveReview(
            tx_addr,
            other_party,
            market_account
        )

    }

    const CloseTransactionAccount = async(
        tx_addr
    ) =>{
        let tx_struct = (await commissionMarketClient.GetTransaction(tx_addr)).data.metadata;
        let buyer_tx_log_addr = tx_struct.buyer;
        let buyer_tx_log_struct = await transactionClient.GetBuyerOpenTransactions(buyer_tx_log_addr);
        let tx_log = transactionClient.GenBuyerTransactionLog("commission");
        if(tx_log.toString() != buyer_tx_log_addr.toString()){
            tx_log = transactionClient.GenSellerTransactionLog("commission")
        }

        return commissionMarketClient.CloseTransactionAccount(
            tx_addr,
            tx_log,
            buyer_tx_log_struct.data.buyer_wallet
        )
    }

    /////////////////////////////////////////////////
    /// COMISSION SPECIFIC

    const CommitPreview = async(
        tx_addr,
        preview_file_dataurl
    ) =>{

        if(preview_file_dataurl.join){
            preview_file_dataurl = preview_file_dataurl.join(">UwU<")
        }
        let ar_addr = await bundlrClient.UploadBufferInstruction(preview_file_dataurl);

        await commissionMarketClient.CommitPreview(
            tx_addr,
            ar_addr
        );
    }

    const ProposeRate = async(
        tx_addr,
        new_rate
    ) =>{
        let tx_struct = (await commissionMarketClient.GetTransaction(tx_addr)).data;
        let tx_log_addr = transactionClient.GenBuyerTransactionLog("commission");
        if(tx_log_addr.toString() != tx_struct.buyer){
            tx_log_addr = tx_struct.seller;
        }
        return commissionMarketClient.ProposeRate(
            tx_addr,
            tx_log_addr,
            new_rate
        )
    }
    const AcceptRate = async(
        tx_addr
    ) =>{
        let tx_struct = (await commissionMarketClient.GetTransaction(tx_addr)).data;
        let tx_log_addr = transactionClient.GenBuyerTransactionLog("commission");
        if(tx_log_addr.toString() != tx_struct.buyer){
            tx_log_addr = tx_struct.seller;
        }
        return commissionMarketClient.AcceptRate(
            tx_addr,
            tx_log_addr
        )
    }

    //////////////////////////////////////////////
    /// CHAT ONLY
    
    const ChooseBlocks = async(blocks, roomid) =>{
        await matrixClient.SendNotice(roomid, "chosenblocks:" + blocks.join(","))
    }

    const DecryptImage = async(tx_addr) =>{

        let raw_blocks = await (new ArQueryClient()).FetchData( (await commissionMarketClient.GetTransaction(tx_addr)).metadata.dataAddress ).split(">UwU<");

        return file_client.AssembleImage(
            raw_blocks[0],
            raw_blocks[1],
            raw_blocks[2],
            raw_blocks[3],
            await enc_common.DecryptStrings(await commissionMarketClient.GetCommittedKeys(), raw_blocks.slice(4))
        )
    }

    /// :COMMISSION SPECIFIC

    /**
     * 
     * @param {*} tx_addr 
     * @returns {Blob} for now. add proper decoding later
     */
    const SeePreview = async(tx_addr) =>{
        let ar_addr = (await commissionMarketClient.GetTransaction(tx_addr)).data.previewAddress;

        return (new ArQueryClient()).GetImageData(ar_addr);
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

    const {physicalMarketClient} = useContext(PhysicalMarketCtx);
    const {marketAccountsClient} = useContext(MarketAccountsCtx);
    const {disputeProgramClient} = useContext(DisputeProgramCtx);
    const {transactionClient} = useContext(TransactionClientCtx);
    const {userAccount} = useContext(UserAccountCtx);

    ////////////////////////////////////////
    /// TRANSACTIONS

    /// :SOL
    const OpenTransactionSol = async(
        product,
        use_discount
    )=>{
        let product_addr = product.address;
        let listings_addr = product.data.metadata.ownerCatalog;

        let vendor_account = product.data.metadata.seller.data;
        let seller_tx_log_addr = vendor_account.sellerPhysicalTransactions;

        let next_open_seller_index = await transactionClient.FindNextOpenSellerTransaction(seller_tx_log_addr);

        let buyer_tx_log_addr = userAccount.data.buyerPhysicalTransactions;
        let next_open_buyer_index = await transactionClient.FindNextOpenBuyerTransaction(buyer_tx_log_addr);
        let tx_addr = physicalMarketClient.GenTransactionAddress(vendor_log_address, sellerIndex);

        let buyer_account_addr = userAccount.address;

        await  physicalMarketClient.OpenTransactionSol(
            tx_addr,
            next_open_seller_index,
            seller_tx_log_addr,
            listings_addr,

            next_open_buyer_index,
            userAccount.data.buyerPhysicalTransactions,
            buyer_account_addr,

            product_addr,
            product.price,
            
            use_discount
        );

        await OpenChat(vendor_account.address.toString(), tx_addr);
    }

    const CloseTransactionSol = async(
        tx_addr
    )=>{

        let tx_struct = (await physicalMarketClient.GetTransaction(tx_addr)).data.metadata;
        let seller_tx_log_struct = await transactionClient.GetSellerOpenTransactions(tx_struct.seller);
        let seller_wallet = seller_tx_log_struct.sellerWallet;
        let seller_market_account_addr = marketAccountsClient.GenAccountAddress(seller_wallet);
        let buyer_tx_log_struct = await transactionClient.GetBuyerOpenTransactions(tx_struct.buyer);
        let buyer_market_account_addr = marketAccountsClient.GenAccountAddress(buyer_wallet);
        let buyer_wallet = buyer_tx_log_struct.buyer_wallet;

        let buyer_acc_struct = await marketAccountsClient.GetAccount(buyer_market_account_addr);
        let reflink_chain;
        if(buyer_acc_struct.used_reflink){
            reflink_chain = marketAccountsClient.ReflinkSolChain(buyer_acc_struct.used_reflink);
        };


        return physicalMarketClient.CloseTransactionSol(
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
        tx_addr
    )=>{
        return physicalMarketClient.FundEscrowSol(tx_addr)

    }

    const SellerEarlyDeclineSol = async(
        tx_addr
    )=>{
        let tx_struct = (await physicalMarketClient.GetTransaction(tx_addr)).data.metadata;
        let buyer_tx_log = (await transactionClient.GetBuyerOpenTransactions(tx_struct.buyer)).data;
        let buyer_wallet = buyer_tx_log.buyer_wallet;
        let buyer_account = marketAccountsClient.GenAccountAddress(buyer_wallet);
        return physicalMarketClient.SellerEarlyDeclineSol(
            tx_addr,
            buyer_wallet,
            buyer_account
        )

    }

    /// :SPL
    const OpenTransactionSpl = async(
        product,
        use_discount,
        currency
    )=>{
        let product_addr = product.address;
        let listings_addr = product.data.metadata.ownerCatalog;

        let vendor_account = product.data.metadata.seller.data;
        let seller_tx_log_addr = vendor_account.sellerPhysicalTransactions;

        let next_open_seller_index = await transactionClient.FindNextOpenSellerTransaction(seller_tx_log_addr);

        let buyer_tx_log_addr = transactionClient.GenBuyerTransactionLog("physical");
        let next_open_buyer_index = await transactionClient.FindNextOpenBuyerTransaction(buyer_tx_log_addr);
        let tx_addr = physicalMarketClient.GenTransactionAddress(vendor_log_address, sellerIndex);
        let buyer_account_addr = marketAccountsClient.GenAccountAddress();

        await physicalMarketClient.OpenTransactionSpl(
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
            
            use_discount
        );

        await OpenChat(vendor_account.address.toString(), tx_addr);

    }

    const CloseTransactionSpl = async(
        tx_addr
    )=>{
        let tx_struct = (await physicalMarketClient.GetTransaction(tx_addr)).data.metadata;
        let seller_tx_log_struct = (await transactionClient.GetSellerOpenTransactions(tx_struct.seller)).data;
        let seller_wallet = seller_tx_log_struct.sellerWallet;
        let buyer_tx_log_struct = (await transactionClient.GetBuyerOpenTransactions(tx_struct.buyer)).data;
        let buyer_market_account_addr = marketAccountsClient.GenAccountAddress(buyer_wallet);
        let buyer_wallet = buyer_tx_log_struct.buyer_wallet;

        let buyer_acc_struct = (await marketAccountsClient.GetAccount(buyer_market_account_addr)).data;
        let reflink_chain;
        if(buyer_acc_struct.used_reflink){
            reflink_chain = marketAccountsClient.ReflinkSplChain(buyer_acc_struct.used_reflink, tx_struct.metadata.currency);
        };
        return physicalMarketClient.CloseTransactionSpl(
            tx_addr,

            buyer_wallet,
            seller_wallet,

            reflink_chain
        )

    }

    const FundEscrowSpl = async(
        tx_addr
    )=>{
        return physicalMarketClient.FundEscrowSpl(tx_addr)

    }

    const SellerEarlyDeclineSpl = async(
        tx_addr
    )=>{
        let tx_struct = (await physicalMarketClient.GetTransaction(tx_addr)).data.metadata;
        let buyer_tx_log = (await transactionClient.GetBuyerOpenTransactions(tx_struct.buyer)).data;
        let buyer_wallet = buyer_tx_log.buyer_wallet;
        let buyer_account = marketAccountsClient.GenAccountAddress(buyer_wallet);

        return physicalMarketClient.SellerEarlyDeclineSpl(
            tx_addr,

            buyer_wallet,
            buyer_account
        )

    }


    ////////////////////////////////////////////////////
    /// BOTH PARTIES GENERAL UTILS
    const LeaveReview = async(
        tx_addr
    ) =>{
        let tx_struct = (await physicalMarketClient.GetTransaction(tx_addr)).data.metadata;
        let other_party = (await transactionClient.GetBuyerOpenTransactions(tx_struct.buyer)).data.buyer_wallet;

        if(transactionClient.GenBuyerTransactionLog("digital").toString() == other_party.toString()){
            other_party = tx_struct.seller;
        }

        let market_account = marketAccountsClient.GenAccountAddress();

        await physicalMarketClient.LeaveReview(
            tx_addr,
            other_party,
            market_account
        )

    }

    const CloseTransactionAccount = async(
        tx_addr
    ) =>{
        let tx_struct = (await physicalMarketClient.GetTransaction(tx_addr)).data.metadata;
        let buyer_tx_log_addr = tx_struct.buyer;
        let buyer_tx_log_struct = await transactionClient.GetBuyerOpenTransactions(buyer_tx_log_addr);
        let tx_log = transactionClient.GenBuyerTransactionLog("physical");
        if(transactionClient.GenBuyerTransactionLog("physical").toString() != buyer_tx_log_addr.toString()){
            tx_log = transactionClient.GenSellerTransactionLog("physical")
        }

        return physicalMarketClient.CloseTransactionAccount(
            tx_addr,
            tx_log,
            buyer_tx_log_struct.data.buyer_wallet
        )
    }

    //////////////////////////////////////////////////////
    /// DISPUTE UTILS

    const OpenDispute = async(
        tx_addr,
        threshold = 3
    ) =>{
        let tx_struct = (await physicalMarketClient.GetTransaction(tx_addr)).data.metadata;
        let buyer_tx_log_struct = (await transactionClient.GetBuyerOpenTransactions(tx_struct.buyer)).data;
        let seller_tx_log_struct = (await transactionClient.GetBuyerOpenTransactions(tx_struct.seller)).data;

        let buyer_account = marketAccountsClient.GenAccountAddress(buyer_tx_log_struct.buyer_wallet)
        let seller_account = marketAccountsClient.GenAccountAddress(seller_tx_log_struct.seller_wallet)

        return physicalMarketClient.OpenDispute(
            tx_addr,
            threshold,
            
            buyer_account,
            seller_account
        )
    }
    const CloseDisputeSol = async(
        tx_addr
    ) =>{
        let tx_struct = (await physicalMarketClient.GetTransaction(tx_addr)).data.metadata;
        let dispute_addr = disputeProgramClient.GenDisputeAddress(tx_addr);
        let dispute_struct = (await disputeProgramClient.GetDispute(dispute_addr)).data;

        
        let buyer_tx_logs = (await transactionClient.GetBuyerOpenTransactions(tx_struct.buyer)).data;
        let seller_tx_logs= (await transactionClient.GetSellerOpenTransactions(tx_struct.seller)).data;
        let buyer_market_acc_addr = marketAccountsClient.GenAccountAddress(buyer_tx_logs.buyer_wallet);
        let seller_market_acc_addr = marketAccountsClient.GenAccountAddress(seller_tx_logs.seller_wallet);

        let buyer_account = (await marketAccountsClient.GetAccount(buyer_market_acc_addr));
        let seller_account = (await marketAccountsClient.GetAccount(seller_market_acc_addr));

        let favor = buyer_account;
        if(favor.data.voterId != dispute_struct.favor){
            favor = seller_account;
        }

        return physicalMarketClient.CloseDisputeSol(
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

        let tx_struct = (await physicalMarketClient.GetTransaction(tx_addr)).data.metadata;
        let dispute_addr = disputeProgramClient.GenDisputeAddress(tx_addr);
        let dispute_struct = (await disputeProgramClient.GetDispute(dispute_addr)).data;

        
        let buyer_tx_logs = (await transactionClient.GetBuyerOpenTransactions(tx_struct.buyer)).data;
        let seller_tx_logs= (await transactionClient.GetSellerOpenTransactions(tx_struct.seller)).data;
        let buyer_market_acc_addr = marketAccountsClient.GenAccountAddress(buyer_tx_logs.buyer_wallet);
        let seller_market_acc_addr = marketAccountsClient.GenAccountAddress(seller_tx_logs.seller_wallet);

        let buyer_account = (await marketAccountsClient.GetAccount(buyer_market_acc_addr));
        let seller_account = (await marketAccountsClient.GetAccount(seller_market_acc_addr));

        let favor = buyer_account;
        if(favor.data.voterId != dispute_struct.favor){
            favor = seller_account;
        }

        const TOKEN_PROGRAM_ID = new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA');
        const ASSOCIATED_TOKEN_PROGRAM_ID = new PublicKey('ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL');

        return physicalMarketClient.CloseDisputeSpl(
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