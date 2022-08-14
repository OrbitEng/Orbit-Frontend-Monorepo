let ido_idl = require('../idl/ido.json');
import { TOKEN_PROGRAM_ID } from '@solana/spl-token'
import { SystemProgram, PublicKey} from "@solana/web3.js";

export class IdoClient{
    constructor(wallet, connection, provider){
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
	
			this.ido_program = new anchor.Program(ido_idl, ido_idl.metadata.address, this.provider);
		});        
        
    }

    InitConsts = async () =>{
        this.usdc_mint = new PublicKey("yxdMpffjwBqPnokGfZY2AaTJDzth3umWcqiKFn9fGJz");

        const [idoUSDCAta, idoUSDCAtaBump] = await PublicKey.findProgramAddress(
			[
			  Buffer.from("helixusdc"),
			],
			this.ido_programid
		);

		this.idoUSDCAta = idoUSDCAta;
		this.idoUSDCAtaBump = idoUSDCAtaBump;
    }

    PostWalletConsts = async() =>{
        const [idoAccount, idoAccountBump] = await PublicKey.findProgramAddress(
			[
			  Buffer.from("idoaccount"),
			  this.wallet.publicKey.toBuffer()
			],
			this.ido_programid
		);
        this.idoAccount = idoAccount;
		this.idoAccountBump = idoAccountBump;
    }

    IDODeposit = async(amount)  => {
		const userAta = (await PublicKey.findProgramAddress(
			[
				this.wallet.publicKey.toBuffer(),
				TOKEN_PROGRAM_ID.toBuffer(),
				this.usdc_mint.toBuffer(),
			],
			this.spl_program_id
		))[0];

		await this.ido_program.rpc.idoDeposit(new anchor.BN(amount),{
			accounts:{
			  user: this.wallet.publicKey,
			  userAta: userAta,
			  poolAta: this.idoUSDCAta,
			  usdcMint: this.usdc_mint,
			  idoAccount: this.idoAccount,
			  tokenProgram: TOKEN_PROGRAM_ID,
			},
			// signers: [userKP],
		  });
	}

	IDOWithdraw = async(amount)  => {
		const userAta = (await PublicKey.findProgramAddress(
			[
				this.wallet.publicKey.toBuffer(),
				TOKEN_PROGRAM_ID.toBuffer(),
				this.usdc_mint.toBuffer(),
			],
			this.spl_program_id
		))[0];

		await this.ido_program.rpc.idoWithdraw(this.idoUSDCAtaBump, new anchor.BN(amount),{
			accounts:{
				user: this.wallet.publicKey,
				userAta: userAta,
				poolAta: this.idoUSDCAta,
				usdcMint: this.usdc_mint,
				idoAccount: this.idoAccount,
				tokenProgram: TOKEN_PROGRAM_ID,
			},
			// signers: [userKP],
		});
	}

	CreateIdoAccount = async()  => {
		await this.ido_program.rpc.initIdoAccount({
			accounts:{
				user: this.wallet.publicKey,
				idoAccount: this.idoAccount,
				systemProgram: SystemProgram.programId,
			},
			// signers: [userKP],
		});
	}

	FetchIdoAta = async() =>{
		return await this.connection.getParsedAccountInfo(this.idoUSDCAta);
	}

	FetchIdoAccount = async() =>{
		return await this.ido_program.account.userIdoAccount.fetch(this.idoAccount);
	}
}
