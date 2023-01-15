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

	const [instructions, setInstructions] = useState({
		listingsInitIx: undefined
	})

	const AddInitListings = useCallback(async () =>{
		setInstructions(async (currix) => {
			currix.listingsInitIx = await PRODUCT_PROGRAM.InitRecentListings(wallet);
			return currix
		})
	}, [wallet, setInstructions])

	// https://discord.com/channels/889577356681945098/889577399308656662/1022990506323615814
	const ConfirmAdminTransaction = useCallback(async ()=>{
		let tx = new Transaction();
		if(instructions.listingsInitIx){
			tx.add(instructions.listingsInitIx)
		}
		await sendAndConfirmTransaction(
			connection, tx, wallet
		)

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