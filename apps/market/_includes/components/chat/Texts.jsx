import Image from "next/image";
import { InformationCircleIcon, PaperClipIcon, CloudArrowUpIcon, TagIcon, PencilSquareIcon } from "@heroicons/react/24/outline";
import { Message, SelfMessage, ContractRequest } from "@includes/components/chat/Messages";
import { useEffect, useRef, useState } from "react";
import { ChatRoomFunctionalities } from "@functionalities/Chat";
import { useCallback } from "react";
import MatrixClientCtx from "@contexts/MatrixClientCtx";
import { useContext } from "react";

export function Texts(props){
    const [chatMessages, setChatMessages] = useState([]);
    const [textMesage, setTextMessage] = useState("");
    // {roomid: string, other_party: orbit market account, txid?: pubkey, sid: "buyer"/"seller"}
    const [roomData, setRoomData] = useState(props.textRoom);
    const {PollMessages, FetchOlderMessages} = ChatRoomFunctionalities(props.textRoom.roomid, props.textRoom.txid);
    const {matrixClient} = useContext(MatrixClientCtx);

    const submitReview = useCallback(()=>{
        
    },[]);

    const attachPreview = useCallback(()=>{
        
    },[]);

    const submitFinal = useCallback(()=>{
        
    },[]);

    const sendChat = useCallback(async(e)=>{
        if(textMesage == "") return;
        if(e.key == "Enter"){
            setTextMessage("");
            await matrixClient.SendMessage(roomData.roomid, textMesage);
            setChatMessages(await PollMessages());
        };
    },[roomData, textMesage])

    useEffect(async()=>{
        let polled = await PollMessages();
        console.log(polled)
        setChatMessages(polled)
    },[]);

    const olderMessages = useCallback(async ()=>{
        let older_messages = await FetchOlderMessages(chatMessages.length);
        setChatMessages(curr => [...curr, ...older_messages])
    },[chatMessages])


    const handleScroll = async event => {
        const { scrollHeight, scrollTop, clientHeight } = event.target;
        if (scrollTop <= 10) {
            olderMessages
        }
    };
    
    const messageBottomRef = useRef(null);
    useEffect(() => {
        messageBottomRef.scrollIntoView()
    },[messageBottomRef])

    return(
        <div className="flex flex-col w-full h-full flex-shrink-0 bg-gradient-to-t from-[#29175180] to-[#1D045180]">
            <div className="sticky w-full bg-[#2C2638] bg-opacity-30 rounded-b-lg">
                <div className="flex flex-row my-auto rounded-lg w-full gap-x-3 p-3 bg-transparent">
                    <div className="relative flex h-8 w-8 rounded-full overflow-hidden">
                        <Image 
                            layout="fill"
                            src={(roomData?.other_party?.data?.profilePic && roomData.other_party.data.profilePic) || "https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50?d=mp&f=y"}
                            objectFit="cover"
                        />
                    </div>
                    <div className="flex flex-col my-auto text-white font-bold text-xl align-middle justify-start">
                        <span className="text-sm -mb-[3px]">{(roomData?.other_party?.data?.metadata?.name && roomData.other_party.data.metadata.name) || "UserName"}</span>
                        <span className="text-[#535353] text-xs font-normal">{(roomData?.other_party?.address?.toString && ("@"+roomData.other_party.address.toString().slice(0,10) + "...")) || "@DMgY6wi2FV..." }</span>
                    </div>
                    <button 
                        className="bg-transparent ml-auto"
                        onClick={() => {}}
                    >
                        <InformationCircleIcon className="h-6 w-6 text-[#6D6D6D] stroke-2" />
                    </button>
                </div>
            </div>
            <div className="px-5 overflow-y-scroll scrolling-touch scrollbar scrollbar-thumb-[#5B5B5B] scrollbar-track-[#8E8E8E] scrollbar-thumb-rounded-full scrollbar-track-rounded-full h-full" onScroll={handleScroll} >
                <div className="relative flex flex-col flex-grow" >
                    {
                        chatMessages
                    }
                    {/* <Message text="hello"/>
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
                    <ContractRequest autoFocus requestName="Custom Logo" /> */}
                    <div ref={(el)=>{messageBottomRef=el}}/>
                </div>
            </div>
            <div className="sticky flex flex-row mx-3 bottom-0 mb-4 inset-x-0 p-3 bg-white bg-opacity-5 rounded-lg">
                <input
                    className="flex flex-grow bg-transparent text-sm outline-none text-[#949494] placeholder:text-[#949494]"
                    type="text"
                    placeholder="Write a message..."
                    value={textMesage}
                    onChange={(e) => {setTextMessage(e.target.value)}}
                    onKeyDown={sendChat}
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