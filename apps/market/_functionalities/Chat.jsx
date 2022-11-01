import { useContext, useState, useCallback } from "react";
import DigitalMarketCtx from "@contexts/DigitalMarketCtx";
import MatrixClientCtx from "@contexts/MatrixClientCtx";
import { DigitalFunctionalities } from "@functionalities/Transactions";
import { SelfMessage, Message  } from "@includes/components/chat/Messages";
import Image from "next/image";


export function ChatRoomFunctionalities(roomId, txAddr = ""){
    const {matrixClient} = useContext(MatrixClientCtx);
    // const {digitalMarketClient} = useContext(DigitalMarketCtx);
    const {DecryptImage} = DigitalFunctionalities();
    // const [arweaveClient, setArweaveClient] = useState(new ArQueryClient());

    const FilterNewChatLogs = async(events) =>{
            let logs = [];
            for(let event of events){
                let message = event.clearEvent
                if(message.type != "m.room.message"){
                    return undefined;
                }
        
                let children = <></>;
                let msgtext = "";

                // todo: take care of common mimetypes
                // type : content.info.mimetype
                switch(message.content.msgtype){
                    case "m.notice":
                        continue;
                        if(message.content.body.slice(0,8) == "link set"){
                            children = <Image
                                src = {(await DecryptImage(txAddr))}
                                layout="fill"
                                alt="digital file"
                                objectFit="contain"
                                priority={true}
                            />
                        }
                        
                        break;
                    case "m.text":
                        msgtext = message.content.body;
                        break;
                    case "m.image":
                        
                        children = <Image
                            src = {this.MatrixClient.mxcUrlToHttp(message.content.url)}
                            layout="fill"
                            objectFit="contain"
                            priority={true}
                        />
                        break;
                    case "m.file":
                        break;
                    case "m.audio":
                        break;
                    case "m.video":
                        break;
                };

                let retelement = event.sender.name == matrixClient.display_name ?
                <SelfMessage text={msgtext}>
                    {children}
                </SelfMessage>
                :
                <Message text={msgtext}>
                    {children}
                </Message>;
                
                logs.push(retelement)
            }
            return logs
    }

    /**
     * called on startup
     */
    const PollMessages = async() =>{
        if(!roomId) return [];
        let messages = (await matrixClient.GetMessagesForRoom(roomId));
        return FilterNewChatLogs(messages)
    }

    /**
     * lazy loading
     */
    const FetchOlderMessages = async(logs_length) =>{
        if(!roomId) return [];
        let messages = (await matrixClient.UpdateRoomOlderMessages(roomId, logs_length));
        return FilterNewChatLogs(messages)
    }

    return {
        FilterNewChatLogs,
        PollMessages,
        FetchOlderMessages
    }

}