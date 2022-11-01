import Image from "next/image";
import { MagnifyingGlassIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useContext, useState } from "react";
import UserAccountCtx from "@contexts/UserAccountCtx";
import ChatCtx from "@contexts/ChatCtx";
import MatrixClientCtx from "@contexts/MatrixClientCtx";
import TransactionClientCtx from "@contexts/TransactionClientCtx";
import MarketAccountsCtx from "@contexts/MarketAccountsCtx";
import { MarketAccountFunctionalities } from "@functionalities/Accounts";
import { useCallback } from "react";
import { useEffect } from "react";

export function Convos(props){
    const {GetPfp, GetMetadata} = MarketAccountFunctionalities();
	const {transactionClient} = useContext(TransactionClientCtx)
	const {userAccount} = useContext(UserAccountCtx);
	const {marketAccountsClient} = useContext(MarketAccountsCtx);

    const {chatState} = useContext(ChatCtx);
    const {matrixClient} = useContext(MatrixClientCtx)

    const [chatRooms, setChatRooms] = useState([]);
    const [chatSearch, setChatSearch] = useState("");

    const UpdateConvos = useCallback(async()=>{
		// return;
        if(!(userAccount && userAccount.data) || !(matrixClient && matrixClient.logged_in)) return;

		for (let invitation of (await matrixClient.CheckInvites())){
			try{
				await matrixClient.JoinInvite(invitation.roomId)
			}catch(e){
				await matrixClient.LeaveConvo(invitation.roomId);
			}
		}
        
        
        let rooms = await matrixClient.GetJoinedRooms();
        let rooms_mapped = {};

        for(let i = 0; i < rooms.length; i++){
			let room = rooms[i];
			await matrixClient.RoomInitSync(room);
			let members = (await matrixClient.GetRoomMembers(room));
			if(members.length != 1){
				console.log("improper member count");
				await matrixClient.LeaveConvo(room);
				continue
			}

			let desanitized_acc_address = matrixClient.SanitizeName(members[0])
			let other_party_data;
			console.log(desanitized_acc_address)

			try{
				other_party_data = await marketAccountsClient.GetAccount(
					marketAccountsClient.GenAccountAddress(desanitized_acc_address)
				);
			}catch(e){
				console.log("error", e)
				await matrixClient.LeaveConvo(room);
				continue;
			}
			other_party_data.data.metadata = await GetMetadata(other_party_data.data.metadata);
			other_party_data.data.profilePic = await GetPfp(other_party_data.data.profilePic);

			rooms_mapped[desanitized_acc_address] = {
				roomid: room,
				other_party: other_party_data
			}
		}
        
        let buyer_transactions = [];
        let seller_transactions = [];
        
        if(userAccount.data.buyerDigitalTransactions.toString() != "11111111111111111111111111111111"){
            let txs = (await transactionClient.GetBuyerOpenTransactions(userAccount.data.buyerDigitalTransactions)).data;
            let indexes = txs.indices[0].toString(2).split("").reverse().join("") + txs.indices[1].toString(2).split("").reverse().join("") + txs.indices[2].toString(2).toString(2).split("").reverse().join("")
            for(let i = 0; i < indexes.length; i++){
                if(indexes[i] == "0") continue;
                buyer_transactions.push(txs.openTransactions[i])
            }
        }
        if(userAccount.data.buyerPhysicalTransactions.toString() != "11111111111111111111111111111111"){
            let txs = (await transactionClient.GetBuyerOpenTransactions(userAccount.data.buyerPhysicalTransactions)).data;
            let indexes = txs.indices[0].toString(2).split("").reverse().join("") + txs.indices[1].toString(2).split("").reverse().join("") + txs.indices[2].toString(2).toString(2).split("").reverse().join("")
            for(let i = 0; i < indexes.length; i++){
                if(indexes[i] == "0") continue;
                buyer_transactions.push(txs.openTransactions[i])
            }
        }
        if(userAccount.data.buyerCommissionTransactions.toString() != "11111111111111111111111111111111"){
            let txs = (await transactionClient.GetBuyerOpenTransactions(userAccount.data.buyerCommissionTransactions)).data;
            let indexes = txs.indices[0].toString(2).split("").reverse().join("") + txs.indices[1].toString(2).split("").reverse().join("") + txs.indices[2].toString(2).toString(2).split("").reverse().join("")
            for(let i = 0; i < indexes.length; i++){
                if(indexes[i] == "0") continue;
                buyer_transactions.push(txs.openTransactions[i])
            }
        }

        /// other party is the return of this call
        let buyer_convos = await transactionClient.GetMultipleTransactionSeller(buyer_transactions);
        let seller_wallets = await transactionClient.GetMultipleTxLogOwners(buyer_convos);
        for(let i = 0; i < seller_wallets.length; i++){
            rooms_mapped[seller_wallets[i].toString()].txid = buyer_transactions[i];
            rooms_mapped[seller_wallets[i].toString()].side = "buyer";
        }


        if(userAccount.data.sellerDigitalTransactions.toString() != "11111111111111111111111111111111"){
            let txs = (await transactionClient.GetSellerOpenTransactions(userAccount.data.sellerDigitalTransactions)).data;
            let indexes = txs.openTransactions[0].toString(2).split("").reverse().join("") + txs.openTransactions[1].toString(2).split("").reverse().join("") + txs.openTransactions[2].toString(2).split("").reverse().join("") + txs.openTransactions[3].toString(2).toString(2).split("").reverse().join("")
            for(let i = 0; i < indexes.length; i++){
                if(indexes[i] == "0") continue;
                seller_transactions.push(txs.openTransactions[i])
            }
        }
        if(userAccount.data.sellerPhysicalTransactions.toString() != "11111111111111111111111111111111"){
            let txs = (await transactionClient.GetSellerOpenTransactions(userAccount.data.sellerPhysicalTransactions)).data;
            let indexes = txs.openTransactions[0].toString(2).split("").reverse().join("") + txs.openTransactions[1].toString(2).split("").reverse().join("") + txs.openTransactions[2].toString(2).split("").reverse().join("") + txs.openTransactions[3].toString(2).toString(2).split("").reverse().join("")
            for(let i = 0; i < indexes.length; i++){
                if(indexes[i] == "0") continue;
                seller_transactions.push(txs.openTransactions[i])
            }
        }
        if(userAccount.data.sellerCommissionTransactions.toString() != "11111111111111111111111111111111"){
            let txs = (await transactionClient.GetSellerOpenTransactions(userAccount.data.sellerCommissionTransactions)).data;
            let indexes = txs.openTransactions[0].toString(2).split("").reverse().join("") + txs.openTransactions[1].toString(2).split("").reverse().join("") + txs.openTransactions[2].toString(2).split("").reverse().join("") + txs.openTransactions[3].toString(2).toString(2).split("").reverse().join("")
            for(let i = 0; i < indexes.length; i++){
                if(indexes[i] == "0") continue;
                seller_transactions.push(txs.openTransactions[i])
            }
        }

        let seller_convos = await transactionClient.GetMultipleTransactionBuyer(seller_transactions);
        let buyer_wallets = await transactionClient.GetMultipleTxLogOwners(seller_convos);
        for(let i = 0; i < buyer_wallets.length; i++){
            rooms_mapped[buyer_wallets[i].toString()].txid = seller_transactions[i];
            rooms_mapped[buyer_wallets[i].toString()].side = "seller";
        }
        
		console.log(rooms_mapped)
        setChatRooms(rooms_mapped);

    },[matrixClient, matrixClient && matrixClient.last_sync, userAccount])

    useEffect(async()=>{
        await UpdateConvos()
    },[UpdateConvos])

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
                        [...Object.entries(chatRooms)].map(([other_name, room_info], index)=>{
                            console.log(other_name, room_info);
                            // {roomid: string, other_party: orbit market account, txid?: pubkey, sid: "buyer"/"seller"}
                            return <ChatPersona roomInfo={room_info} setTextRoomAndPanel={props.setTextRoomAndPanel} key={index} UpdateConvos={UpdateConvos}/>
                        })
                    }
                </div>
            </div>
        </div>
    )
}

export function ChatPersona(props) {
    const {matrixClient} = useContext(MatrixClientCtx);

    const LeaveConversation = useCallback(async()=>{
        await matrixClient.LeaveConvo(props.roomInfo.roomid);
        await props.UpdateConvos();
    },[props, matrixClient]);

	return(
		<div
            className="w-full flex flex-row"
        >
            <div
                onClick={()=>{props.setTextRoomAndPanel && props.setTextRoomAndPanel(props.roomInfo)}}
                className="flex-grow flex flex-row rounded-lg gap-x-3 p-3 hover:bg-gradient-to-r hover:from-[#4A16534D] hover:to-[#1F16534D] overflow-hidden"
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
                </div>
            </div>

            <div onClick={LeaveConversation}>
                <TrashIcon className="mx-2 w-8 h-8 text-white"/>
            </div>
		</div>
	)
}