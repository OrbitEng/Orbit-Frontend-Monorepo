import { Transition, Dialog, RadioGroup } from "@headlessui/react"
import { Fragment, useState, useEffect, useContext, useCallback} from "react"
import { ChevronDownIcon, XMarkIcon, ChevronUpIcon, BoltIcon, PencilIcon, TrashIcon, PlusIcon, ChevronLeftIcon } from "@heroicons/react/24/outline";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { ClearBgButtonSmall } from "../buttons/CustomRadioButton";
import { DigitalFunctionalities, PhysicalFunctionalities, CommissionFunctionalities } from "@functionalities/Transactions";

import ShippingCtx from "@contexts/ShippingCtx";
import PythClientCtx from "@contexts/PythClientCtx";
import UserAccountCtx from "@contexts/UserAccountCtx";
import Image from "next/image"
import { useRef } from "react";

export function DiscountsForm(props){
    console.log(props)
    const {pythClient} = useContext(PythClientCtx);

    let [discounts, setDiscounts] = useState(props.discounts);
    let [prodDiscounted, setProdDiscounted] = useState(props.prodDiscounted.slice());

    const updateDiscs = useCallback((index)=>{
        if(prodDiscounted[index]){
            setDiscounts(discounts+1)
        }else{
            setDiscounts(discounts-1)
        };
        prodDiscounted[index] = !prodDiscounted[index];
        setProdDiscounted(prodDiscounted);
    },[discounts])
    
    const confirmDiscs = ()=>{
        props.setDiscounts(discounts);
        props.setProdDiscounted(prodDiscounted.slice());
        props.setForm("checkout")
    }

    const [solPrice, setSolPrice] = useState();
    useEffect(async ()=>{
        if(!pythClient)return;
        if(props.solPrice){
            setSolPrice(props.solPrice)
        }else{
            setSolPrice((await pythClient.GetSolUsd()).aggregate.price);
        }
    },[pythClient, props.solPrice])

    return (
        <div className={"flex flex-col rounded-xl py-10 px-[4rem] w-full transition duration-700"}>
            <div className="relative top-0 right-0 flex py-2 pr-1 justify-between">
                <button
                    type="button"
                    className="rounded-full text-white hover:text-white p-1 focus:outline-none"
                    onClick={() => props.setForm("checkout")}
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
                <h1 className="text-3xl text-white font-bold">Discounts</h1>
            </div>	
            <div className="flex flex-row place-items-end w-full items-end justify-end">
                <div className="w-1/6 text-center text-white">{discounts} left!</div>
            </div>
            <div className={"w-full max-h-md border-y-[0.5px] border-[#535353] px-4 transition duration-700 transition-all h-80 overflow-y-auto scrollbar scrollbar-thumb-[#5B5B5B] scrollbar-track-[#8E8E8E] scrollbar-thumb-rounded-full scrollbar-track-rounded-full"}>
            {
                props.cart.items.map((item, index) => {
                    return(
                        <div key={index} className="flex flex-row rounded-md justify-between my-2 h-[104px]">
                            <div className="flex flex-row relative flex-grow  justify-items-center">
                                <div className="relative flex flex-col h-full rounded-md mr-3 justify-center">
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
                                <div className="flex flex-col h-full justify-self-end justify-center text-center w-fit truncate items-end pr-4">
                                    <span className="text-white font-bold -mb-1 truncate">{(item.data.metadata.price/solPrice).toFixed(9) + " SOL"}</span>
                                    <span className="text-white font-bold text-xs truncate">${item.data.metadata.price.toNumber()}</span>
                                </div>
                                <div className="flex flex-col h-full justify-self-end justify-center text-center w-1/6 border-l-[0.5px]">
                                    {(prodDiscounted[index] || (discounts>0)) &&<input
                                        type="checkbox"
                                        defaultChecked={prodDiscounted[index]}
                                        onChange={()=>{
                                            updateDiscs(index)
                                        }}
                                    />}
                                </div>
                            <div>
                            </div>
                        </div>
                    )
                })
            }
            </div>
            <button
                className={"py-4 px-8 z-[120] flex flex-row justify-center bg-[#008C1F3c] rounded-full mt-8 w-fit mx-auto opacity-100"}
                onClick={confirmDiscs}
            >
                <span className="text-transparent bg-clip-text bg-gradient-to-t from-[#19B500] to-white font-bold flex flex-row my-auto">
                    Save & Confirm
                </span>
            </button>
        </div>
    )
}