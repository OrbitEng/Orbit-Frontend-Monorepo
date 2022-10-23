import { Transition, Dialog, RadioGroup } from "@headlessui/react"
import { Fragment, useState, useEffect, useContext, useCallback} from "react"
import { ChevronDownIcon, XMarkIcon, ChevronUpIcon, BoltIcon, PencilIcon, TrashIcon, PlusIcon, ChevronLeftIcon } from "@heroicons/react/24/outline";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { ClearBgButtonSmall } from "../buttons/CustomRadioButton";

import ShippingCtx from "@contexts/ShippingCtx";
import PythClientCtx from "@contexts/PythClientCtx";
import UserAccountCtx from "@contexts/UserAccountCtx";

import { DigitalFunctionalities, PhysicalFunctionalities, CommissionFunctionalities } from "@functionalities/Transactions";


import Image from "next/image"

const TOKEN_PROGRAM_ID = new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA');
const ASSOCIATED_TOKEN_PROGRAM_ID = new PublicKey('ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL');
const USDC_MINT = {
	"mainnet": new PublicKey("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"),
	"devnet": new PublicKey("4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU")
}

function getAssociatedTokenAddress(
    mint,
    owner
){
    const address = PublicKey.findProgramAddressSync(
        [owner.toBuffer(), TOKEN_PROGRAM_ID.toBuffer(), mint.toBuffer()],
        ASSOCIATED_TOKEN_PROGRAM_ID
    )[0];
    return address;
}

export default function PosModal(props) {
	let wallet = useWallet();
	let connection = useConnection();
	const {shipping, setShipping} = useContext(ShippingCtx)
	const {pythClient} = useContext(PythClientCtx);
	const {userAccount} = useContext(UserAccountCtx);

	const [expanded, setExpanded] = useState(true);
	const [solBalance, setSolBalance] = useState(0);
	const [usdcBalance, setUsdcBalance] = useState(0);
	const [openShippingForm, setOpenShippingForm] = useState(false);
	const [currency, setCurrency] = useState("solana")
	const [solPrice, setSolPrice] = useState();

	// Shipping fields
	const [firstName, setFirstName] = useState(shipping?.firstName || "");
	const [lastName, setLastName] = useState(shipping?.lastName || "");
	const [addr1, setAddr1] = useState(shipping?.addr1 || "");
	const [addr2, setAddr2] = useState(shipping?.addr2 || "");
	const [city, setCity] = useState(shipping?.city || "");
	const [zip, setZip] = useState(shipping?.zip || "");
	const [country, setCountry] = useState(shipping?.country || "");
	const [state, setState] = useState(shipping?.state || "");

	const [usdcAmountDue, setUsdcAmountDue] = useState(0);
	const [solAmountDue, setSolAmountDue] = useState(0);

	const {OpenTransactionSol: openPhysicalSol, OpenTransactionSpl: openPhysicalSpl} = PhysicalFunctionalities()
	const {OpenTransactionSol: openDigitalSol, OpenTransactionSpl: openDigitalSpl} = DigitalFunctionalities()
	const {OpenTransactionSol: openCommissionSol, OpenTransactionSpl: openCommissionSpl} = CommissionFunctionalities()

	const submitOrder = useCallback(async ()=>{
		switch(currency){
			case "solana":
				for(let item of props.cart.items){
					switch(item.type){
						case "physical":
							await openPhysicalSol(
								item,
								false
							)
							break;
						case "digital":
							await openDigitalSol(
								item,
								false
							)
							break;
						case "commission":
							await openCommissionSol(
								item,
								false
							)
							break;
					}
				}
				break;
			case "usdc":
				for(let item of props.cart.items){
					switch(item.type){
						case "physical":
							await openPhysicalSpl(
								item,
								false,
								USDC_MINT[process.env.NEXT_PUBLIC_CLUSTER_NAME]
							)
							break;
						case "digital":
							await openDigitalSpl(
								item,
								false,
								USDC_MINT[process.env.NEXT_PUBLIC_CLUSTER_NAME]
							)
							break;
						case "commission":
							await openCommissionSpl(
								item,
								false,
								USDC_MINT[process.env.NEXT_PUBLIC_CLUSTER_NAME]
							)
							break;
					}
					
				}
				break;
		}

	},[usdcAmountDue, solAmountDue, currency, firstName, lastName, addr1, addr2, city, zip, country, state])

	useEffect(()=>{
		setUsdcAmountDue(Number(props.cart.total.toFixed(6)));
		setSolAmountDue(Number((props.cart.total * (solPrice)).toFixed(9)));
	},[props.cart, props.cart.total])

	useEffect(async ()=>{
		if(!pythClient)return;
		if(props.solPrice){
			setSolPrice(props.solPrice)
		}else{
			setSolPrice((await pythClient.GetSolUsd()).aggregate.price);
		}
	},[pythClient, props.solPrice])

	useEffect(async () => {
		try {
			setSolBalance(await connection.connection.getBalance(wallet.publicKey));
		} catch(e) {
			console.log(e)
		}

		try{
			let usdcbal = await connection.connection.getTokenAccountBalance(
				getAssociatedTokenAddress(
					USDC_MINT[process.env.NEXT_PUBLIC_CLUSTER_NAME],
					wallet.publicKey
				)
			);
			setUsdcBalance(usdcbal.value.uiAmount.toString())
		}catch(e){
			console.log(e);
			setUsdcBalance(0);
		}

	}, [connection, wallet.connected])	
	
	return(
		<Transition appear show={props.openPos} as={Fragment}>
			<Dialog as="div" className="relative z-[120]" onClose={() => props.setOpenPos(true)}>
			<Transition.Child
				as={Fragment}
				enter="ease-out duration-300"
				enterFrom="opacity-0"
				enterTo="opacity-100"
				leave="ease-in duration-200"
				leaveFrom="opacity-100"
				leaveTo="opacity-0"
			>
				<div className="fixed inset-0 backdrop-blur" />
			</Transition.Child>
			<div className="fixed inset-0 overflow-y-auto">
				<div className="flex min-h-full items-center justify-center p-4 text-center">
				<Transition.Child
					as={Fragment}
					enter="ease-out duration-300"
					enterFrom="opacity-0 scale-95"
					enterTo="opacity-100 scale-100"
					leave="ease-in duration-200"
					leaveFrom="opacity-100 scale-100"
					leaveTo="opacity-0 scale-95"
				>
					<Dialog.Panel className={`w-full ${openShippingForm ? "max-w-2xl" : "max-w-lg"} transform overflow-hidden rounded-2xl backdrop-blur bg-gradient-to-t from-[#32254EB3] to-[#26232CE6] border-t-[0.5px] border-[#474747] text-left align-middle shadow-xl transition-all duration-200`}>
					{ openShippingForm != true ? (
						<div className="rounded-xl max-w-lg py-10 px-[4rem] mx-auto w-max">
							<div className="relative top-0 right-0 flex pt-1 justify-end">
								<button
									type="button"
									className="rounded-full text-white hover:text-white p-1 border-[#5b5b5b] border-[1px] focus:outline-none"
									onClick={() => props.setOpenPos(false)}
								>
									<span className="sr-only">Close panel</span>
									<XMarkIcon className="h-6 w-6 text-[#e2e2e2]" aria-hidden="true" />
								</button>
							</div>
							<div className="flex flex-col mb-8">
								<h1 className="text-3xl text-white font-bold">Order Summary</h1>
								<span className="text-[#848484] font-bold truncate w-1/2">
									{"Wallet: " + wallet.publicKey}
								</span>
							</div>
							<div className="flex flex-col px-4 py-4">
								<div className="flex flex-row justify-between align-middle">
									<span className="my-auto text-xl font-bold text-[#E7E7E7]">{"ITEMS(" + (props?.cart?.items?.length || 0) + ")"}</span>
									<button onClick={()=>{setExpanded(!expanded)}}>
										<ChevronUpIcon className={"text-[#797979] h-4 w-4 stroke-[4px] transition duration-700 " + (expanded ? "rotate-0" : " rotate-180") } />
									</button>
								</div>
							</div>
							<div className={"w-full max-h-md border-y-[0.5px] border-[#535353] px-4 transition duration-700 transition-all "+(expanded ? "h-80 overflow-y-auto scrollbar-thumb-[#5B5B5B] scrollbar-track-[#8E8E8E] scrollbar-thumb-rounded-full scrollbar-track-rounded-full" : "h-[118px] overflow-hidden")}>
							{
								props?.cart?.items?.map((item, index) => {
									return(
										<div key={index} className="flex flex-row rounded-md justify-between my-2 h-[104px] px-2">
											<div className="flex flex-row relative flex-grow  justify-items-center">
												<div className="relative flex flex-col h-full rounded-md mr-3 justify-center">
													<button 
														onClick={() => {
															props.setCart(propscart => ({
																items:[...propscart.items.slice(0,index), ...propscart.items.slice(index+1)],
																total: propscart.total - item.data.metadata.price
															}))
														}}
														className="inline-flex z-[120] absolute font-serif bg-red-500 bg-opacity-80 top-2 -right-1 h-4 w-4 rounded-full justify-center items-center text-xs"
													>
														<XMarkIcon className="h-3 w-3 text-white stroke-[3px]"/>
													</button>
													<div className="relative w-[80px] h-[80px]">
														<Image 
															className="rounded-md"
															layout="fill"
															src={(item?.data?.metadata?.media?.length && item.data.metadata.media[0]) || "/demologos.png"}
															objectFit="cover"
														/>
													</div>
												</div>
												<div className="flex flex-col flex-grow h-full justify-center text-lg ">
													<span className="text-white font-bold -mb-1">{item.data.metadata.info.name}</span>
													<span className="text-[#868686] text-xs">{item.data.metadata.seller.data.metadata.name}</span>
												</div>
											</div>
											<div className="">
												{
													currency == "solana" ? 
													<div className="flex flex-col h-full justify-self-end justify-center text-center w-fit truncate items-end">
														{/* <input
															type="number"
															value={solAmountDue || 0}
															onChange={(e)=>{
																let val = (Number(e.target.value)).toFixed(9);
																setSolAmountDue(Number(val));
																setUsdcAmountDue(Number((Number(val)/solPrice).toFixed(6)))
															}}
															className="bg-transparent text-end pr-2"
														/> */}
														<span className="text-white font-bold -mb-1 truncate">{(item.data.metadata.price/solPrice).toFixed(9) + " SOL"}</span>
														<span className="text-white font-bold text-xs truncate">${item.data.metadata.price.toNumber()}</span>
													</div>
													:
													<div className="flex flex-col h-full justify-self-end justify-center text-center w-fit truncate items-end">
														{/* <input
															type="number"
															value={usdcAmountDue || 0}
															onChange={(e)=>{
																let val = (Number(e.target.value)).toFixed(6);
																setUsdcAmountDue(Number(val));
																setSolAmountDue(Number((Number(val)*solPrice).toFixed(9)))
															}}
															className={"bg-transparent text-start w-20"}
														/> */}
														<span className="text-white font-bold -mb-1 truncate">${item.data.metadata.price.toNumber()}</span>
														<span className="text-white font-bold text-xs truncate">{(item.data.metadata.price/solPrice).toFixed(9) + " SOL"}</span>
													</div>
												}
												
											</div>
										</div>
									)
								})
							}
							</div>
							
							<div className="flex flex-col mt-8 ">
								<div className="text-center text-[#A3A3A3] font-bold text-2xl ">
									Payment Method
								</div>
								<div className="rounded-lg flex flex-row px-4 text-white h-12 ">
									<div className="w-full flex flex-row justify-center items-center h-full gap-x-2"  onClick={()=>{setCurrency("usdc")}}>
										<ClearBgButtonSmall
											checked={currency == "usdc"}
										/>
										<Image
											src="/usdcSvgLogo.svg"
											width={30}
											height={30}
											objectFit="contain"
										/>
									</div>
									<div className="w-full flex flex-row justify-center items-center h-full gap-x-2"  onClick={()=>{setCurrency("solana")}}>
										<ClearBgButtonSmall
											checked={currency == "solana"}
										/>
										<Image
											src="/solanaSvgLogo.svg"
											width={30}
											height={30}
											objectFit="contain"
										/>
									</div>
								</div>
							</div>

							{wallet.connected == true &&
							<div className="rounded-lg flex flex-row px-4 py-2 bg-[#5F5F5F] bg-opacity-30 mt-3 align-middle justify-between">
								<div
									className="flex flex-row gap-x-2 group cursor-pointer group basis-1/2 overflow-hidden"
								>
									<div className="flex flex-row gap-x-2 absolute transition duration-300 opacity-0 group-hover:opacity-100">
										<button onClick={() => wallet.disconnect()} className="hover:bg-opacity-40 text-md font-semibold z-50 text-white truncate bg-[#5F5F5F] bg-opacity-20 py-1 px-2 rounded-lg w-fit text-center my-2 transition duration-300">Disconnect</button>
										<button onClick={() => navigator.clipboard.writeText(wallet.publicKey.toString())} className="hover:bg-opacity-40 text-md font-semibold z-50 text-white truncate bg-[#5F5F5F] bg-opacity-20 py-1 px-2 rounded-lg w-fit text-center my-2 transition duration-300">Copy</button>
									</div>
									<div className="relative flex flex-shrink-0 h-9 w-9 overflow-hidden my-2 group-hover:opacity-0 transition duration-300">
										<Image
											src={wallet.wallet?.adapter?.icon}
											width={50}
											height={50}
											objectFit="contain"
										/>
									</div>
									<div className="flex flex-col align-middle my-auto group-hover:opacity-0 transition duration-300 flex-grow-0 truncate">
										<span className="text-[#A4A4A4] truncate text-xs">{wallet.wallet.adapter.name}</span>
										<span className="font-semibold text-white truncate text-sm -mt-1">{wallet.publicKey+""}</span>
									</div>
								</div>
								<div className="align-middle bg-[#5F5F5F] backdrop-blur bg-opacity-20 flex flex-row gap-x-[6px] rounded px-2 my-auto basis-6/10">
									<span className="font-semibold text-[#989898] text-sm">Connected Wallet</span>
									<div className="bg-green-500 rounded-full my-auto">
										<div className="bg-green-500 rounded-full h-2 w-2 my-auto animate-ping" />
									</div>
								</div>
							</div>
							}
							<div className="rounded-lg flex flex-row px-4 py-4 bg-[#5F5F5F] bg-opacity-30 mt-3 align-middle overflow-hidden">
							{
								shipping?.updated == true ? 
								<div className={`transition duration-200 flex flex-row flex-grow align-middle justify-around overflow-hidden ${openShippingForm ? "opacity-0" : "opacity-100"}`}>
									<div className="flex flex-col align-middle basis-2/5 flex-grow-0">
										<h3 className="font-bold text-white">Name</h3>
										<span className="text-[#BDBDBD] text-xs truncate">{
											(shipping?.firstName && shipping?.lastName) ? (shipping?.firstName + " " + shipping?.lastName ) : "n/a"}</span>
									</div>
									<div className="flex flex-col align-middle basis-2/5 flex-grow-0">
										<h3 className="font-bold text-white">Address</h3>
										<span className="text-[#BDBDBD] text-xs truncate">{shipping?.addr1 || "n/a"}</span>
									</div>
									<div className="flex flex-col align-middle basis-1/5 flex-grow-0 my-auto">
										<div className="flex flex-row justify-center">
											<button
												className="rounded bg-[#212121] mx-1 p-1"
												onClick={() => {setOpenShippingForm(true)}}
											>
												<PencilIcon className="h-4 w-4 text-white"/>
											</button>
											<button 
												className="rounded bg-[#212121] mx-1 p-1"
												onClick={() => setShipping({
													updated: false,
													firstName:"",
													lastName:"",
													addr1:"",
													addr2:"",
													city:"",
													zip:"",
													country:"",
													state:""
												})}
											>
												<TrashIcon className="h-4 w-4 text-red-500"/>
											</button>
										</div>
									</div>
								</div>
							: 
								<button
									className="flex flex-row align-middle bg-transparent justify-center mx-auto"
									onClick={() => {setOpenShippingForm(true)}}
								>
									<div className="my-auto mx-auto rounded-full bg-[#2E813B] bg-opacity-30 p-1 mr-2">
										<PlusIcon className="h-6 w-6 text-[#2E813B] opacity-70" />
									</div>
									<span className="font-semibold text-white my-auto text-sm mx-auto">Add Shipping Address</span>
								</button>
							}
							</div>
							<div className="rounded-lg flex flex-col mt-4 justify-between px-8 border-[1px] border-[#5F5F5F] text-white font-bold divide-y-[1px] divide-[#5F5F5F]">
								<div className="flex flex-row justify-between py-3">
									<span className="my-auto">Balance:</span>
									
										{
											currency == "solana" ? 
												<div className="flex flex-col items-end">
													<span>{(solBalance / LAMPORTS_PER_SOL).toString().slice(0,5) + " SOL"}</span>
													<span className="text-xs font-normal">${usdcBalance}</span>
												</div>
											:
												<div className="flex flex-col items-end">
													<span>${usdcBalance}</span>
													<span className="text-xs font-normal">{(solBalance / LAMPORTS_PER_SOL).toString().slice(0,5) + " SOL"}</span>
												</div>
										}
									
								</div>
								<div className="flex flex-row justify-between py-3">
									<span className="my-auto">Amount Due:</span>
									{
										currency == "solana" ? 
											<div className="flex flex-col w-full items-end">
												<span>{solAmountDue} SOL</span>
												<span className="text-xs font-normal">${usdcAmountDue}</span>
											</div>
											:
											<div className="flex flex-col w-full items-end">
												<span>${usdcAmountDue}</span>
												<span className="text-xs font-normal">{(solAmountDue.toFixed(9) || 0) + " SOL"}</span>
											</div>
									}
								</div>
							</div>
							<button
								className="py-4 px-8 z-[120] flex flex-row justify-center bg-[#008C1F2c] rounded-full mt-4 w-fit mx-auto"
							>
								<span className="text-transparent bg-clip-text bg-gradient-to-t from-[#19B500] to-white font-bold flex flex-row my-auto">
									<BoltIcon className="h-4 w-4 text-[#7fff6b] stroke-2 my-auto mr-1 " />
									Confirm Purchase
								</span>
							</button>
						</div>
					) : (
						<div className={`flex flex-col rounded-xl py-10 px-[4rem] w-full transition duration-200 ${openShippingForm ? "opacity-100" : "opacity-0"}`}>
							<div className="relative top-0 right-0 flex pt-1 pr-1 justify-between">
								<button
									type="button"
									className="rounded-full text-white hover:text-white p-1 focus:outline-none"
									onClick={() => setOpenShippingForm(false)}
								>
									<span className="sr-only">Back to checkout</span>
									<ChevronLeftIcon className="h-6 w-6 text-[#e2e2e2]" aria-hidden="true" />
								</button>
								<button
									type="button"
									className="rounded-full text-white hover:text-white p-1 border-[#5b5b5b] border-[1px] focus:outline-none"
									onClick={() => props.setOpenPos(false)}
								>
									<span className="sr-only">Close panel</span>
									<XMarkIcon className="h-6 w-6 text-[#e2e2e2]" aria-hidden="true" />
								</button>
							</div>
							<div className="flex flex-col mt-3 mb-4 mr-auto">
								<h1 className="text-3xl text-white font-bold">Shipping Address</h1>
							</div>								
							<div className="grid grid-flow-row grid-rows-4 grid-cols-2">
								<div className="flex flex-col justify-start m-2">
									<span className="text-[#938989] font-semibold font-lg">First Name</span>
									<input
										required
										className="rounded-lg border-[2px] border-[#2D2D43] bg-[#242129] bg-opacity-60 px-2 py-2 text-white placeholder:text-[#433E4B] focus:outline-none"
										value={firstName}
										onChange={(e) => {setFirstName(e.target.value)}}
									/>
								</div>
								<div className="flex flex-col justify-start m-2">
									<span className="text-[#938989] font-semibold font-lg">Last Name</span>
									<input
										required
										className="rounded-lg border-[2px] border-[#2D2D43] bg-[#242129] bg-opacity-60 px-2 py-2 text-white placeholder:text-[#433E4B] focus:outline-none"
										value={lastName}
										onChange={(e) => {setLastName(e.target.value)}}
									/>
								</div>
								<div className="flex flex-col justify-start m-2">
									<span className="text-[#938989] font-semibold font-lg">Address 1</span>
									<input
										required
										className="rounded-lg border-[2px] border-[#2D2D43] bg-[#242129] bg-opacity-60 px-2 py-2 text-white placeholder:text-[#433E4B] focus:outline-none"
										value={addr1}
										onChange={(e) => {setAddr1(e.target.value)}}
									/>
								</div>
								<div className="flex flex-col justify-start m-2">
									<span className="text-[#938989] font-semibold">Address 2</span>
									<input
										className="rounded-lg border-[2px] border-[#2D2D43] bg-[#242129] bg-opacity-60 px-2 py-2 text-white placeholder:text-[#433E4B] focus:outline-none"
										value={addr2}
										onChange={(e) => {setAddr2(e.target.value)}}
									/>
								</div>
								<div className="flex flex-col justify-start m-2">
									<span className="text-[#938989] font-semibold">City</span>
									<input
										required
										className="rounded-lg border-[2px] border-[#2D2D43] bg-[#242129] bg-opacity-60 px-2 py-2 text-white placeholder:text-[#433E4B] focus:outline-none"
										value={city}
										onChange={(e) => {setCity(e.target.value)}}
									/>
								</div>
								<div className="flex flex-col justify-start m-2">
									<span className="text-[#938989] font-semibold">Zip code</span>
									<input
										required
										className="rounded-lg border-[2px] border-[#2D2D43] bg-[#242129] bg-opacity-60 px-2 py-2 text-white placeholder:text-[#433E4B] focus:outline-none"
										value={zip}
										onChange={(e) => {setZip(e.target.value)}}
									/>
								</div>
								<div className="flex flex-col justify-start m-2">
									<span className="text-[#938989] font-semibold">Country</span>
									<input
										required
										className="rounded-lg border-[2px] border-[#2D2D43] bg-[#242129] bg-opacity-60 px-2 py-2 text-white placeholder:text-[#433E4B] focus:outline-none"
										value={country}
										onChange={(e) => {setCountry(e.target.value)}}
									/>
								</div>
								<div className="flex flex-col justify-start m-2">
									<span className="text-[#938989] font-semibold">State</span>
									<input
										className="rounded-lg border-[2px] border-[#2D2D43] bg-[#242129] bg-opacity-60 px-2 py-2 text-white placeholder:text-[#433E4B] focus:outline-none"
										value={state}
										onChange={(e) => {setState(e.target.value)}}
									/>
								</div>
							</div>
							<button
								className="py-4 px-8 z-[120] flex flex-row justify-center bg-[#008C1F2c] rounded-full mt-8 w-fit mx-auto"
								onClick={() => {
									setShipping({
									updated: true,
									firstName: firstName,
									lastName: lastName,
									addr1: addr1,
									addr2: addr2,
									city: city,
									country: country,
									state: state
									});
									setOpenShippingForm(false);
								}}
							>
								<span className="text-transparent bg-clip-text bg-gradient-to-t from-[#19B500] to-white font-bold flex flex-row my-auto">
									Save & Confirm
								</span>
							</button>
						</div>
					) 
					}
					</Dialog.Panel>
				</Transition.Child>
				</div>
			</div>
			</Dialog>
		</Transition>
	)
}