import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useContext, useState } from "react"
import { CloudArrowUpIcon, InformationCircleIcon, MagnifyingGlassIcon, PaperClipIcon, PencilSquareIcon, TagIcon, XMarkIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import UserAccountCtx from "@contexts/UserAccountCtx";

export default function ChatApp(props) {
	const {userAccount, setUserAccount} = useContext(UserAccountCtx);
	const [chatSearch, setChatSearch] = useState();
	const [chatMessage, setChatMessage] = useState();

	function classNames(...classes) {
		return(classes.filter(Boolean).join(' '))
	}

	return (
		<Transition.Root show={props.open} as={Fragment}>
			<Dialog as="div" className="relative z-[100]" onClose={props.setOpen}>
				<div className="fixed inset-0 overflow-hidden">
					<div className="absolute inset-0 overflow-hidden">
						<div className="pointer-events-none fixed bottom-0 right-0 flex mb-10">
							<Transition.Child
								as={Fragment}
								enter="transform transition ease-in-out duration-500 sm:duration-700"
								enterFrom="translate-x-full"
								enterTo="translate-x-0"
								leave="transform transition ease-in-out duration-500 sm:duration-700"
								leaveFrom="translate-x-0"
								leaveTo="translate-x-full"
							>
								<Dialog.Panel className="pointer-events-auto relative w-screen max-w-5xl flex">
									<div className="flex flex-row backdrop-blur-xl h-[30rem] w-[61.5rem] overflow-hidden bg-gradient-to-t from-[#32254E78] to-[#26232C9C] border-t border-x border-[#545454] border-opacity-30 shadow-xl my-auto rounded-xl">
										<div className="absolute top-0 left-0 flex pt-4 pl-4 justify-start">
											<button
												type="button"
												className="rounded-full text-white bg-[#303030] bg-opacity-70 p-1 border-[#5b5b5b] border-[1px] focus:outline-none"
												onClick={() => props.setOpen(false)}
											>
												<span className="sr-only">Close Chat</span>
												<XMarkIcon className="h-4 w-4 text-[#e2e2e2]" aria-hidden="true" />
											</button>
										</div>
										<div className="flex flex-row h-full w-full">
											<div className="flex flex-col w-72 h-full p-3 flex-shrink-0">
												<div className="relative flex h-16 w-16 rounded-full overflow-hidden mx-auto mt-10">
													<Image 
														layout="fill"
														src={userAccount?.data?.profilePic || "https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50?d=mp&f=y"}
														objectFit="cover"
													/>
												</div>
												<span className="font-bold text-2xl text-white mx-auto truncate">{userAccount?.data?.metadata?.name}</span>
												<span className="font-semibold text-sm text-[#515661] truncate mx-14">{("@" + userAccount?.address.toString())}</span>
												<div className="flex flex-row bg-white bg-opacity-5 p-2 rounded-lg gap-x-1 mt-4 mx-4">
													<MagnifyingGlassIcon className="h-4 w-4 my-auto text-[#5F5F5F]"/>
													<input
														className="bg-transparent text-sm outline-none text-[#515661] placeholder:text-[#5F5F5F]"
														type="text"
														placeholder="Search"
														value={chatSearch}
														onChange={(e) => {setChatSearch(e.target.value)}}
													/>
												</div>
												<div className="flex flex-col mt-6">
													<span className="text-white text-xs font-bold p-2">Messages <span className="text-blue-500">{props?.notis && " (" + props.notis + ")"}</span></span>
													<div className="flex flex-row rounded-lg w-full gap-x-3 p-3 bg-gradient-to-r from-[#4A165386] to-[#1F165386]">
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
													<div className="flex flex-row rounded-lg w-full gap-x-3 p-3 bg-transparent">
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
													<div className="flex flex-row rounded-lg w-full gap-x-3 p-3 bg-transparent">
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
												</div>
											</div>
											<div className="relative flex flex-col flex-grow bg-gradient-to-t from-[#2917514D] to-[#1D045178] overflow-hidden">
												<div className="sticky w-full bg-[#2C2638] bg-opacity-30">
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
												<div className="px-5 overflow-y-scroll">
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
											</div>
										</div>
									</div>
								</Dialog.Panel>
							</Transition.Child>
						</div>
					</div>
				</div>
			</Dialog>
		</Transition.Root>
	)
}

function Message(props) {
	return(
		<div className="flex flex-row w-max-[50%] gap-x-2 my-2">
			<div className="flex flex-col">
				<div className="relative text-[#5C5C5C] text-xs text-left mb-1">hh:mm</div>
				<div className="flex flex-row">
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