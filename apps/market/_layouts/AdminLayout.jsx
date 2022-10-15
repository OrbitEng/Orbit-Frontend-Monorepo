import { useContext, useState } from 'react'
import MarketAccountsCtx from '@contexts/MarketAccountsCtx';
import DigitalMarketCtx from '@contexts/DigitalMarketCtx';
import PhysicalMarketCtx from '@contexts/PhysicalMarketCtx';
import CommissionMarketCtx from '@contexts/CommissionMarketCtx';
import ProductClientCtx from '@contexts/ProductClientCtx';
import TransactionClientCtx from '@contexts/TransactionClientCtx';

import { HomeHeader } from '@includes/MarketHeader';

export default function AdminLayout(){
	const {marketAccountsClient} = useContext(MarketAccountsCtx);
	const {productClient} = useContext(ProductClientCtx);

	return(
        
		<div className="bg-[#070513] w-full min-h-screen flex flex-col m-auto text-white">
            <HomeHeader/>
			<div className="m-10 flex flex-col">
				<div>
					Initialize Voter Struct
				</div>
				<button className="bg-white m-2 border-2 w-32 h-12 text-black" onClick={e => {marketAccountsClient.InitializeVoterStruct()}}>
					button
				</button>
			</div>

			<div className="m-10 flex flex-col">
			<div>
					Initialize Recent Listings
				</div>
				<button className="bg-white m-2 border-2 w-32 h-12 text-black" onClick={e => {productClient.InitRecentListings()}}>
					button
				</button>
			</div>
			
		</div>
	)
}