import * as anchor from "@project-serum/anchor";
import {Token, TOKEN_PROGRAM_ID} from '@solana/spl-token';
import { SystemProgram, PublicKey, Connection, SOLANA_SCHEMA} from "@solana/web3.js";
let physical_idl = require("../idls/physical_marketplace.json");
let accounts_idl = require("../idls/marketplace_accounts.json");

///////////////////////////////////////////////////////////////////////////////////////////////////
// CONSTS
export class PhysicalMarketplaceClient {
	constructor(wallet, connection, provider){
        this.physical_programid = new PublicKey(physical_idl.metadata.address);
        this.accounts_programid = new PublicKey(accounts_idl.metadata.address);

        if(!wallet){
            return
        }
        this.wallet = wallet;
        this.connection = connection;
        this.provider = provider;
        this.PostWalletConsts();

        this.physical_market_program = new anchor.Program(physical_idl, physical_idl.metadata.address, this.provider);
    }

    PostWalletConsts = async()=>{
		const [marketAccountAddress, marketAccountBump] = new PublicKey.findProgramAddress(
			[
				Buffer.from("marketaccount"),
				this.wallet.PublicKey.toBuffer()
			],
			this.accounts_programid
		)

        const [physicalMarketSigner, physicalMarketSignerBump] = new PublicKey.findProgramAddress(
			[
				Buffer.from("marketsigner")
			],
			this.physical_programid
		)

		this.marketAccountAddress = marketAccountAddress;
		this.marketAccountBump = marketAccountBump;

        
        this.physicalMarketSigner = physicalMarketSigner;
        this.physicalMarketSignerBump = physicalMarketSignerBump;
	}

    CreatePhysicalProduct = async(price, description, stock, traceless) =>{
        const product_kp = new anchor.web3.Keypair.generate();
        return await this.physical_market_program.rpc.createProduct(new anchor.BN(price), description, new anchor.BN(stock), traceless,
            {
                accounts:{
                    physicalProduct: product_kp.PublicKey,
                    walletAddress: this.wallet.PublicKey,
                    seller: this.marketAccountAddress,
                    SystemProgram: SystemProgram.programId,
                    marketProgram: this.accounts_programid,
                },
                signers:[product_kp]
            }
        )
    }
    DeletePhysicalProduct = async(product_pk) =>{
        let delkey = new PublicKey(product_pk);
		await this.physical_market_program.rpc.deleteProduct(delkey, {
			accounts:{
                physicalProduct: delkey,
                seller: this.marketAccountAddress,
				walletAddress: this.wallet.PublicKey,
				marketProgram: this.accounts_programid
			}
		})
    }
    UpdateStock = async(product, amt) =>{
        let prod_pk = new PublicKey(product);
        await this.physical_market_program.rpc.replenishStock(new anchor.BN(amt), {
            accounts:{
                walletAddress: this.wallet.PublicKey,
                seller: this.marketAccountAddress,
                product: prod_pk,
            }
        })
    }
    ClaimDispute = async(transaction_key) =>{
        let transaction_pk = new PublicKey(transaction_key);
        let transaction = await this.physical_market_program.account.physicalTransaction.fetch(transaction_pk);
        let providers = transaction.escrow_providers;

        let escrow_accounts = [];
        for(let provider of providers){
            escrow_accounts.push(
               await new PublicKey.findProgramAddress(
                    [
                        Buffer.from("escrowholdingaccount"),
                        provider.toBuffer(),
                        transaction_pk.toBuffer()
                    ],
                    this.physical_programid
                )
            )
        }

        let [holdingAcc, holdingBump] = this.holdingPda(transaction_pk);
        let [disputeAcc, disputebump] = this.disputePda(transaction_pk);

        await this.physical_market_program.rpc.claimDispute(holdingBump, this.physicalMarketSignerBump, {
            accounts:{
                transaction: transaction_pk,
                dispute: disputeAcc,
                holdingAccount: holdingAcc,
                buyerWallet: transaction.buyerWallet,
                sellerWallet: transaction.sellerWallet,
                walletAddress: this.wallet.PublicKey,
                buyer: transaction.buyer,
                seller: transaction.seller,
                physicalMarketplaceSigner: this.physicalMarketSigner,
                accountsProgram: this.accounts_programid,
            }
        })

    }
    ForfeitDispute = async(transaction_key, dispute_key) =>{
        let transaction_pk = new PublicKey(transaction_key);
        let dispute_pk = new PublicKey(dispute_key);
        await this.physical_market_program.rpc.forfeitDispute({
            accounts:{
                transaction: transaction_pk,
                dispute: dispute_pk,
                walletAddress: this.wallet.PublicKey,
            }
        })
    }
    JudgeDispute = async(transaction_key, vote_key) =>{
        let transaction_pk = new PublicKey(transaction_key);
        let transaction = await this.physical_market_program.account.physicalTransaction.fetch(transaction_pk);

        let [dispute_pk, _] = this.disputePda(transaction_pk);
        let vote_pk = new PublicKey(vote_key);
        
        let [holdingAcc, holdingBump] = this.holdingPda(transaction_pk);

        await this.physical_market_program.rpc.judgeDispute(holdingBump, vote_pk, {
            accounts:{
                dispute: dispute_pk,
                buyerWallet: transaction.buyerWallet,
                sellerWallet: transaction.sellerWallet,
                transaction: transaction_pk,
                walletAddress: this.wallet.PublicKey,
                jurorAccount: this.marketAccountAddress,
                holdingAccount: holdingAcc,
            }
        })
    }
    OpenDispute = async(transaction_key) =>{
        let transaction_pk = new PublicKey(transaction_key);

        let [disputeAcc, _] = this.disputePda(transaction_pk);

        await this.physical_market_program.rpc.openDispute({
            accounts:{
                dispute: disputeAcc,
                transaction: transaction_pk,
                walletAddress: this.wallet.PublicKey,
                systemPrgram: SystemProgram.programId
            }
        })
    }
    CancelOrder = async(transaction_key) =>{
        let transaction_pk = new PublicKey(transaction_key);
        let transaction = await this.physical_market_program.account.physicalTransaction.fetch(transaction_pk);

        await this.physical_market_program.rpc.cancelOrder({
            accounts:{
                transaction: transaction_pk,
                authority: this.wallet.PublicKey,
                buyerWallet: transaction.buyerWallet
            }
        })
    }
    ChangeEscrow = async(transaction_key, amt) =>{
        let transaction_pk = new PublicKey(transaction_key);
        await this.physical_market_program.rpc.changeEscrow(amt,{
            accounts:{
                buyerWallet: this.wallet.PublicKey,
                transaction: transaction_pk
            }
        })
    }
    CloseOrder = async(transaction_key) =>{
        let transaction_pk = new PublicKey(transaction_key);
        let transaction = await this.physical_market_program.account.physicalTransaction.fetch(transaction_pk);

        let [holdingAcc, holdingBump] = this.holdingPda(transaction_pk);
        await this.physical_market_program.rpc.closeOrder(holdingBump, this.physicalMarketSigner, {
            accounts:{
                transaction: transaction_pk,
                sellerWallet: transaction.sellerWallet,
                holdingAccount: holdingAcc,
                user: this.wallet.PublicKey,
                buyer: transaction.buyer,
                seller: transaction.seller,
                physicalMarketplaceSigner: this.physicalMarketplaceSigner,
                accountsProgram: this.accounts_programid,
            }
        })
    }
    OpenOrder = async(quantity, seek_escrow, amt, product_key, seller_market_account_key, seller_wallet_key) =>{
        let transaction = anchor.web3.Keypair.generate();

        let seller_market_account_pk = new PublicKey(seller_market_account_key);
        let seller_wallet_pk = new PublicKey(seller_wallet_key);
        let product_pk = new PublicKey(product_key);

        let [holdingAcc, holdingBump] = this.holdingPda(transaction.publicKey);

        await this.physical_market_program.rpc.openOrder(new anchor.BN(quantity), seek_escrow, amt,{
            accounts:{
                transaction: transaction.publicKey,
                seller: seller_market_account_pk,
                sellerWallet: seller_wallet_pk,
                physicalProduct: product_pk,
                buyer: this.marketAccountAddress,
                walletAddress: this.wallet.publicKey,
                holdingAccount: holdingAcc,
                systemPrgram: SystemProgram.programId
            },
            signers:[transaction]
        })
    }
    DepositFundsSol = async(transaction_key) =>{
        let transaction_pk = new PublicKey(transaction_key);

        let [holdingAcc, holdingBump] = this.holdingPda(transaction_pk);

        await this.physical_market_program.rpc.depositFundsSol({
            accounts:{
                holdingAccount: holdingAcc,
                buyerWallet: this.wallet.publicKey,
                transaction: transaction_pk,
            }
        })
    }
    FillEscrow = async(transaction_key) =>{
        let transaction_pk = new PublicKey(transaction_key);
        let [escrowAcc, escrowBump] = this.escrowPda(transaction_pk);

        await this.physical_market_program.rpc.fillEscrow({
            accounts:{
                transaction: transaction_pk,
                fulfillerAccount: this.marketAccountAddress,
                walletAddress: this.wallet.publicKey,
                escrowHoldingAccount: escrowAcc,
                systemProgram: SystemProgram.programId
            }
        })
    }
    MarkAsReceived = async(transaction_key) =>{
        let transaction_pk = new PublicKey(transaction_key);

        await this.physical_market_program.rpc.markAsReceived({
            accounts:{
                transaction: transaction_pk,
                buyerWallet: this.wallet.publicKey,
            }
        });
    }
    CreatePhysicalSigner = async()=>{
        await this.physical_market_program.rpc.createMarketSigner({
            accounts:{
                physicalMarketSigner: this.physicalMarketSigner,
                funder: this.wallet.publicKey,
                systemProgram: SystemProgram.programId,
            }
        })
    }

    // UTILS FUNCTIONS
    holdingPda = async(transaction_pk) => {
        return PublicKey.findProgramAddress(
            [
                Buffer.from("holdingaccount"),
                transaction_pk.toBuffer(),
            ],
            this.physical_programid
        )
    }

    disputePda = async(transaction_pk) => {
        return PublicKey.findProgramAddress(
            [
                Buffer.from("dispute"),
                transaction_pk.toBuffer(),
            ],
            this.physical_programid
        )
    }

    escrowPda = async(transaction_pk) => {
        return PublicKey.findProgramAddress(
            [
                Buffer.from("escrowholdingaccount"),
                this.wallet.publicKey.toBuffer(),
                transaction_pk.toBuffer(),
            ],
            this.physical_programid
        )
    }

    GetProduct = async(product_key) =>{
        return await this.physical_market_program.account.physicalProduct.fetch(new PublicKey(product_key));
    }

    GetTransaction = async(transaction_key) =>{
        return await this.physical_market_program.account.physicalTransaction.fetch(new PublicKey(transaction_key));
    }
}