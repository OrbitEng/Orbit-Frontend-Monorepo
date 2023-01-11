import { useContext, useState } from 'react';

import { HomeHeader } from '@includes/MarketHeader';
import { PRODUCT_PROGRAM, ACCOUNTS_PROGRAM } from 'orbit-clients';

export default function AdminLayout(){

	return(
        
		<div className="bg-[#070513] w-full min-h-screen flex flex-col m-auto text-white">
            <HomeHeader/>
			<div className="m-10 flex flex-col">
				<div>
					Initialize Voter Struct
				</div>
				<button className="bg-white m-2 border-2 w-32 h-12 text-black" onClick={e => {ACCOUNTS_PROGRAM.InitializeVoterStruct()}}>
					button
				</button>
			</div>

			<div className="m-10 flex flex-col">
			<div>
					Initialize Recent Listings
				</div>
				<button className="bg-white m-2 border-2 w-32 h-12 text-black" onClick={e => {PRODUCT_PROGRAM.InitRecentListings()}}>
					button
				</button>
			</div>
			
		</div>
	)
}