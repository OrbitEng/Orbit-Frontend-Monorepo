import Image from "next/image";
import { InformationCircleIcon} from "@heroicons/react/24/outline";
import { useEffect, useRef, useState } from "react";
import { ChatRoomFunctionalities } from "@functionalities/Chat";
import { useCallback } from "react";
import { ChatTextInput } from "@includes/components/inputs/ChatTextInput";

export function Texts(props){
    const [chatMessages, setChatMessages] = useState([]);
    // {roomid: string, other_party: orbit market account, txid?: pubkey, sid: "buyer"/"seller"}
    const [roomData, setRoomData] = useState(props.textRoom);
    const {PollMessages, FetchOlderMessages} = ChatRoomFunctionalities(
        props.textRoom.roomid,
        props.textRoom.txid,
        roomData?.other_party?.data?.profilePic
    );
    
    const messageBottomRef = useRef(null);

    const newChat = useCallback(async()=>{

        let polled = await PollMessages();
        setChatMessages(polled);
        if(!messageBottomRef) return;
        messageBottomRef.current.scrollIntoView();
        
    },[messageBottomRef]);

    useEffect(async()=>{
        await newChat()
    },[])

    const olderMessages = useCallback(async ()=>{
        let older_messages = await FetchOlderMessages(chatMessages.length);
        setChatMessages(await PollMessages())
    },[chatMessages])


    const handleScroll = async event => {
        const { scrollHeight, scrollTop, clientHeight } = event.target;
        if (scrollTop <= 10) {
            olderMessages()
        }
    };

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
            <div className="px-5 flex flex-col h-full overflow-hidden" >
                <div className="relative flex flex-col flex-grow overflow-y-scroll h-full mb-16" onScroll={handleScroll} >
                    {
                        chatMessages
                    }
                    {/* <Message text="hello"/>
                    <SelfMessage text="hello" />
                    <ContractRequest autoFocus requestName="Custom Logo" /> */}
                    <div ref={messageBottomRef}/>
                </div>
                <ChatTextInput roomid={roomData.roomid} updateChat={newChat}/>
            </div>
        </div>
    )   
}