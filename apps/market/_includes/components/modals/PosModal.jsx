import { Transition, Dialog, RadioGroup } from "@headlessui/react"
import { Fragment, useState, useEffect, useContext, useCallback} from "react"
import { ChevronDownIcon, XMarkIcon, ChevronUpIcon, BoltIcon, PencilIcon, TrashIcon, PlusIcon, ChevronLeftIcon } from "@heroicons/react/24/outline";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { ClearBgButtonSmall } from "../buttons/CustomRadioButton";
import { DigitalFunctionalities, PhysicalFunctionalities, CommissionFunctionalities } from "@functionalities/Transactions";

import UserAccountCtx from "@contexts/UserAccountCtx";
import Image from "next/image"
import { CheckoutForm } from "../forms/CheckoutForm";
import { ShippingForm } from "../forms/ShippingForm";
import { DiscountsForm } from "../forms/DiscountsForm";

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
	const [pageForm, setPageForm] = useState("checkout");
	
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
					<Dialog.Panel className={`w-full max-w-2xl transform overflow-hidden rounded-2xl backdrop-blur bg-gradient-to-t from-[#32254EB3] to-[#26232CE6] border-t-[0.5px] border-[#474747] text-left align-middle shadow-xl transition-all duration-200`}>
					{
						(pageForm == "checkout" && <CheckoutForm setForm={setPageForm} {...props}/>) ||
						(pageForm == "shipping" && <ShippingForm setForm={setPageForm}  {...props}/>) ||
						(pageForm == "dispute" && <DiscountsForm setForm={setPageForm} />)
					}
					</Dialog.Panel>
				</Transition.Child>
				</div>
			</div>
			</Dialog>
		</Transition>
	)
}