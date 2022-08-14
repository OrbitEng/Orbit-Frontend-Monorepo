let governance_idl = require('../idl/government_program.json');
import * as anchor from "@project-serum/anchor";
const {NodeWallet} = require("@project-serum/anchor");
import { SystemProgram, PublicKey, Connection} from "@solana/web3.js";

export class GovClient{
    constructor(wallet, connection, provider){
        this.governance_programid = new PublicKey(governance_idl.metadata.address);
        
        if(!wallet){
            return
        };
        this.wallet = wallet;
        this.connection = connection;
        this.provider = provider;

        this.governance_program = new anchor.Program(governance_idl, governance_idl.metadata.address, this.provider);
        
    }

    CreateGovernment = async(governed_program)=>{
		// only one government per program
		// program can be another government or one of helix's programs or any program really
		const [govAddress, govAddressBump] = await PublicKey.findProgramAddress(
			[
				new PublicKey(governed_program).toBuffer()
			],
		  	this.governance_programid
		  );


		await this.governance_program.rpc.createGovernment(
			new PublicKey(governed_program),
			{
				accounts:{
					government: govAddress,
					payer: this.wallet.publicKey,
					protocolData: this.protocolDataAccount,
					systemProgram: SystemProgram.programId,
				},
			// signers:[government_kp, funderKP],
			}
		);
	}

	// create proposal
	CreateProposal = async(government_address, title, description, expiration_weeks) => {
		const [govAddress, govAddressBump] = await PublicKey.findProgramAddress(
			[
				new PublicKey(government_address).toBuffer()
			],
		  	this.governance_programid
		  );

		let proposalKp = anchor.web3.Keypair.generate();
		await this.governance_program.rpc.createProposal(title, description, new anchor.BN(expiration_weeks), {
			accounts:{
			  proposal: proposalKp.publicKey,
			  payer: this.wallet.publicKey,
			  government: new PublicKey(govAddress),
			  systemProgram: SystemProgram.programId,
			},
			signers:[proposalKp],
		});
	}

	// cast vote
	CastVote = async(proposal, choice) =>{
		await this.governance_program.rpc.castVote(
			choice,
			{
				accounts:{
					proposal: new PublicKey(proposal),
					user: this.wallet.publicKey,
					userVault: this.userVault,
					protocolData: this.protocolDataAccount,
				}
			}
		)
	}

	// fetch proposals
	FetchProposals = async(governed_program) =>{
		const [govId, govBump] = await anchor.web3.PublicKey.findProgramAddress(
			[
				new PublicKey(governed_program).toBuffer(),
			],
			this.governance_programid,
		);

        return await new anchor.Program(
            governance_idl,
            this.governance_programid,
            new anchor.AnchorProvider(
                this.connection,
                {}
            )
        ).account.government.fetch(new PublicKey(govId))
		
	}
}