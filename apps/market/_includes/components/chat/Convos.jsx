import Image from "next/image";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useContext, useState } from "react";
import UserAccountCtx from "@contexts/UserAccountCtx";
import ChatCtx from "@contexts/ChatCtx";

export function Convos(props){
    console.log(props)
    const {userAccount, setUserAccount} = useContext(UserAccountCtx);
    const {chatState, setChatState} = useContext(ChatCtx);

    const [chatSearch, setChatSearch] = useState();

    

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
                <div className="flex flex-col overflow-y-scroll">
                    {
                        [...Object.entries(props.chatRooms)].map(([other_name, room_info], index)=>{
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

export function ChatPersona(props) {
    console.log(props)
	return(
		<div
            className={"flex flex-row rounded-lg w-full gap-x-3 p-3 hover:bg-gradient-to-r hover:from-[#4A16534D] hover:to-[#1F16534D]"}
            onClick={()=>{props.setTextRoomAndPanel && props.setTextRoomAndPanel(props.roomInfo)}}
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
			<div className="flex justify-end text-white text-xs flex-grow">{props?.timestamp || "hh:mm"}</div>
		</div>
	)
}