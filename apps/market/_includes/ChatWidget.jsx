import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useContext, useEffect, useState, useRef, useCallback } from "react"
import { ChatBubbleLeftEllipsisIcon, ChevronLeftIcon, CloudArrowUpIcon, EnvelopeIcon, InformationCircleIcon, MagnifyingGlassIcon, PaperAirplaneIcon, PaperClipIcon, PencilSquareIcon, PlusCircleIcon, TagIcon, UserGroupIcon, XMarkIcon } from "@heroicons/react/24/outline";

import ChatCtx from "@contexts/ChatCtx";
import MatrixClientCtx from "@contexts/MatrixClientCtx";
import UserAccountCtx from "@contexts/UserAccountCtx";
import TransactionClientCtx from "@contexts/TransactionClientCtx";
import MarketAccountsCtx from "@contexts/MarketAccountsCtx";
import { ArrowUturnLeftIcon, ChevronDoubleLeftIcon } from "@heroicons/react/24/solid";
import { MarketAccountFunctionalities } from "@functionalities/Accounts";
import { CreateChatModal } from "@includes/components/modals/CreateChatModal";
import { Convos } from "@includes/components/chat/Convos";
import { Texts } from "@includes/components/chat/Texts";


export function ChatWidget(props) {
	const {chatState, setChatState} = useContext(ChatCtx);
	const [panel, setPanel] = useState("convos"); // can either be "convos" or "text"


	const [textRoom, setTextRoom] = useState({});

	const setTextRoomAndPanel = useCallback((roominfo)=>{
		setTextRoom(roominfo);
		setPanel("text")
	},[setPanel, setTextRoom])

	useEffect(() => {console.log(chatState)}, [chatState])

	return (
		<div className="fixed flex flex-col inset-y-0 right-0 z-[250]">
			<div 
				className={
					"pointer-events-auto transition-all duration-300 relative w-screen max-w-3xl flex flex-row z-[130] h-[30rem] mt-[20rem] mb-auto "
					+ (( chatState.isOpen ? (panel === "text" ? "max-w-3xl right-0" : "max-w-xl right-0") : " max-w-[3.5rem] right-0"))
				}
			>
				<div 
					className={"relative flex flex-col flex-shrink-0 w-14 pt-4 h-full bg-[#1D152C] z-[130] rounded-l-lg focus:outline-none"}
					onClick={() => {
						if(!chatState.isOpen) {
							setChatState(s => ({ ...s, isOpen: !chatState.isOpen}))
						}
					}}
				>
					<button
						className={"mx-auto h-6 w-6 transform transition-transform duration-200 text-white " + (chatState.isOpen && "rotate-180")}
						onClick={() => {
							setChatState(s => ({ ...s, isOpen: !chatState.isOpen}))
						}}
					>
						<ChevronDoubleLeftIcon className="mx-auto w-6 h-6" />
					</button>
					<div className="border-b-[1px] border-b-[#474747] mx-2 my-2"/>
					<button
						className={"mx-auto p-2 rounded-lg bg-opacity-30 " + (panel === "text" && "bg-[#383838]")}
						onClick={() => {
							setPanel("text")
						}}
					>
						<PaperAirplaneIcon className="h-6 w-6 mx-auto my-auto text-white" />
					</button>
					<button 
						className={"mx-auto p-2 rounded-lg bg-opacity-30 " + (panel === "convos" && "bg-[#383838]")}
						onClick={() => {
							setPanel("convos")
						}}
					>
						<UserGroupIcon className="h-6 w-6 mx-auto my-auto text-white" />
					</button>
					<button className="mt-auto py-3 bg-[#383838] bg-opacity-30 rounded-bl-lg">
						<PlusCircleIcon className="h-6 w-6 mx-auto text-white" />
					</button>
				</div>
				<div className="bg-gradient-to-t from-[#32254E78] to-[#26232C9C] relative w-full backdrop-blur-xl overflow-hidden">
					{
						((panel === "convos") && <Convos setTextRoomAndPanel={setTextRoomAndPanel}/>) ||
						((panel === "text") && <Texts textRoom={textRoom}/>)
					}
				</div>
			</div>
		</div>
				
	)
}