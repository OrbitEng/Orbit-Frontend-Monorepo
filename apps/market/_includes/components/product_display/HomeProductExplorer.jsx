import { useCallback, useEffect, useState, useContext } from "react";
import { ProductDisplayCardHome } from "../cards/ProductDisplayCards";

import DigitalMarketCtx from '@contexts/DigitalMarketCtx';
import PhysicalMarketCtx from '@contexts/PhysicalMarketCtx';
import ProductClientCtx from "@contexts/ProductClientCtx";

export function HomeProductExplorer(props) {
	const {productClient} = useContext(ProductClientCtx);

	const [ digitalProducts, setDigitalProducts ] = useState();
	const [ physicalProducts, setPhysicalProducts ] = useState();
	const [ commissionProducts, setCommissionProducts ] = useState();

	const updateDigitalProducts = async ()=>{
		if(!productClient)return;
		setDigitalProducts(
			await productClient.GetMultipleDigitalProducts(
				(await productClient.GetRecentMarketListings(
					productClient.GenRecentListings("digital")
				)).data.pubkeys
			)
		)
	};

	const updatePhysicalProducts = async ()=>{
		if(!productClient)return;
		setPhysicalProducts(
			await productClient.GetMultiplePhysicalProducts(
				(await productClient.GetRecentMarketListings(
					productClient.GenRecentListings("physical")
				)).data.pubkeys
			)
		)
	};

	const updateCommissionProducts = async ()=>{
		if(!productClient)return;
		setCommissionProducts(
			await productClient.GetMultipleCommissionProducts(
				(await productClient.GetRecentMarketListings(
					productClient.GenRecentListings("commission")
				)).data.pubkeys
			)
		)
	};

	useEffect(async ()=>{
		// await updateDigitalProducts();
		// await updatePhysicalProducts();
		// await updateCommissionProducts();
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
				{digitalProducts?.map((c, i) => {
					return(
						<ProductDisplayCardHome product={c} key={i}/>
					)
				})}

				{physicalProducts?.map((c, i) => {
					return(
						<ProductDisplayCardHome product={c} key={i}/>
					)
				})}

				{commissionProducts?.map((c, i) => {
					return(
						<ProductDisplayCardHome product={c} key={i}/>
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