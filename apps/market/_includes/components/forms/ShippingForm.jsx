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

export function ShippingForm(props){
    const {shipping, setShipping} = useContext(ShippingCtx);

    const [firstName, setFirstName] = useState(shipping?.firstName || "");
	const [lastName, setLastName] = useState(shipping?.lastName || "");
	const [addr1, setAddr1] = useState(shipping?.addr1 || "");
	const [addr2, setAddr2] = useState(shipping?.addr2 || "");
	const [city, setCity] = useState(shipping?.city || "");
	const [zip, setZip] = useState(shipping?.zip || "");
	const [country, setCountry] = useState(shipping?.country || "");
	const [state, setState] = useState(shipping?.state || "");

    const [canSubmit, setCanSubmit] = useState(false);

    useEffect(()=>{
        if(firstName == "" || lastName == "" || addr1 == "" || city == "" || zip == "" || country == "" || state == "" ){
            setCanSubmit(false);
        }else{
            setCanSubmit(true)
        }
    },[firstName, lastName, addr1, addr2, city, zip, country, state])

    const submitShipping = useCallback(()=>{
        if(!canSubmit){
            return;
        }

        setShipping({
            updated: true,
            firstName: firstName,
            lastName: lastName,
            addr1: addr1,
            addr2: addr2,
            city: city,
            zip: zip,
            country: country,
            state: state
        });
        props.setForm("checkout");
    },[canSubmit])

    return(
        <div className={`flex flex-col rounded-xl py-10 px-[4rem] w-full transition duration-200`}>
            <div className="relative top-0 right-0 flex pt-1 pr-1 justify-between">
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
                <h1 className="text-3xl text-white font-bold">Shipping Address</h1>
            </div>								
            <div className="grid grid-flow-row grid-rows-4 grid-cols-2">
                <div className="flex flex-col justify-start m-2">
                    <span className="text-[#a19595] font-semibold font-lg">First Name</span>
                    <input
                        required
                        className="rounded-lg border-[2px] border-[#2D2D43] bg-[#242129] bg-opacity-60 px-2 py-2 text-white placeholder:text-[#433E4B] focus:outline-none"
                        value={firstName}
                        onChange={(e) => {setFirstName(e.target.value)}}
                    />
                </div>
                <div className="flex flex-col justify-start m-2">
                    <span className="text-[#a19595] font-semibold font-lg">Last Name</span>
                    <input
                        required
                        className="rounded-lg border-[2px] border-[#2D2D43] bg-[#242129] bg-opacity-60 px-2 py-2 text-white placeholder:text-[#433E4B] focus:outline-none"
                        value={lastName}
                        onChange={(e) => {setLastName(e.target.value)}}
                    />
                </div>
                <div className="flex flex-col justify-start m-2">
                    <span className="text-[#a19595] font-semibold font-lg">Address 1</span>
                    <input
                        required
                        className="rounded-lg border-[2px] border-[#2D2D43] bg-[#242129] bg-opacity-60 px-2 py-2 text-white placeholder:text-[#433E4B] focus:outline-none"
                        value={addr1}
                        onChange={(e) => {setAddr1(e.target.value)}}
                    />
                </div>
                <div className="flex flex-col justify-start m-2">
                    <span className="text-[#a19595] font-semibold">Address 2</span>
                    <input
                        className="rounded-lg border-[2px] border-[#2D2D43] bg-[#242129] bg-opacity-60 px-2 py-2 text-white placeholder:text-[#433E4B] focus:outline-none"
                        value={addr2}
                        onChange={(e) => {setAddr2(e.target.value)}}
                    />
                </div>
                <div className="flex flex-col justify-start m-2">
                    <span className="text-[#a19595] font-semibold">City</span>
                    <input
                        required
                        className="rounded-lg border-[2px] border-[#2D2D43] bg-[#242129] bg-opacity-60 px-2 py-2 text-white placeholder:text-[#433E4B] focus:outline-none"
                        value={city}
                        onChange={(e) => {setCity(e.target.value)}}
                    />
                </div>
                <div className="flex flex-col justify-start m-2">
                    <span className="text-[#a19595] font-semibold">State</span>
                    <input
                        className="rounded-lg border-[2px] border-[#2D2D43] bg-[#242129] bg-opacity-60 px-2 py-2 text-white placeholder:text-[#433E4B] focus:outline-none"
                        value={state}
                        onChange={(e) => {setState(e.target.value)}}
                    />
                </div>
                <div className="flex flex-col justify-start m-2">
                    <span className="text-[#a19595] font-semibold">Zip code</span>
                    <input
                        required
                        className="rounded-lg border-[2px] border-[#2D2D43] bg-[#242129] bg-opacity-60 px-2 py-2 text-white placeholder:text-[#433E4B] focus:outline-none"
                        value={zip}
                        onChange={(e) => {setZip(e.target.value)}}
                    />
                </div>
                <div className="flex flex-col justify-start m-2">
                    <span className="text-[#a19595] font-semibold">Country</span>
                    <input
                        required
                        className="rounded-lg border-[2px] border-[#2D2D43] bg-[#242129] bg-opacity-60 px-2 py-2 text-white placeholder:text-[#433E4B] focus:outline-none"
                        value={country}
                        onChange={(e) => {setCountry(e.target.value)}}
                    />
                </div>
            </div>
            <button
                className={"py-4 px-8 z-[120] flex flex-row justify-center bg-[#008C1F3c] rounded-full mt-8 w-fit mx-auto " + (canSubmit ? "opacity-100" : "opacity-30")}
                onClick={submitShipping}
                disabled={!canSubmit}
            >
                <span className="text-transparent bg-clip-text bg-gradient-to-t from-[#19B500] to-white font-bold flex flex-row my-auto">
                    Save & Confirm
                </span>
            </button>
        </div>
    )
}