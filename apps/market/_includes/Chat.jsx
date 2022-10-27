import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useContext, useEffect, useState, useRef } from "react"
import { ChatBubbleLeftEllipsisIcon, ChevronLeftIcon, CloudArrowUpIcon, EnvelopeIcon, InformationCircleIcon, MagnifyingGlassIcon, PaperAirplaneIcon, PaperClipIcon, PencilSquareIcon, PlusCircleIcon, TagIcon, UserGroupIcon, XMarkIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import UserAccountCtx from "@contexts/UserAccountCtx";
import ChatCtx from "@contexts/ChatCtx";
import MatrixClientCtx from "@contexts/MatrixClientCtx";
import { ArrowUturnLeftIcon, ChevronDoubleLeftIcon } from "@heroicons/react/24/solid";
import { CreateChatModal } from "@includes/components/modals/CreateChatModal";
import ReCAPTCHA from "react-google-recaptcha";


export function ChatWidget(props) {
	const {userAccount, setUserAccount} = useContext(UserAccountCtx);
	const {matrixClient} = useContext(MatrixClientCtx);
	const [chatSearch, setChatSearch] = useState();
	const [chatMessage, setChatMessage] = useState();
	const {chatState, setChatState} = useContext(ChatCtx);
	const [panel, setPanel] = useState("convos"); // can either be "convos" or "text"
	const messageBottomRef = useRef(null);

	const [hasChat, setHasChat] = useState(true);

	useEffect(async()=>{
		if(!matrixClient)return;
		try{
			console.log("logging in")
			let login_res = await matrixClient.Login();
			console.log("logged in", login_res)
		}catch(e){
			setHasChat(false);
			console.log("has chat set to false", e)
		}
	},[matrixClient])

	useEffect(() => {console.log(chatState)}, [chatState])
	useEffect(() => {
		messageBottomRef.scrollIntoView
	})

	return (
		<div className="fixed flex flex-col inset-y-0 right-0">
			{(!hasChat) && <CreateChatModal setChat = {setHasChat}/>}
			<div 
				className={
					"pointer-events-auto transition-all duration-300 relative w-screen flex flex-row z-[130] h-[30rem] mt-[20rem] mb-auto "
					+ (( chatState.isOpen ? (panel === "text" ? "max-w-3xl right-0" : "max-w-md right-0") : " max-w-[3.5rem] right-0"))
				}
			>
				<div 
					className={"relative flex flex-col flex-shrink-0 w-14 pt-4 h-full bg-[#1D152C] z-[130] rounded-l-lg focus:outline-none"}
					onClick={() => {if(!chatState.isOpen) {
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
					{panel === "convos" ? (
						<div className="flex flex-col w-full h-full px-3 pt-3 flex-shrink-0 bg-gradient-to-t from-[#2917514D] to-[#1D045178]">
							<div className="flex flex-col">
								<div className="relative flex flex-shrink-0 h-16 w-16 rounded-full overflow-hidden mx-auto mt-10">
									<Image 
										layout="fill"
										src={userAccount?.data?.profilePic || "https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50?d=mp&f=y"}
										objectFit="cover"
									/>
								</div>
								<span className="font-bold text-2xl text-white mx-auto truncate">{userAccount?.data?.metadata?.name}</span>
								<span className="font-semibold text-sm text-[#515661] truncate mx-14">{("@" + userAccount?.address.toString())}</span>
								<div className="flex flex-row bg-white bg-opacity-5 p-2 rounded-lg gap-x-1 mt-4 mx-12">
									<MagnifyingGlassIcon className="h-4 w-4 my-auto text-[#5F5F5F]"/>
									<input
										className="bg-transparent text-sm outline-none text-[#515661] placeholder:text-[#5F5F5F]"
										type="text"
										placeholder="Search"
										value={chatSearch}
										onChange={(e) => {setChatSearch(e.target.value)}}
									/>
								</div>
							</div>
							<div className="flex flex-col mt-6 overflow-hidden">
								<span className="text-white text-xs font-bold p-2">Messages <span className="text-blue-500">{chatState?.unRead > 0 && " (" + chatState?.unRead + ")"}</span></span>
								<div className="flex flex-col overflow-y-scroll">
									<Conversation />
									<Conversation />
									<Conversation />
									<Conversation />
								</div>
							</div>
						</div>
						) : (
						<div className="flex flex-col w-full h-full flex-shrink-0 bg-gradient-to-t from-[#29175180] to-[#1D045180]">
							<div className="sticky w-full bg-[#2C2638] bg-opacity-30 rounded-b-lg">
								<div className="flex flex-row my-auto rounded-lg w-full gap-x-3 p-3 bg-transparent">
									<div className="relative flex h-8 w-8 rounded-full overflow-hidden">
										<Image 
											layout="fill"
											src={props?.vendor?.profilePic || "https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50?d=mp&f=y"}
											objectFit="cover"
										/>
									</div>
									<div className="flex flex-col my-auto text-white font-bold text-xl align-middle justify-start">
										<span className="text-sm -mb-[3px]">{props?.vendor?.nickname || "UserName"}</span>
										<span className="text-[#535353] text-xs font-normal">{"@somemarketaddress"}</span>
									</div>
									<button 
										className="bg-transparent ml-auto"
										onClick={() => {}}
									>
										<InformationCircleIcon className="h-6 w-6 text-[#6D6D6D] stroke-2" />
									</button>
								</div>
							</div>
							<div className="px-5 overflow-y-scroll scrolling-touch">
								<div className="relative flex flex-col flex-grow">
									{/* something something insert conditional for messages here */}
									<Message text="hello"/>
									<SelfMessage text="hello" />
									<Message text="hello"/>
									<SelfMessage text="hello" />
									<Message text="hello"/>
									<SelfMessage text="hello" />
									<Message text="hello"/>
									<SelfMessage text="hello" />
									<Message text="hello"/>
									<SelfMessage text="hello" />
									<Message text="hello"/>
									<SelfMessage text="hello" />
									<Message text="hello"/>
									<SelfMessage text="hello" />
									<SelfMessage text="hello" />
									<Message text="hello"/>
									<Message text="hello"/>
									<SelfMessage text="hello" />
									<Message text="hello"/>
									<SelfMessage text="hello" />
									<Message text="hello"/>
									<SelfMessage text="hello" />
									<Message text="hello"/>
									<Message text="hello"/>
									<Message text="hello"/>
									<Message text="hello"/>
									<Message text="hello"/>
									<Message text="hello"/>
									<Message text="hello"/>
									<Message text="hello"/>
									<Message text="hello"/>
									<Message text="hello"/>
									<ContractRequest autoFocus requestName="Custom Logo" />
									<div ref={messageBottomRef}/>
								</div>
							</div>
							<div className="sticky flex flex-row mx-3 bottom-0 mb-4 inset-x-0 p-3 bg-white bg-opacity-5 rounded-lg">
								<input
									className="flex flex-grow bg-transparent text-sm outline-none text-[#949494] placeholder:text-[#949494]"
								type="text"
									placeholder="Write a message..."
									value={chatMessage}
									onChange={(e) => {setChatMessage(e.target.value)}}
								/>
								<div className="flex flex-row justify-between w-28">
									<PaperClipIcon className="h-5 w-5 text-[#949494]" />
									<CloudArrowUpIcon className="h-5 w-5 text-[#949494]"/>
									<TagIcon className="h-5 w-5 text-[#949494]"/>
									<PencilSquareIcon className="h-5 w-5 text-[#949494]" />
								</div>
							</div>
						</div>)}
				</div>
			</div>
		</div>
				
	)
}

function Conversation(props) {
	return(
		<div className={"flex flex-row rounded-lg w-full gap-x-3 p-3 hover:bg-gradient-to-r hover:from-[#4A16534D] hover:to-[#1F16534D]"}>
			<div className="relative flex h-8 w-8 rounded-full overflow-hidden">
				<Image 
					layout="fill"
					src={props?.vendor?.profilePic || "https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50?d=mp&f=y"}
					objectFit="cover"
				/>
			</div>
			<div className="flex flex-col text-white font-bold text-xl align-middle my-auto justify-start">
				<span className="text-sm text-[#] -mb-[3px]">{props?.vendor?.nickname || "UserName"}</span>
				<span className="text-[#535353] text-xs font-normal">{(props?.sellerAddr?.slice(0,10) + "...")  || "DMgY6wi2FV..."}</span>
			</div>
			<div className="flex justify-end text-white text-xs flex-grow">{props?.timestamp || "hh:mm"}</div>
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
		<div className="flex flex-row w-max-[50%] my-2 justify-start">
			<div className="flex flex-col mr-1">
				<div className="relative text-[#5C5C5C] text-xs text-left mb-1">hh:mm</div>
				<div className="flex flex-row gap-x-2">
					<div className="relative flex h-8 w-8 rounded-full overflow-hidden">
						<Image 
							layout="fill"
							src={props?.vendor?.profilePic || "https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50?d=mp&f=y"}
							objectFit="cover"
						/>
					</div>
				</div>
			</div>
			<div className="flex flex-row rounded-lg bg-[#6A31B2] bg-opacity-20 p-6 my-auto w-[22rem] h-44 justify-between">
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