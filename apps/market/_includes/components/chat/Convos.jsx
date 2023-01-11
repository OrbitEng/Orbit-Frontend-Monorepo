import Image from "next/image";
import { MagnifyingGlassIcon, TrashIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useContext, useState } from "react";
import UserAccountCtx from "@contexts/UserAccountCtx";
import ChatCtx from "@contexts/ChatCtx";
import MatrixClientCtx from "@contexts/MatrixClientCtx";
import { useCallback } from "react";
import { useEffect } from "react";

export function Convos(props){
	const {userAccount} = useContext(UserAccountCtx);

    const {chatState} = useContext(ChatCtx);
    const {matrixClient} = useContext(MatrixClientCtx)

    const [chatRooms, setChatRooms] = useState([]);
    const [chatSearch, setChatSearch] = useState("");

    useEffect(()=>{
        if(!matrixClient){
            return;
        }
        if(!matrixClient.chatrooms){
            matrixClient.chatroommount = setChatRooms 
        }
        setChatRooms(matrixClient.chatrooms);
    }, [chatState, matrixClient, matrixClient?.chatrooms])

    return(
        <div className="flex flex-col w-full h-full px-3 pt-3 bg-gradient-to-t from-[#2917514D] to-[#1D045178]">
            <div className="flex flex-col">
                <div className="relative flex flex-shrink-0 h-16 w-16 rounded-full overflow-hidden mx-auto mt-10">
                    <Image 
                        layout="fill"
                        src={((userAccount?.data?.profilePic?.charAt(0) == "/" || userAccount?.data?.profilePic?.slice(0,4) == "http" || userAccount?.data?.profilePic?.slice(0,4) == "data") && userAccount.data.profilePic) || "https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50?d=mp&f=y"}
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
                <div className="flex flex-col overflow-y-auto">
                    {
                        (chatRooms) && [...Object.entries(chatRooms)].map(([other_name, room_info], index)=>{
                            console.log(other_name, room_info);
                            // {roomid: string, other_party: orbit market account, txid?: pubkey, sid: "buyer"/"seller"}
                            return <ChatPersona setChatRooms={setChatRooms} roomInfo={room_info} other_party={other_name} setTextRoomAndPanel={props.setTextRoomAndPanel} key={index}/>
                        })
                    }
                </div>
            </div>
        </div>
    )
}

export function ChatPersona(props) {
    const {matrixClient} = useContext(MatrixClientCtx);
    const {setChatState} = useContext(ChatCtx);

    const LeaveConversation = useCallback(async()=>{
        await matrixClient.LeaveConvo(props.other_party, props.roomInfo.roomId);
        setChatState(s => ({...s}))
    },[matrixClient]);

	return(
		<div
            className="w-full flex flex-row overflow-visible"
        >
            <div
                onClick={()=>{props.setTextRoomAndPanel && props.setTextRoomAndPanel(props.roomInfo)}}
                className="relative flex-grow flex flex-row rounded-lg gap-x-3 p-3 hover:bg-gradient-to-r hover:from-[#4A16534D] hover:to-[#1F16534D] overflow-visible"
            >
                <div className="relative flex h-8 w-8 rounded-full overflow-hidden">
                    <Image 
                        layout="fill"
                        src={(props?.roomInfo?.other_party?.data?.profilePic && props.roomInfo.other_party.data.profilePic) || "https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50?d=mp&f=y"}
                        objectFit="cover"
                    />
                </div>
                <div className="flex flex-col text-white font-bold text-xl align-middle my-auto justify-start">
                    <span className="text-sm text-[#] -mb-[3px]">{(props?.roomInfo?.other_party?.data?.metadata?.name && props.roomInfo.other_party.data.metadata.name) || "UserName"}</span>
                    <span className="text-[#535353] text-xs font-normal">{(props?.roomInfo?.other_party?.address?.toString &&( props.roomInfo.other_party.address.toString().slice(0,10) + "..."))  || "DMgY6wi2FV..."}</span>
                </div>
                <div className="flex justify-end text-white text-xs flex-grow">
                    <div className="flex flex-row">
                        {props?.timestamp || "hh:mm"}
                    </div>
                    <div onClick={LeaveConversation} className="inline-flex flex-row items-center justify-center text-xs font-bold leading-none transform translate-x-1/2 -translate-y-1/2 rounded-full">
                        <XMarkIcon className="h-4 w-4 text-blue-500" />
                    </div>
                </div>
            </div>
		</div>
	)
}

///////////////////////////////////////////////////////////////////////////////////////////////////
// Fullscreen Components
export function FullScreenConvos(props){
	const {userAccount} = useContext(UserAccountCtx);

    const {chatState} = useContext(ChatCtx);
    const {matrixClient} = useContext(MatrixClientCtx)

    const [chatRooms, setChatRooms] = useState([]);
    const [chatSearch, setChatSearch] = useState("");

    useEffect(()=>{
        if(!(matrixClient)){
            return;
        }
        if(!(matrixClient.chatrooms)){
            matrixClient.chatroommount = setChatRooms;
            return;
        }
        setChatRooms(matrixClient.chatrooms);
    }, [matrixClient?.chatrooms])

    return(
        <div className="flex flex-col w-full h-full p-4">
            <div className="flex flex-col w-full overflow-hidden">
                <div className="relative flex flex-shrink-0 h-16 w-16 rounded-full overflow-hidden mx-auto mt-10">
                    <Image 
                        layout="fill"
                        src={((userAccount?.data?.profilePic?.charAt(0) == "/" || userAccount?.data?.profilePic?.slice(0,4) == "http" || userAccount?.data?.profilePic?.slice(0,4) == "data") && userAccount.data.profilePic) || "https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50?d=mp&f=y"}
                        objectFit="cover"
                    />
                </div>
                {
                    userAccount?.data?.metadata ? (
                    <>
                        <span className="font-bold text-2xl text-white text-center truncate">{userAccount?.data?.metadata?.name}</span>
                        <span className="font-semibold text-sm text-[#515661] truncate">{("@" + userAccount?.address.toString())}</span>
                    </>
                    ) : (
                    <div className="w-full">
                        <div className="bg-[#535353] h-6 w-1/2 rounded mb-1 mt-2 animate-pulse mx-auto" />
                        <div className="bg-[#535353] h-4 w-2/3 rounded animate-pulse mx-auto" />
                    </div>
                    )
                }
                <div className="flex flex-row bg-white bg-opacity-5 p-2 rounded-lg gap-x-1 mt-4">
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
                <div className="flex flex-col overflow-y-auto">
                    {
                        (matrixClient && matrixClient.chatrooms) && [...Object.entries(matrixClient.chatrooms)].map(([other_name, room_info], index)=>{
                            console.log(other_name, room_info);
                            // {roomid: string, other_party: orbit market account, txid?: pubkey, sid: "buyer"/"seller"}
                            return <ChatPersona roomInfo={room_info} setTextRoomAndPanel={props.setTextRoomAndPanel} key={index}/>
                        })
                    }
                </div>
            </div>
        </div>
    )
}