import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useContext, useEffect, useState } from "react"
import { ChatBubbleLeftEllipsisIcon, ChevronLeftIcon, CloudArrowUpIcon, EnvelopeIcon, InformationCircleIcon, MagnifyingGlassIcon, PaperAirplaneIcon, PaperClipIcon, PencilSquareIcon, TagIcon, UserGroupIcon, XMarkIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import UserAccountCtx from "@contexts/UserAccountCtx";
import ChatCtx from "@contexts/ChatCtx";
import { ChevronDoubleLeftIcon } from "@heroicons/react/24/solid";


export function ChatWidget(props) {
	const {userAccount, setUserAccount} = useContext(UserAccountCtx);
	const [chatSearch, setChatSearch] = useState();
	const [chatMessage, setChatMessage] = useState();
	const {chatState, setChatState} = useContext(ChatCtx);
	const [panel, setPanel] = useState("collapsed"); // can either be "convos" or "text"

	function classNames(...classes) {
		return(classes.filter(Boolean).join(' '))
	}

	useEffect(() => {console.log(chatState)}, [chatState])

	return (
		<div className="fixed flex flex-col inset-y-0 right-0 mt-[40rem]">
			<div className={"pointer-events-auto transition-all duration-300 right-0 relative w-screen flex flex-row z-[130] h-96 " + (( chatState.isOpen ? (panel === "text" ? "max-w-3xl" : "max-w-md") : " max-w-[3.5rem]")) }>
				<button 
					className={"relative flex flex-col flex-shrink-0 w-14 h-full bg-[#251F30] z-[130] rounded-l-lg focus:outline-none"}
					onClick={() => {setChatState(s => ({ ...s, isOpen: !chatState.isOpen}))}}
				>
					<div className="my-auto mx-auto">
						<EnvelopeIcon className="h-6 w-6 stroke-2 text-white" />
					</div>
				</button>
				<div className={"bg-white relative w-full"}>
				Hello
				</div>
			</div>
		</div>
				
	)
}

function Message(props) {
	return(
		<div className="flex flex-row w-max-[50%] gap-x-2 my-2">
			<div className="flex flex-col">
				<div className="relative text-[#5C5C5C] text-xs text-left mb-1">hh:mm</div>
				<div className="flex flex-row gap-x-2">
					<div className="relative flex h-8 w-8 rounded-full overflow-hidden">
						<Image 
							layout="fill"
							src={props?.vendor?.profilePic || "https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50?d=mp&f=y"}
							objectFit="cover"
						/>
					</div>
					<div className="rounded bg-[#6A31B2] bg-opacity-20 text-[#949494] py-1 px-2 text-sm my-auto">{props.text}</div>
				</div>
			</div>
		</div>
	)
}


function SelfMessage(props) {
	return(
		<div className="flex flex-row w-max-[50%] gap-x-2 my-2 justify-end">
			<div className="flex flex-col">
				<div className="relative text-[#5C5C5C] text-xs text-right mb-1">hh:mm</div>
				<div className="rounded bg-[#9E3B88] bg-opacity-20 text-[#949494] py-1 px-2 text-sm">{props.text}</div>
			</div>
		</div>
	)
}

function ContractRequest(props) {
	return(
		<div className="flex flex-row w-max-[50%] my-2 justify-end">
			<div className="flex flex-row rounded-lg bg-[#9E3B88] bg-opacity-20 p-6 my-auto w-[22rem] h-44 justify-between">
				<div className="flex flex-col basis-1/2 flex-shrink-0">
					<div className="flex flex-col">
						<span className="font-bold text-md text-white truncate -mb-1">{props.requestName}</span>
						<span className="text-xs text-[#6A6A6A] truncate">{"from | " + (props?.fromUser || "@someusername")}</span>
					</div>
					<div className="border-t-[1px] border-[#868686] w-full">
						<p className="text-xs text-[#505050] my-1 truncate">
							{props.itemdesc || "No description provided!"}
						</p>
					</div>
					<div className="flex flex-row justify-between mt-auto">
						<button
							className="rounded-full px-3 py-1 bg-[#1C6427] bg-opacity-20 border-[1px] border-[#3B8472] text-[#3B8472] text-sm mx-1 my-auto"
							onClick={() => {
							}}
						>
							Accept
						</button>
						{/* fix the text color this is hard to read */}
						<button
							className="rounded-full px-3 py-1 bg-[#742525] bg-opacity-20 text-[#742525] border-[1px] border-[#742525] text-sm mx-1 my-auto"
							onClick={() => {
							}}
						>Decline</button>
					</div>
				</div>
				<div className="flex relative flex-shrink-0 flex-col basis-1/2 overflow-hidden">
					<Image 
						src={props.reqImage || "/demoLogos.png"}
						layout="fill"
						objectFit="contain"
					/>
				</div>
			</div>
		</div>
	)
}

function SelfContractRequest() {
	return("fuck")
}