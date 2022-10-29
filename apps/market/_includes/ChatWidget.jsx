import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useContext, useEffect, useState, useRef } from "react"
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
	const {GetPfp, GetMetadata} = MarketAccountFunctionalities();
	const {transactionClient} = useContext(TransactionClientCtx)
	const {userAccount, setUserAccount} = useContext(UserAccountCtx);
	const {matrixClient, setMatrixClient} = useContext(MatrixClientCtx);
	const {marketAccountsClient} = useContext(MarketAccountsCtx);

	const {chatState, setChatState} = useContext(ChatCtx);
	const [panel, setPanel] = useState("convos"); // can either be "convos" or "text"

	const [chatRooms, setChatRooms] = useState([]);
	const [textRoom, setTextRoom] = useState({})

    useEffect(async()=>{
        if(!(userAccount && userAccount.data) || !(matrixClient || matrixClient.logged_in)) return;

        await Promise.all((await matrixClient.CheckInvites()).map((room)=>{
            return matrixClient.JoinInvite(room.roomid)}
        ));
        
        let rooms = await matrixClient.GetJoinedRooms();
        console.log(rooms)
        let rooms_mapped = {};
        rooms.forEach(async (room) => {
            let members = (await matrixClient.GetRoomMembers(room));
            if(members.length > 2){
                return
            }
            let other_party_name = members[0]
			let other_party_data = await marketAccountsClient.GetAccount(other_party_name);
			other_party_data.data.metadata = await GetMetadata(other_party_data.data.metadata);
			other_party_data.data.profilePic = await GetPfp(other_party_data.data.profilePic);
            rooms_mapped[other_party_name] = {
                roomid: room.roomid,
                other_party: other_party_data
            }
        })
        
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
        
        setChatRooms(rooms_mapped);

    },[matrixClient, userAccount])

	useEffect(() => {console.log(chatState)}, [chatState])

	return (
		<div className="fixed flex flex-col inset-y-0 right-0">
			<div 
				className={
					"pointer-events-auto transition-all duration-300 relative w-screen flex flex-row z-[130] h-[30rem] mt-[20rem] mb-auto "
					+ (( chatState.isOpen ? (panel === "text" ? "max-w-3xl right-0" : "max-w-md right-0") : " max-w-[3.5rem] right-0"))
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
						((panel === "convos") && <Convos chatRooms={chatRooms} setTextRoom={setTextRoom}/>) ||
						((panel === "texts") && <Texts textRoom={textRoom}/>)
					}
				</div>
			</div>
		</div>
				
	)
}