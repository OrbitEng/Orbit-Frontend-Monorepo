import Image from "next/image";
import { InformationCircleIcon, PaperClipIcon, CloudArrowUpIcon, TagIcon, PencilSquareIcon } from "@heroicons/react/24/outline";
import { Message, SelfMessage, ContractRequest } from "@includes/components/chat/Messages";
import { useEffect, useRef, useState } from "react";
import { ChatRoomFunctionalities } from "@functionalities/Chat";

export function Texts(props){
    const [chatMessage, setChatMessage] = useState([]);
    const [roomid, setRoomid] = useState(props.roomid);
    const {PollMessages, FetchOlderMessages} = ChatRoomFunctionalities();
    
    const messageBottomRef = useRef(null);
    useEffect(() => {
        messageBottomRef.scrollIntoView
    },[])

    return(
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
        </div>
    )   
}