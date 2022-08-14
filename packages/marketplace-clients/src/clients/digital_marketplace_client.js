import * as anchor from "@project-serum/anchor";
import { SystemProgram, PublicKey, Connection} from "@solana/web3.js";
let digital_idl = require("../idls/digital_marketplace.json");

///////////////////////////////////////////////////////////////////////////////////////////////////
// CONSTS
export class DigitalMarketplaceClient {
	constructor(wallet, connection, provider){
        this.digital_programid = new PublicKey(digital_idl.metadata.address);
        this.accounts_programid = new PublicKey(accounts_idl.metadata.address);
        
        if(!wallet){
            return
        }
        this.wallet = wallet;
        this.connection = connection;
        this.provider = provider;
        this.PostWalletConsts();

        this.digital_market_program = new anchor.Program(digital_idl, digital_idl.metadata.address, this.provider);   
    }

    PostWalletConsts = async()=>{
		const [marketAccountAddress, marketAccountBump] = new PublicKey.findProgramAddress(
			[
				Buffer.from("marketaccount"),
				this.wallet.PublicKey.toBuffer()
			],
			this.accounts_programid
		);

        const [digitalMarketSigner, digitalMarketSignerBump] = new PublicKey.findProgramAddress(
			[
				Buffer.from("marketsigner")
			],
			this.digital_programid
		)

		this.marketAccountAddress = marketAccountAddress;
		this.marketAccountBump = marketAccountBump;

        this.digitalMarketSigner = digitalMarketSigner;
        this.digitalMarketSignerBump = digitalMarketSignerBump;
	}

    BuyerCancelOrder = async(transaction_key) =>{
        let transaction_pk = new PublicKey(transaction_key);
        let [holdingAcc, holdingBump] = this.holdingPda(transaction_pk);
        await this.digital_market_program.rpc.buyerCancelOrder(holdingBump, {
            accounts:{
                transaction: transaction_pk,
                holdingAccount: holdingAcc,
                buyer: this.marketAccountAddress,
                walletAddress: this.wallet.publicKey
            }
        })
    }

    BuyerCloseOrder = async(transaction_key) =>{
        let transaction_pk = new PublicKey(transaction_key);
        let transaction = await this.digital_market_program.account.digitalTransaction.fetch(transaction_pk);

        let [holdingAcc, holdingBump] = this.holdingPda(transaction_pk);

        await this.digital_market_program.rpc.buyerCloseOrder(holdingBump, this.digitalMarketSignerBump, {
            accounts:{
                transaction: transaction_pk,
                seller: this.marketAccountAddress,
                sellerWallet: transaction.sellerWallet,
                holdingAccount: holdingAcc,
                buyer: transaction.buyer,
                walletAddress: this.wallet.PublicKey,
                digitalMarketSigner: this.digitalMarketSigner,
                accountsProgram: this.accounts_programid,
            }
        })
    }

    CommitPrivkeys = async(transaction_key)=>{
        let transaction_pk = new PublicKey(transaction_key);
        await this.digital_market_program.rpc.commitPrivkeys({
            accounts:{
                transaction: transaction_pk,
                seller: this.marketAccountAddress,
                walletAddress: this.wallet.publicKey,
            }
        })
    }
    CreateOrder = async(product_key, traceless, seller_wallet) =>{
        let transaction_kp = anchor.web3.Keypair.generate();
        let [holdingAcc, holdingBump] = this.holdingPda(transaction_kp);

        let product_pk = new PublicKey(product_key);

        let product = this.digital_market_program.account.digitalProduct(product_pk);

        await this.digital_market_program.rpc.createOrder(traceless, {
            accounts:{
                transaction: transaction_kp,
                holdingAccount: holdingAcc,
                buyer: this.marketAccountAddress,
                walletAddress: this.wallet.PublicKey,
                product: product_pk,
                seller: product.seller,
                sellerWallet: new PublicKey(seller_wallet),
                systemProgram: SystemProgram.programId,
            },
            signers:[transaction_kp]
        })

    }
    FundOrder = async(transaction_key) =>{
        let transaction_pk = new PublicKey(transaction_key);

        let [holdingAcc, holdingBump] = this.holdingPda(transaction_pk);
        await this.digital_market_program.rpc.fundOrder({
            accounts:{
                transaction: transaction_pk,
                holdingAccount: holdingAcc,
                walletAddress: this.wallet.PublicKey,
            }
        })
    }
    CreateProduct = async() =>{
        let product_kp = anchor.web3.Keypair.generate();

        await this.digital_market_program.rpc.createProduct({
            accounts:{
                digitalProduct: product_kp.publicKey,
                seller: this.marketAccountAddress,
                walletAddress: this.wallet.publicKey,
                systemProgram: SystemProgram.programId,
                marketplaceProgram: this.digital_market_program,
                marketplaceProgram: this.accounts_programid,
            },
            signers:[product_kp]
        });

    }
    DeleteProduct = async(product_key) =>{
        let product_pk = new PublicKey(product_key);

        await this.digital_market_program.rpc.deleteProduct({
            accounts:{
                digitalProduct: product_pk,
                seller: this.marketAccountAddress,
                walletAddress: this.wallet.publicKey,
                systemProgram: SystemProgram.programId,
                marketplaceProgram: this.accounts_programid
            }
        })
    }
    RequestBlocks = async(transaction_key) =>{
        let transaction_pk = new PublicKey(transaction_key);
        await this.digital_market_program.rpc.requestBlocks({
            accounts:{
                transaction: transaction_pk,
                buyer: this.marketAccountAddress,
                walletAddress: this.wallet.publicKey,
            }
        })

    }
    SubmitData = async(transaction_key, arweave_address, keys) =>{
        let transaction_pk = new PublicKey(transaction_key);
        await this.digital_market_program.rpc.submitData({
            accounts:{
                transaction: transaction_pk,
                seller: this.marketAccountAddress,
                walletAddress: this.wallet.publicKey
            }
        })
    }

    CreateDigitalSigner = async()=>{
        await this.digital_market_program.rpc.createMarketSigner({
            accounts:{
                digitalMarketSigner: this.digitalMarketSigner,
                funder: this.wallet.publicKey,
                systemProgram: SystemProgram.programId,
            }
        })
    }

    //UTILS FUNCTIONS
    holdingPda = async(transaction_pk) => {
        return PublicKey.findProgramAddress(
            [
                Buffer.from("holdingaccount"),
                transaction_pk.toBuffer(),
            ],
            this.physical_programid
        )
    }

    GetProduct = async(product_key) =>{
        return await this.digital_market_program.account.digitalProduct.fetch(new PublicKey(product_key));
    }

    GetTransaction = async(transaction_key) =>{
        return await this.digital_market_program.account.digitalTransaction.fetch(new PublicKey(transaction_key));
    }
}