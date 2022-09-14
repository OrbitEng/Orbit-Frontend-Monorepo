import { useCallback, useEffect, useState, useContext } from "react";
import { ProductDisplayCardHome } from "./components/ProductDisplayCards";

import DigitalMarketCtx from '@contexts/DigitalMarketCtx';
import PhysicalMarketCtx from '@contexts/PhysicalMarketCtx';
import CatalogCtx from '@contexts/CatalogCtx';

export function HomeProductExplorer(props) {
	const {digitalMarketClient, setDigitalMarketClient} = useContext(DigitalMarketCtx);
	const {physicalMarketClient, setPhysicalMarketClient} = useContext(PhysicalMarketCtx);
	const {catalogClient, setCatalogClient} = useContext(CatalogCtx);

	const [ digitalProducts, setDigitalProducts ] = useState();
	const [ physicalProducts, setPhysicalProducts ] = useState();

	const updateDigitalProducts = useCallback(async ()=>{
		if(!digitalMarketClient)return;
		setDigitalProducts(
			await digitalMarketClient.GetMultipleDigitalProducts(
				await catalogClient.GetCatalog(
					(await digitalMarketClient.GenRecentCatalog())[0]
				)
			)
		)
	},[digitalMarketClient]);

	const updatePhysicalProducts = useCallback(async ()=>{
		if(!physicalMarketClient)return;
		setPhysicalProducts(
			await physicalMarketClient.GetMultiplePhysicalProducts(
				await catalogClient.GetCatalog(
					(await physicalMarketClient.GenRecentCatalog())[0]
				)
			)
		)
	},[physicalMarketClient]);

	useEffect(async ()=>{
		await updateDigitalProducts();
		await updatePhysicalProducts();
	},[updateDigitalProducts, updatePhysicalProducts])

	return(
		<div className="container mx-auto flex flex-col overflow-visible">
			<div className="flex text-3xl text-white font-bold">Explore</div>
			<div className="flex flex-row gap-3 mt-3 font-bold text-white text-xs">
				<button className="rounded-full px-4 py-2 bg-[#8431D7] ">Recent</button>
				<button className="rounded-full px-4 py-2 bg-[#8431D7]">Physical</button>
				<button className="rounded-full px-4 py-2 bg-[#8431D7]">Digital</button>
				<button className="rounded-full px-4 py-2 bg-[#8431D7]">NFT</button>
			</div>
			<div className="my-6 grid grid-flow-row overflow-visible grid-cols-4 grid-rows-4 gap-x-16">
				{digitalProducts?.map(c => {
					return(
						<ProductDisplayCardHome product={c} />
					)
				})}

				{physicalProducts?.map(c => {
					return(
						<ProductDisplayCardHome product={c} />
					)
				})}

				<ProductDisplayCardHome 
				/>
				<ProductDisplayCardHome 
				/>
				<ProductDisplayCardHome 
				/>
				<ProductDisplayCardHome 
				/>
			</div>

		</div>
	)
}