import { useContext, useState } from 'react';

import { HomeHeader } from '@includes/MarketHeader';
import { PRODUCT_PROGRAM, ACCOUNTS_PROGRAM } from 'orbit-clients';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { sendAndConfirmTransaction, Transaction } from '@solana/web3.js';
import { useEffect, useCallback } from 'react';
import { Connection } from '@solana/web3.js';

export default function AdminLayout(){

	const wallet = useWallet();
	const { connection } = useConnection();

	const [instructions, setInstructions] = useState(undefined)

	const AddInitListings = useCallback(async () =>{
		let ix = await PRODUCT_PROGRAM.InitRecentListings(wallet);
		setInstructions(ix);
		console.log("instruction set", ix)
	}, [wallet, setInstructions])

	// https://discord.com/channels/889577356681945098/889577399308656662/1022990506323615814
	const ConfirmAdminTransaction = useCallback(async ()=>{
		
		let latest_blockhash = await connection.getLatestBlockhash();
		let tx = new Transaction({
			feePayer: wallet.publicKey,
			... latest_blockhash
		});
		console.log(instructions)
		try{

			if(instructions){
				console.log("has instruction")
				tx.add(instructions);
				console.log(tx)
				await wallet.signTransaction(tx);
				let sig = await wallet.sendTransaction(tx, connection);
				console.log("signed tx: ", sig)
				let confirmation  = await connection.confirmTransaction({
					...latest_blockhash,
					signature: sig,
				});
				console.log(confirmation);
			}else{
				throw "no ix"
			}
		}catch(e){
			console.log(e)
		}

	}, [connection, wallet, instructions])

	return(
		<div className="bg-[#070513] w-full min-h-screen flex flex-col m-auto text-white">
            <HomeHeader/>
			
			<div className="m-10 flex flex-col">
				<div>
					Initialize Recent Listings
				</div>
				<button className="bg-white m-2 border-2 w-32 h-12 text-black" onClick={e => {
					AddInitListings()
				}}>
					button
				</button>
			</div>
			<button className="bg-white m-2 border-2 w-32 h-12 text-black" onClick={async (e) => {
				await ConfirmAdminTransaction()
			}}>
					confirm
			</button>
		</div>
	)
}