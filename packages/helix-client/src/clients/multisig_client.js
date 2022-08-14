let multisig_idl = require("../idl/serum_multisig.json");
let helix_idl = require('../idl/twst.json');
let bond_idl = require('../idl/bond_market.json');
let ido_idl = require('../idl/ido.json');
let governance_idl = require('../idl/government_program.json');
import { TOKEN_PROGRAM_ID } from '@solana/spl-token'
import * as anchor from "@project-serum/anchor";
import { SystemProgram, PublicKey, Connection} from "@solana/web3.js";

export class MultisigClient{
    constructor(wallet, connection, provider){
        this.InitConsts();

        if(!wallet){
            return
        }
        this.wallet = wallet;
        this.connection = connection;
        this.provider = provider;


        this.multisig_program = new anchor.Program(multisig_idl, multisig_idl.metadata.address, this.provider);
        this.ido_program = new anchor.Program(ido_idl, ido_idl.metadata.address, this.provider);
        this.bond_program = new anchor.Program(bond_idl, bond_idl.metadata.address, this.provider);
        this.governance_program = new anchor.Program(governance_idl, governance_idl.metadata.address, this.provider);
        this.helix_program = new anchor.Program(helix_idl, helix_idl.metadata.address, this.provider);       
    }

    InitConsts = async () =>{
        this.ido_programid = new PublicKey(ido_idl.metadata.address);
        this.helix_programid = new PublicKey(helix_idl.metadata.address);
        this.governance_programid = new PublicKey(governance_idl.metadata.address);
        this.bond_programid = new PublicKey(bond_idl.metadata.address);

        this.spl_program_id = new PublicKey(process.env.NEXT_PUBLIC_SPL_ATA_PROGRAM_ID);

        const [helixMintAddress, helixMintBump] = await PublicKey.findProgramAddress(
			[
				Buffer.from("helixmintaccount")
			],
			this.helix_programid
		);

        this.helixMintAddress = helixMintAddress;

        this.usdc_mint = new PublicKey("yxdMpffjwBqPnokGfZY2AaTJDzth3umWcqiKFn9fGJz");

        this.multisigSigner = new PublicKey(process.env.NEXT_PUBLIC_MULTISIG_SIGNER_PUBKEY);
		this.multisig = new PublicKey(process.env.NEXT_PUBLIC_MULTISIG_ADDRESS);        
        this.txsize = 1000;
    }

    CreateHelixMint = async() =>{
		const mintTransaction = anchor.web3.Keypair.generate();
		const mintAccounts = [
			{
			pubkey: this.helixMintAddress,
			isSigner: false,
			isWritable: true
			},{
			pubkey: this.multisigSigner,
			isSigner: false,
			isWritable: true
			},{
			pubkey: SystemProgram.programId,
			isSigner: false,
			isWritable: false
			},{
			pubkey: TOKEN_PROGRAM_ID,
			isSigner: false,
			isWritable: false
			},{
			pubkey: anchor.web3.SYSVAR_RENT_PUBKEY,
			isSigner: false,
			isWritable: false
			}
		];
		
		const init_mint_data = this.helix_program.coder.instruction.encode("init_mint", {});
		await this.multisig_program.rpc.createTransaction(
			this.helix_programid,
			mintAccounts, 
			init_mint_data, {
			accounts: {
				multisig: this.multisig,
				transaction: mintTransaction.publicKey,
				proposer: this.wallet.publicKey,
				rent: anchor.web3.SYSVAR_RENT_PUBKEY,
			},
			instructions: [
			// creates transaction account clientside
				await this.multisig_program.account.transaction.createInstruction(
					mintTransaction,
					this.txsize
				),
			],
			signers: [mintTransaction],
		});

		await this.multisig_program.rpc.executeTransaction({
			accounts: {
			multisig: this.multisig,
			multisigSigner: this.multisigSigner,
			transaction: mintTransaction.publicKey,
			},
			// passes in the accounts needed during this execution.
			// confusing, i know. but instruction creation (&ix) needs a data array
			// then call needs the same array.
			remainingAccounts:
			mintAccounts.map((meta) => meta.isSigner? {...meta, isSigner:false}:meta).concat({pubkey: this.helix_programid}),
		});
	}

	GovernmentOwnedTokenAccount = async(mint, government) =>{
		const [protocolATA, protocolATABump] = await PublicKey.findProgramAddress(
			[
				this.multisigSigner.toBuffer(), 
				TOKEN_PROGRAM_ID.toBuffer(), 
				new PublicKey(mint).toBuffer()
			],
			this.spl_program_id
		);

        

		const [govId, govBump] = await anchor.web3.PublicKey.findProgramAddress(
			[
				new PublicKey(government).toBuffer(),
			],
			this.governance_programid,
		)
		
		const [protocolATAOwner, protocolATAOwnerBump] = await PublicKey.findProgramAddress(
			[
				Buffer.from("governmentauthority"), 
				govId.toBuffer()
			],
			this.governance_programid
		);

		const createAtaGovTransaction = anchor.web3.Keypair.generate();

		const createAtaGov = Token.createAssociatedTokenAccountInstruction(
		  this.spl_program_id,
		  TOKEN_PROGRAM_ID,
		  new PublicKey(mint),
		  protocolATA,
		  this.multisigSigner, // payer address for pda
		  this.multisigSigner
		);
	  
		const protocolAtaSPLAccounts = createAtaGov.keys;
	  
		const create_ata_data = createAtaGov.data;
	  
		await this.multisig_program.rpc.createTransaction(
			createAtaGov.programId,
			protocolAtaSPLAccounts, 
			create_ata_data, {
			accounts: {
			multisig: this.multisig,
			transaction: createAtaGovTransaction.publicKey,
			proposer: this.wallet.publicKey,
			rent: anchor.web3.SYSVAR_RENT_PUBKEY,
			},
			instructions: [
			// creates transaction account clientside
			await this.multisig_program.account.transaction.createInstruction(
				createAtaGovTransaction,
				this.txsize
			),
			],
			signers: [createAtaGovTransaction],
		});
	  
		await this.multisig_program.rpc.executeTransaction({
			accounts: {
			multisig: this.multisig,
			multisigSigner: this.multisigSigner,
			transaction: createAtaGovTransaction.publicKey,
			},
			// passes in the accounts needed during this execution.
			// confusing, i know. but instruction creation (&ix) needs a data array
			// then call needs the same array.
			remainingAccounts:
			protocolAtaSPLAccounts.map((meta) => meta.isSigner? {...meta, isSigner:false}:meta).concat({pubkey: this.spl_program_id}),
		});

		const ataOwnershipTransaction = anchor.web3.Keypair.generate();
	  
		const ataOwnershipInstruction = Token.createSetAuthorityInstruction(
		  TOKEN_PROGRAM_ID,
		  protocolATA,
		  protocolATAOwner,
		  "AccountOwner",
		  this.multisigSigner,
		  []
		);
	  
	  
		const transferOwnershipAccounts = ataOwnershipInstruction.keys;
	  
		const ownership_transfer_data = ataOwnershipInstruction.data;
	  
		await this.multisig_program.rpc.createTransaction(
			ataOwnershipInstruction.programId,
			transferOwnershipAccounts, 
			ownership_transfer_data, {
			accounts: {
				multisig: this.multisig,
				transaction: ataOwnershipTransaction.publicKey,
				proposer: this.wallet.publicKey,
				rent: anchor.web3.SYSVAR_RENT_PUBKEY,
			},
			instructions: [
			// creates transaction account clientside
			await this.multisig_program.account.transaction.createInstruction(
				ataOwnershipTransaction,
				this.txsize
			),
			],
			signers: [ataOwnershipTransaction],
		});
	  
		// Now that we've reached the threshold, send the transactoin.
		await this.multisig_program.rpc.executeTransaction({
		    accounts: {
		      multisig: this.multisig,
		      multisigSigner: this.multisigSigner,
		      transaction: ataOwnershipTransaction.publicKey,
		    },
		    // passes in the accounts needed during this execution.
		    // confusing, i know. but instruction creation (&ix) needs a data array
		    // then call needs the same array.
		    remainingAccounts:
		    transferOwnershipAccounts.map((meta) => meta.isSigner? {...meta, isSigner:false}:meta).concat({pubkey: TOKEN_PROGRAM_ID}),
		});
	}

	MultisigOwnedTokenAccount = async(mint) =>{
		const [protocolATA, protocolATABump] = await PublicKey.findProgramAddress(
			[
				this.multisigSigner.toBuffer(), 
				TOKEN_PROGRAM_ID.toBuffer(), 
				new PublicKey(mint).toBuffer()
			],
			this.spl_program_id
		);


		const multisigAtaTransaction = anchor.web3.Keypair.generate();

		const createAtaMultisig = Token.createAssociatedTokenAccountInstruction(
		  this.spl_program_id,
		  TOKEN_PROGRAM_ID,
		  new PublicKey(mint),
		  protocolATA,
		  this.multisigSigner,
		  this.multisigSigner,
		);
	  
		const protocolAtaAccounts = createAtaMultisig.keys;
	  
		// callee function name and params
		const create_ata_data = createAtaMultisig.data;
	  
		await this.multisig_program.rpc.createTransaction(
		  createAtaMultisig.programId,
		  protocolAtaAccounts, 
		  create_ata_data, {
		  accounts: {
			multisig: this.multisig,
			transaction: multisigAtaTransaction.publicKey,
			proposer: this.wallet.publicKey,
			rent: anchor.web3.SYSVAR_RENT_PUBKEY,
		  },
		  instructions: [
			// creates transaction account clientside
			await this.multisig_program.account.transaction.createInstruction(
			  multisigAtaTransaction,
			  this.txsize
			),
		  ],
		  signers: [multisigAtaTransaction],
		});
	  
		// Now that we've reached the threshold, send the transactoin.
		await this.multisig_program.rpc.executeTransaction({
			accounts: {
				multisig: this.multisig,
				multisigSigner: this.multisigSigner,
				transaction: multisigAtaTransaction.publicKey,
			},
			// passes in the accounts needed during this execution.
			// confusing, i know. but instruction creation (&ix) needs a data array
			// then call needs the same array.
			remainingAccounts:
			protocolAtaAccounts.map((meta) => meta.isSigner? {...meta, isSigner:false}:meta).concat({pubkey: this.spl_program_id}),
		});
	  
	}

	// mint to helix account
	MintToAccount = async(mintToAccount, amount) =>{
		
		const [mintAccount, mintAccountBump] = await PublicKey.findProgramAddress(
			[
				new PublicKey(mintToAccount).toBuffer(),
				TOKEN_PROGRAM_ID.toBuffer(),
				this.helixMintAddress.toBuffer(),
			],
			this.spl_program_id
		)

		const mintToAccountTransaction = anchor.web3.Keypair.generate();

		const mintToAccountAccounts = [
		  {
			pubkey: this.multisigSigner,
			isSigner: false,
			isWritable: false,
		  },{
			pubkey: mintAccount, //user
			isSigner: false,
			isWritable: true
		  },{
			pubkey: this.helixMintAddress,
			isSigner: false,
			isWritable: true
		  },{
			pubkey: TOKEN_PROGRAM_ID,
			isSigner: false,
			isWritable: false
		  },{
			pubkey: SystemProgram.programId,
			isSigner: false,
			isWritable: false
		  },
		];
	  
		// callee function name and params
		const data = this.helix_program.coder.instruction.encode("mint_to_account", {
			mintBump: this.helixMintBump,
			amt: new anchor.BN(amount)
		  });
	  
		  await this.multisig_program.rpc.createTransaction(
			this.helix_programid,
			mintToAccountAccounts, 
			data, {
			accounts: {
			  multisig: this.multisig,
			  transaction: mintToAccountTransaction.publicKey,
			  proposer: this.wallet.publicKey,
			  rent: anchor.web3.SYSVAR_RENT_PUBKEY,
			},
			instructions: [
			  // creates transaction account clientside
			  await this.multisig_program.account.transaction.createInstruction(
				mintToAccountTransaction,
				this.txsize
			  ),
			],
			signers: [mintToAccountTransaction],
		  });
	  
		// Now that we've reached the threshold, send the transactoin.
		await this.multisig_program.rpc.executeTransaction({
			accounts: {
			  multisig: this.multisig,
			  multisigSigner: this.multisigSigner,
			  transaction: mintToAccountTransaction.publicKey,
			},
			// passes in the accounts needed during this execution.
			// confusing, i know. but instruction creation (&ix) needs a data array
			// then call needs the same array.
			remainingAccounts:
			mintToAccountAccounts.map((meta) => meta.isSigner? {...meta, isSigner:false}:meta).concat({pubkey: this.helix_programid}),
		  });
	  
	}

	Rebase = async() =>{
		const rebaseTransaction = anchor.web3.Keypair.generate();

		const rebaseAccounts = [
			{
			pubkey: this.protocolDataAccount,
			isSigner: false,
			isWritable: true,
			},{
			pubkey: this.protocolHelixAta, //user
			isSigner: false,
			isWritable: true
			},{
			pubkey: this.helixMintAddress,
			isSigner: false,
			isWritable: true
			},{
			pubkey: this.multisigSigner,
			isSigner: false,
			isWritable: true
			},{
			pubkey: TOKEN_PROGRAM_ID,
			isSigner: false,
			isWritable: false
			},{
			pubkey: SystemProgram.programId,
			isSigner: false,
			isWritable: false
			},
		];

		// callee function name and params
		const data = this.helix_program.coder.instruction.encode("rebase", {
			mintBump: this.helixMintBump,
		});

		await this.multisig_program.rpc.createTransaction(
			this.helix_programid,
			rebaseAccounts, 
			data, {
			accounts: {
			multisig: this.multisig,
			transaction: rebaseTransaction.publicKey,
			proposer: this.wallet.publicKey,
			rent: anchor.web3.SYSVAR_RENT_PUBKEY,
			},
			instructions: [
			// creates transaction account clientside
			await this.multisig_program.account.transaction.createInstruction(
				rebaseTransaction,
				this.txsize
			),
			],
			signers: [rebaseTransaction],
		});

		// Now that we've reached the threshold, send the transactoin.
		await this.multisig_program.rpc.executeTransaction({
			accounts: {
			multisig: this.multisig,
			multisigSigner,
			transaction: rebaseTransaction.publicKey,
			},
			// passes in the accounts needed during this execution.
			// confusing, i know. but instruction creation (&ix) needs a data array
			// then call needs the same array.
			remainingAccounts:
			rebaseAccounts.map((meta) => meta.isSigner? {...meta, isSigner:false}:meta).concat({pubkey: this.helix_programid}),
		});

	}

	ChangeRebaseRate = async(new_rate) =>{
		const changeRebaseTransaction = anchor.web3.Keypair.generate();

		const changeRebaseAccounts = [
		  {
			pubkey: this.protocolDataAccount,
			isSigner: false,
			isWritable: true,
		  },{
			pubkey: this.multisigSigner,
			isSigner: false,
			isWritable: true
		}];
	  
		// callee function name and params
		const data = this.helix_program.coder.instruction.encode("change_rebase_rate", {
		    newRate: new anchor.BN(new_rate)
		  });
	  
		  await this.multisig_program.rpc.createTransaction(
		    this.helix_programid,
		    changeRebaseAccounts, 
		    data, {
		    accounts: {
		      multisig: this.multisig,
		      transaction: changeRebaseTransaction.publicKey,
		      proposer: this.wallet.publicKey,
		      rent: anchor.web3.SYSVAR_RENT_PUBKEY,
		    },
		    instructions: [
		      // creates transaction account clientside
		      await this.multisig_program.account.transaction.createInstruction(
		        changeRebaseTransaction,
		        this.txsize
		      ),
		    ],
		    signers: [changeRebaseTransaction],
		  });
	  
		// Now that we've reached the threshold, send the transactoin.
		await this.multisig_program.rpc.executeTransaction({
		    accounts: {
		      multisig: this.multisig,
		      multisigSigner: this.multisigSigner,
		      transaction: changeRebaseTransaction.publicKey,
		    },
		    // passes in the accounts needed during this execution.
		    // confusing, i know. but instruction creation (&ix) needs a data array
		    // then call needs the same array.
		    remainingAccounts:
		    changeRebaseAccounts.map((meta) => meta.isSigner? {...meta, isSigner:false}:meta).concat({pubkey: this.helix_programid}),
		  });
	  
	}

	// we also shouldnt need to call this ever. but its possible
	CreateBondSigner = async() =>{
		const createBondSigner = anchor.web3.Keypair.generate();

		const [bondSigner, bondSignerBump] = await PublicKey.findProgramAddress(
			[
			  Buffer.from("bondprogram")
			],
			this.bond_programid
		  );

		const createBondSignerAccoounts = [
		  {
			pubkey: bondSigner,
			isSigner: false,
			isWritable: true,
		  },{
			pubkey: this.multisigSigner,
			isSigner: false,
			isWritable: true
		  },{
			pubkey: SystemProgram.programId,
			isSigner: false,
			isWritable: false
		  }];
	  
		  const data = this.bond_program.coder.instruction.encode("create_signer", {});
	  
		  await this.multisig_program.rpc.createTransaction(
		    this.bond_programid,
		    createBondSignerAccoounts, 
		    data, {
		    accounts: {
		      multisig: this.multisig,
		      transaction: createBondSigner.publicKey,
		      proposer: this.wallet.publicKey,
		      rent: anchor.web3.SYSVAR_RENT_PUBKEY,
		    },
		    instructions: [
		      // creates transaction account clientside
		      await this.multisig_program.account.transaction.createInstruction(
		        createBondSigner,
		        this.txsize
		      ),
		    ],
		    signers: [createBondSigner],
		  });
	  
		// Now that we've reached the threshold, send the transactoin.
		await this.multisig_program.rpc.executeTransaction({
		    accounts: {
		      multisig: this.multisig,
		      multisigSigner: this.multisigSigner,
		      transaction: createBondSigner.publicKey,
		    },
		    // passes in the accounts needed during this execution.
		    // confusing, i know. but instruction creation (&ix) needs a data array
		    // then call needs the same array.
		    remainingAccounts:
		    createBondSignerAccoounts.map((meta) => meta.isSigner? {...meta, isSigner:false}:meta).concat({pubkey: this.bond_programid}),
		  });
	  
	}

	CreateIdoAta = async() =>{
		const createIdoAta = anchor.web3.Keypair.generate();

		const [bondSigner, bondSignerBump] = await PublicKey.findProgramAddress(
			[
			  Buffer.from("helixusdc")
			],
			this.ido_programid
		  );

		const createIdoAtaAccoounts = [
		  {
			pubkey: bondSigner,
			isSigner: false,
			isWritable: true,
		  },{
			pubkey: this.usdc_mint,
			isSigner: false,
			isWritable: true
		  },{
			pubkey: this.multisigSigner,
			isSigner: false,
			isWritable: true
		  },{
			pubkey: TOKEN_PROGRAM_ID,
			isSigner: false,
			isWritable: false
		  },{
			pubkey: SystemProgram.programId,
			isSigner: false,
			isWritable: false
		  },{
			  pubkey:anchor.web3.SYSVAR_RENT_PUBKEY,
			  isSigner: false,
			  isWritable: false
		  }];
	  
		  const data = this.ido_program.coder.instruction.encode("initUsdcAta", {});
	  
		  await this.multisig_program.rpc.createTransaction(
		    this.ido_programid,
		    createIdoAtaAccoounts, 
		    data, {
		    accounts: {
		      multisig: this.multisig,
		      transaction: createIdoAta.publicKey,
		      proposer: this.wallet.publicKey,
		      rent: anchor.web3.SYSVAR_RENT_PUBKEY,
		    },
		    instructions: [
		      // creates transaction account clientside
		      await this.multisig_program.account.transaction.createInstruction(
		        createIdoAta,
		        this.txsize
		      ),
		    ],
		    signers: [createIdoAta],
		  });
	  
		// Now that we've reached the threshold, send the transactoin.
		await this.multisig_program.rpc.executeTransaction({
		    accounts: {
		      multisig: this.multisig,
		      multisigSigner: this.multisigSigner,
		      transaction: createIdoAta.publicKey,
		    },
		    // passes in the accounts needed during this execution.
		    // confusing, i know. but instruction creation (&ix) needs a data array
		    // then call needs the same array.
		    remainingAccounts:
		    createIdoAtaAccoounts.map((meta) => meta.isSigner? {...meta, isSigner:false}:meta).concat({pubkey: this.ido_programid}),
		  });
	  
	}

    CreateBondMarket = async(mint) =>{
		const [bondMarketAddress, bondMarketAddressBump] = await PublicKey.findProgramAddress(
			[
			  Buffer.from("bondmarket"),
			  new PublicKey(mint).toBuffer(),
			],
			this.bond_programid
		);

		const createBondMarket = anchor.web3.Keypair.generate();

		const createBondMarketAccounts = [
			{
			pubkey: bondMarketAddress,
			isSigner: false,
			isWritable: true,
			},{
			pubkey: new PublicKey(mint),
			isSigner: false,
			isWritable: false
			},{
			pubkey: this.multisigSigner,
			isSigner: false,
			isWritable: true
			},{
			pubkey: SystemProgram.programId,
			isSigner: false,
			isWritable: false
			}];

		const data = this.bond_program.coder.instruction.encode("init_bond_market", {
			marketAccSpace: new anchor.BN(184),
			// default [0%, 1%, 1%, 2%, 3%]
			couponRates: [new anchor.BN(0), new anchor.BN(10), new anchor.BN(10), new anchor.BN(20), new anchor.BN(30)],
			interestRate: new anchor.BN(30),
		});

		await this.multisig_program.rpc.createTransaction(
			this.bond_programid,
			createBondMarketAccounts, 
			data, {
			accounts: {
				multisig: this.multisig,
				transaction: createBondMarket.publicKey,
				// i am indian eros :3
				proposer: this.wallet.publicKey,
				rent: anchor.web3.SYSVAR_RENT_PUBKEY,
			},
			instructions: [
				// creates transaction account clientside
				await this.multisig_program.account.transaction.createInstruction(
					createBondMarket,
					this.txsize
				),
				// await this.bond_program.account.bondMarket.createInstruction(
				// 	bondMarketAddress,
				// 	184
				// )
			],
			signers: [createBondMarket],
		});

		await this.multisig_program.rpc.executeTransaction({
			accounts: {
				multisig: this.multisig,
				multisigSigner: this.multisigSigner,
				transaction: createBondMarket.publicKey,
			},
			remainingAccounts:
			createBondMarketAccounts.map((meta) => meta.isSigner? {...meta, isSigner:false}:meta).concat({pubkey: this.bond_programid}),
		});

	}

	CloseBondMarket = async(mint) =>{
		const [bondMarketAddress, bondMarketAddressBump] = await PublicKey.findProgramAddress(
			[
			  Buffer.from("bondmarket"),
			  new PublicKey(mint).toBuffer(),
			],
			this.bond_programid
		);

		const closeBondMarket = anchor.web3.Keypair.generate();

		const closeBondMarketAccounts = [
			{
			pubkey: this.multisigSigner,
			isSigner: false,
			isWritable: true,
			},{
			pubkey: bondMarketAddress,
			isSigner: false,
			isWritable: true
			},{
			pubkey: new PublicKey(mint),
			isSigner: false,
			isWritable: false
			}];

		const data = this.bond_program.coder.instruction.encode("close_bond_market", {});

		await this.multisig_program.rpc.createTransaction(
			this.bond_programid,
			closeBondMarketAccounts, 
			data, {
			accounts: {
				multisig: this.multisig,
				transaction: closeBondMarket.publicKey,
				// i am indian eros :3
				proposer: this.wallet.publicKey,
				rent: anchor.web3.SYSVAR_RENT_PUBKEY,
			},
			instructions: [
				// creates transaction account clientside
				await this.multisig_program.account.transaction.createInstruction(
					closeBondMarket,
					this.txsize
				),
			],
			signers: [closeBondMarket],
		});

		await this.multisig_program.rpc.executeTransaction({
			accounts: {
				multisig: this.multisig,
				multisigSigner: this.multisigSigner,
				transaction: closeBondMarket.publicKey,
			},
			remainingAccounts:
			closeBondMarketAccounts.map((meta) => meta.isSigner? {...meta, isSigner:false}:meta).concat({pubkey: this.bond_programid}),
		});

	}
}