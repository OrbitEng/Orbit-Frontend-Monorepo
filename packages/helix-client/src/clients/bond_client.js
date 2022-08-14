let bond_idl = require('../idl/bond_market.json');
let helix_idl = require("../idl/twst.json");
import { TOKEN_PROGRAM_ID } from '@solana/spl-token'
import { SystemProgram, PublicKey, Connection} from "@solana/web3.js";
import * as anchor from "@project-serum/anchor";
import * as pyth_utils from  "../pyth_utils/pythUtils";

const {FooWallet} = require("../utils/wallet");

export class BondClient{
    constructor(wallet, connection, provider){
        this.bond_programid = new PublicKey(bond_idl.metadata.address);
        this.helix_programid = new PublicKey(helix_idl.metadata.address);
        this.spl_program_id = new PublicKey(process.env.NEXT_PUBLIC_SPL_ATA_PROGRAM_ID);
        
        this.pyth_map = pyth_utils.PythMap();
        this.InitConsts().then(()=>{
			if(!wallet){
				return
			}
			this.wallet = wallet;
			this.PostWalletConsts();
			this.connection = connection;
			this.provider = provider;
	
			this.bond_program = new anchor.Program(bond_idl, bond_idl.metadata.address, this.provider);
		});
    }

    InitConsts = async () =>{
        this.usdc_mint = new PublicKey("yxdMpffjwBqPnokGfZY2AaTJDzth3umWcqiKFn9fGJz");
        this.multisigSigner = new PublicKey(process.env.NEXT_PUBLIC_MULTISIG_SIGNER_PUBKEY);
		this.multisig = new PublicKey(process.env.NEXT_PUBLIC_MULTISIG_ADDRESS);
        this.treasuryWallet = new PublicKey(process.env.NEXT_PUBLIC_TREASURY_PUBKEY);
        
        const [helixMintAddress, helixMintBump] = await PublicKey.findProgramAddress(
			[
				Buffer.from("helixmintaccount")
			],
			this.helix_programid
		);

		const [bondMarketHelix, bondMarketHelixBump] = await PublicKey.findProgramAddress(
			[
			  Buffer.from("bondmarket"),
			  helixMintAddress.toBuffer(),
			],
			this.bond_programid
		);

		const [bondMarketUSDC, bondMarketUSDCBump] = await PublicKey.findProgramAddress(
		[
			Buffer.from("bondmarket"),
			this.usdc_mint.toBuffer(),
		],
		this.bond_programid
		);
	
		const [bondMarketSOL, bondMarketSOLBump] = await PublicKey.findProgramAddress(
			[
				Buffer.from("bondmarket"),
				SystemProgram.programId.toBuffer(),
			],
			this.bond_programid
		);
		
		const [bondSigner, bondSignerBump] = await PublicKey.findProgramAddress(
			[
			  Buffer.from("bondprogram")
			],
			this.bond_programid
		);


		this.bondMarketHelix = bondMarketHelix;
		this.bondMarketHelixBump = bondMarketHelixBump;
		
		this.bondMarketSOL = bondMarketSOL;
		this.bondMarketSOLBump = bondMarketSOLBump;

		this.bondMarketUSDC = bondMarketUSDC;
		this.bondMarketUSDCBump = bondMarketUSDCBump;

		this.bondSigner = bondSigner;
		this.bondSignerBump = bondSignerBump;
    }

    PostWalletConsts = async () =>{
        
        const [bondAccount, bondAccountBump] = await anchor.web3.PublicKey.findProgramAddress(
			[
			  Buffer.from("bondaccount"),
			  this.wallet.publicKey.toBuffer()
			],
			this.bond_programid
		);
        this.bondAccount = bondAccount;
        this.bondAccountBump = bondAccountBump;
    }

	InitBondAccount = async() => {
		return await this.bond_program.rpc.initBondAccount(new anchor.BN(1208),{
			accounts:{
				bondAccount: this.bondAccount,
				payer: this.wallet.publicKey,
				systemProgram: SystemProgram.programId,
			},
			// signers: [this.wallet],
		});
	}

	CloseBondAccount = async() =>{
		return await this.bond_program.rpc.closeAccount({
			accounts:{
				owner: this.wallet.publicKey,
				bondAccount: this.bondAccount,
			},
			// signers: [this.wallet],
		});
	}

	SolBond = async (bond_price, maturity, connection) => {
		const pyth_sol_price_address = this.pyth_map[connection].SOL; // sol pubkey address for that connection

		await this.bond_program.rpc.depositAssetPrintBondSol(
			new anchor.BN(bond_price),
			new anchor.BN(maturity),
			{
				accounts:{
				pythOraclePrice: pyth_sol_price_address,
				userWallet: this.wallet.publicKey,
				treasuryWallet: this.multisigSigner,
				bondMarket: this.bondMarketSOL,
				bondAccount: this.bondAccount,
				systemProgram: SystemProgram.programId,
				},
				// signers: [this.wallet]
			}
		);
	}

	FetchBondAccount = async() => {
		try{
			return await this.bond_program.account.bondAccount.fetch(this.bondAccount);
		}catch(e){
			return undefined
		}
		
	}

	/// take asset mint as input
	SPLBond = async (bond_price, bond_maturity, mintAddress, asset, connection, decimals) => {	
		let tokenMintAddress = new PublicKey(mintAddress);

		const userAta = (await PublicKey.findProgramAddress(
			[
				this.wallet.publicKey.toBuffer(),
				TOKEN_PROGRAM_ID.toBuffer(),
				tokenMintAddress.toBuffer(),
			],
			this.spl_program_id
		))[0];

		const protocolSplAta = (await PublicKey.findProgramAddress(
			[
				this.multisigSigner.toBuffer(),
				TOKEN_PROGRAM_ID.toBuffer(),
				tokenMintAddress.toBuffer(),
			],
			this.spl_program_id
		))[0];

		const [bondMarketSpl, bondMarketSplBump] = await anchor.web3.PublicKey.findProgramAddress(
			[
			  Buffer.from("bondmarket"),
			  tokenMintAddress.toBuffer(),
			],
			this.bond_programid
		);

		const pyth_spl_price_address = this.pyth_map[connection][asset]; // sol pubkey address for that connection

		await this.bond_program.rpc.depositAssetPrintBondSpl(
			new anchor.BN(bond_price),
			new anchor.BN(bond_maturity),
			new anchor.BN(decimals),
			{
				accounts:{
				pythOraclePrice: pyth_spl_price_address,
				user: this.wallet.publicKey,
				userAta: userAta,
				protocAta: protocolSplAta,
				bondAccount: this.bondAccount,
				mint: tokenMintAddress,
				bondMarket: bondMarketSpl,
				tokenProgram: TOKEN_PROGRAM_ID,
				},
				// signers: [userKP]
			}
		);
	}

	RedeemBonds = async () => {
		await this.bond_program.rpc.redeemBonds({
			mintBump: this.helixMintBump,
			signerBump: this.bondSignerBump
		},{
			accounts:{
				signerAccount: this.bondSigner,
				mint: this.helixMintAddress,
				collectionAccount: this.userHelixAta,
				bondAccount: this.bondAccount,
				twstProgram: this.helix_program.programId,
				tokenProgram: TOKEN_PROGRAM_ID,
			},
		});
	}

	CollectCoupon = async () => {
		await this.bond_program.rpc.collectCoupon({
			mintBump: this.helixMintBump,
			signerBump: this.bondSignerBump
		  },{
			accounts:{
				signerAccount: this.bondSigner,
				collectionAccount: this.userHelixAta,
				mint: this.helixMintAddress,
				bondAccount: this.bondAccount,
				twstProgram: this.helix_program.programId,
				tokenProgram: TOKEN_PROGRAM_ID,
			}
		  });
	}

	FetchBondMarket = async(mint) => {
		let [bond_market_address,] = await PublicKey.findProgramAddress(
			[
				Buffer.from("bondmarket"), 
				new PublicKey(mint).toBuffer()
			],
			this.bond_programid
		);

        return await new anchor.Program(
            bond_idl,
            this.bond_programid,
            new anchor.AnchorProvider(
				this.connection,
				{}
			)
        ).account.bondMarket.fetch(bond_market_address)
	}
}