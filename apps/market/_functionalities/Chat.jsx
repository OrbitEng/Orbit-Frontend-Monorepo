import { useContext, useState, useCallback } from "react";
import DigitalMarketCtx from "@contexts/DigitalMarketCtx";
import MatrixClientCtx from "@contexts/MatrixClientCtx";
import { DigitalFunctionalities } from "@functionalities/Transactions";
import { ArQueryClient } from "data-transfer-clients";
import { SelfMessage, Message  } from "@includes/ChatWidget";
import Image from "next/image";


export function ChatFunctionalities(props){
    const {matrixClient} = useContext(MatrixClientCtx);
    // const {digitalMarketClient} = useContext(DigitalMarketCtx);
    const {DecryptImage} = DigitalFunctionalities();
    // const [arweaveClient, setArweaveClient] = useState(new ArQueryClient());

    const [chatLogs, setChatLogs] = useState([]);

    const FilterNewChatLogs = async(messages) =>{
            let logs = [];
            for(let message of messages){
                if(message.type != "m.room.message"){
                    return undefined;
                }
        
                let children = undefined;
                let msgtext = "";

                // todo: take care of common mimetypes
                // type : content.info.mimetype
                switch(message.content.msgtype){
                    case "m.notice":
                        if(message.content.body.slice(0,8) == "link set"){
                            children = <Image
                                src = {(await DecryptImage(props.txAddr))}
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
                            alt="digital file"
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

                let retelement = message.sender == matrixClient.matrix_name ?
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
        FilterNewChatLogs,
        PollMessages,
        FetchOlderMessages
    }

}