import { useContext, useState } from 'react'
import MarketAccountsCtx from '@contexts/MarketAccountsCtx';
import CatalogCtx from '@contexts/CatalogCtx';
import DigitalMarketCtx from '@contexts/DigitalMarketCtx';
import PhysicalMarketCtx from '@contexts/PhysicalMarketCtx';
import CommissionMarketCtx from '@contexts/CommissionMarketCtx';

import { HomeHeader } from '@includes/MarketHeader';

export default function AdminLayout(){
    const {physicalMarketClient} = useContext(PhysicalMarketCtx);
	const {commissionMarketClient} = useContext(CommissionMarketCtx);
	const {digitalMarketClient} = useContext(DigitalMarketCtx);
	const {catalogClient} = useContext(CatalogCtx);
	const {marketAccountsClient} = useContext(MarketAccountsCtx)

	return(
        
		<div className="bg-[#070513] w-full min-h-screen flex flex-col m-auto text-white">
            <HomeHeader/>
			<div className="m-10 flex flex-col">
				<div>
					Initialize Commissions Catalog
				</div>
				<button className="bg-white m-2 border-2 w-32 h-12 text-black" onClick={e => {commissionMarketClient.InitRecentCatalog()}}>
					button
				</button>
			</div>
			<div className="m-10 flex flex-col">
			<div>
					Initialize Physical Catalog
				</div>
				<button className="bg-white m-2 border-2 w-32 h-12 text-black" onClick={e => {physicalMarketClient.InitRecentCatalog()}}>
					button
				</button>
			</div>
			<div className="m-10 flex flex-col">
				<div>
					Initialize Digital Catalog
				</div>
				<button className="bg-white m-2 border-2 w-32 h-12 text-black" onClick={e => {digitalMarketClient.InitRecentCatalog()}}>
					button
				</button>
			</div>

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
					Initialize Top Vendors Catalog
				</div>
				<button className="bg-white m-2 border-2 w-32 h-12 text-black" onClick={e => {catalogClient.InitTopVendor()}}>
					button
				</button>
			</div>
		</div>
	)
}