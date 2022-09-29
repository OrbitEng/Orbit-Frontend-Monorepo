import { useContext, useState, useCallback } from "react";
import DigitalMarketCtx from "@contexts/DigitalMarketCtx";
import MatrixClientCtx from "@contexts/MatrixClientCtx";
import Image from "next/image";


export function ChatFunctionalities(props){
    const [txAddr, setTxAddr] = useState(props.tx_addr)
    const [roomId, setRoomId] = useState(props.roomid);
    const {matrixClient} = useContext(MatrixClientCtx);
    const {digitalMarketClient} = useContext(DigitalMarketCtx);

    const [chatLogs, setChatLogs] = useState([]);

    const FilterNewChatLogs = async(messages) =>{
            let logs = [];
            for(let message of messages){
                if(message.type != "m.room.message"){
                    return undefined;
                }

                let message_side = message.sender == matrixClient.matrix_name ? " right " : " left ";
        
                // todo: take care of common mimetypes
                // type : content.info.mimetype
                switch(message.content.msgtype){
                    case "m.notice":
                        if(message.content.body == "link set"){
                            if(await digitalMarketClient.GetLink(txAddr)){
                                continue;
                            }

                            digitalMarketClient.UpdateLinkLocal(txAddr);
                        }else
                        if(message.content.body.includes("choose blocks")){
                            if(await digitalMarketClient.GetChosenBlocks(txAddr)){
                                continue;
                            }
                            digitalMarketClient.SetChosenBlocks(txAddr, message.content.body.slice(13).split(","));
                        }
                        
                        continue;
                    case "m.text":
                        ret = 
                            <div className={"w-full" + message_side}>
                                {message.content.body}
                            </div>
                        break;
                    case "m.image":
                        ret =
                            <div className='relative w-full h-14'>
                                <Image
                                    src = {this.MatrixClient.mxcUrlToHttp(message.content.url)}
                                    layout="fill"
                                    alt="digital file"
                                    objectFit="contain"
                                    priority={true}
                                />
                            </div>
                        break;
                    case "m.file":
                        break;
                    case "m.audio":
                        break;
                    case "m.video":
                        break;
                };

                logs.push(ret)
            }
            return logs
    }

    /**
     * called on startup
     */
    const PollMessages = async() =>{
        let messages = matrixClient.GetMessagesForRoom(roomId);

        chatLogs.push(FilterNewChatLogs(messages));
        setChatLogs(chatLogs);
    }

    /**
     * lazy loading
     */
    const FetchOlderMessages = async() =>{
        let messages = matrixClient.UpdateRoomOlderMessages(roomId, chatLogs.length);

        chatLogs.push(FilterNewChatLogs(messages));
        setChatLogs(chatLogs);
    }

    return {
        chatLogs,
        PollMessages,
        FetchOlderMessages
    }

}