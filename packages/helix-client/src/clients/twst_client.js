let helix_idl = require('../idl/twst.json');
let ido_idl = require('../idl/ido.json');
import { TOKEN_PROGRAM_ID } from '@solana/spl-token'
import * as anchor from "@project-serum/anchor";
const {NodeWallet} = require("@project-serum/anchor");
import { SystemProgram, PublicKey, Connection} from "@solana/web3.js";


export class HelixClient{
    constructor(wallet, connection, provider){
        this.helix_programid = new PublicKey(helix_idl.metadata.address);
		this.ido_programid = new PublicKey(ido_idl.metadata.address);
        this.spl_program_id = new PublicKey(process.env.NEXT_PUBLIC_SPL_ATA_PROGRAM_ID);
        this.InitConsts().then(()=>{
			if(!wallet){
				return
			}
			this.wallet = wallet;
			this.PostWalletConsts();

			this.connection = connection;
			this.provider = provider;

			this.helix_program = new anchor.Program(helix_idl, helix_idl.metadata.address, this.provider);       
		});
    }

    InitConsts = async () => {
        
        this.multisigSigner = new PublicKey(process.env.NEXT_PUBLIC_MULTISIG_SIGNER_PUBKEY);
		this.multisig = new PublicKey(process.env.NEXT_PUBLIC_MULTISIG_ADDRESS);

        const [helixMintAddress, helixMintBump] = await PublicKey.findProgramAddress(
			[
				Buffer.from("helixmintaccount")
			],
			this.helix_programid
		);

		const [protocolDataAccount, protocolDataBump] = await PublicKey.findProgramAddress(
			[Buffer.from("protocoldataaccount")],
			this.helix_programid
		);
		
		const [protocolHelixAta,protocolHelixAtaBump] = await PublicKey.findProgramAddress(
			[
				this.multisigSigner.toBuffer(),
				TOKEN_PROGRAM_ID.toBuffer(),
				helixMintAddress.toBuffer(),
			],
			this.spl_program_id
		);

		const [protocolATAOwner, protocolATAOwnerBump] = await PublicKey.findProgramAddress(
			[
				this.multisigSigner.toBuffer(), 
			  	TOKEN_PROGRAM_ID.toBuffer(), 
			  	helixMintAddress.toBuffer()
			],
			this.helix_programid
		);

        this.helixMintAddress = helixMintAddress;
		this.helixMintBump = helixMintBump;

        this.protocolHelixAuth = protocolATAOwner;

        this.protocolDataAccount = protocolDataAccount;
		this.protocolDataBump = protocolDataBump;

		this.protocolHelixAta = protocolHelixAta;
		this.protocolHelixAtaBump = protocolHelixAtaBump;

    }

    PostWalletConsts = async()=>{
        const [userHelixAta, userHelixAtaBump] = await PublicKey.findProgramAddress(
			[
				this.wallet.publicKey.toBuffer(),
				TOKEN_PROGRAM_ID.toBuffer(),
				this.helixMintAddress.toBuffer(),
			],
			this.spl_program_id
		);
		
        const [userVault, userVaultBump] = await PublicKey.findProgramAddress(
			[
				Buffer.from("uservault"), 
				this.wallet.publicKey.toBuffer()
			],
			this.helix_programid
		);

		const [idoAccount, idoAccountBump] = await PublicKey.findProgramAddress(
			[
			  Buffer.from("idoaccount"),
			  this.wallet.publicKey.toBuffer()
			],
			this.ido_programid
		);
        this.idoAccount = idoAccount;
		this.idoAccountBump = idoAccountBump;

        this.userHelixAta = userHelixAta;
		this.userHelixAtaBump = userHelixAtaBump;

        this.userVault = userVault;
		this.userVaultBump = userVaultBump;
    }

    InitializeUserVault = async () => {
		console.log(this.userVault, this.wallet.publicKey, SystemProgram.programId);
		return await this.helix_program.rpc.initUserVault(
			{
				accounts:{
					userAccount: this.userVault,
					payer: this.wallet.publicKey,
					systemProgram: SystemProgram.programId,
				}
		});
	}

	DeleteUserVault = async() =>{
		return await this.helix_program.rpc.closeUserVault({
			accounts:{
				owner: this.wallet.publicKey,
				userVault: this.userVault,
			}
		})
	}

	CreateUserATA = async () => {
		let ata = await Token.getAssociatedTokenAddress(
			this.spl_program_id, // always ASSOCIATED_TOKEN_PROGRAM_ID
			TOKEN_PROGRAM_ID, // always TOKEN_PROGRAM_ID
			this.helixMintAddress, // mint
			this.wallet.publicKey // owner
		);

		try{
			await this.connection.getParsedAccountInfo(
				ata
			);
		}catch(e){
			let tx = new anchor.web3.Transaction().add(
				Token.createAssociatedTokenAccountInstruction(
					this.spl_program_id, // always ASSOCIATED_TOKEN_PROGRAM_ID
					TOKEN_PROGRAM_ID, // always TOKEN_PROGRAM_ID
					this.helixMintAddress, // mint
					ata, // ata
					this.wallet.publicKey, // owner of token account
					this.wallet.publicKey // fee payer
				)
			);

			tx.recentBlockhash = (await this.connection.getRecentBlockhash()).blockhash;
			tx.feePayer = this.wallet.publicKey;
			let signed_tx = await this.wallet.signTransaction(tx);
			await this.connection.sendRawTransaction(signed_tx.serialize());
		};
	}

	// stake amount is in twst
	// todo indianeros: make mint decimals dynamic
	Stake = async(amount) => {
		await this.helix_program.rpc.stake(new anchor.BN(amount), {
		accounts:{
			userAta: this.userHelixAta,
			protocAta: this.protocolHelixAta,
			mint: this.helixMintAddress,
			userVault: this.userVault,
			protocolData: this.protocolDataAccount,
			user: this.wallet.publicKey,
			tokenProgram: TOKEN_PROGRAM_ID,
		},
		// signers:[userKP],
		})
	}

	// unstake amount is stwst
	Unstake = async (amount) => {
		await this.helix_program.rpc.unstake(this.protocolHelixAtaBump, new anchor.BN(amount), {
		accounts:{
			user: this.wallet.publicKey,
			userAta: this.userHelixAta,
			userVault: this.userVault,
			protocolData: this.protocolDataAccount,
			protocAta: this.protocolHelixAta,
			protocAuth: this.protocolHelixAuth,
			mint: this.helixMintAddress,
			tokenProgram: TOKEN_PROGRAM_ID,
		},
		// signers:[userKP],
		})
	}

	MintAndCloseIDO = async() => {
		await this.helix_program.rpc.mintAndCloseIdo(this.helixMintBump,
			{
			accounts:{
			  idoAccount: this.idoAccount,
			  user: this.wallet.publicKey,
			  mint: this.helixMintAddress,
			  userHelixAta: this.userHelixAta,
			  tokenProgram: TOKEN_PROGRAM_ID,
			  idoProgram: this.ido_programid,
			},
			// signers:[userKP],
		  });
	}

	ChangeLockup = async(duration) => {
		await this.helix_program.rpc.changeLockup(
			new anchor.BN(duration), {
			accounts:{
				userVault: this.userVault,
				user: this.wallet.publicKey,
			},
		// signers:[userKP],
		})
	}

	FetchUserVault = async() => {
        try{
			return await this.helix_program.account.userVault.fetch(this.userVault);
		}catch(e){
			return undefined;
		}
		
	}

	FetchProtocolData = async() => {
		try{
			return await new anchor.Program(
				helix_idl,
				this.helix_programid,
				new anchor.AnchorProvider(
					this.connection,
					{}
				)
			).account.protocolDataAccount.fetch(this.protocolDataAccount);
		}catch(e){
			return undefined
		}
        
	}
}