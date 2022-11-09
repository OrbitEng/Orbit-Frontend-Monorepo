import { useContext, useState, useCallback } from "react";
import DigitalMarketCtx from "@contexts/DigitalMarketCtx";
import MatrixClientCtx from "@contexts/MatrixClientCtx";
import { DigitalFunctionalities } from "@functionalities/Transactions";
import { SelfMessage, Message  } from "@includes/components/chat/Messages";
import Image from "next/image";


export function ChatRoomFunctionalities(
    roomId,
    txAddr = "",
    pfpData = "https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50?d=mp&f=y"
){
    const {matrixClient} = useContext(MatrixClientCtx);
    // const {digitalMarketClient} = useContext(DigitalMarketCtx);
    const {DecryptImage} = DigitalFunctionalities();
    // const [arweaveClient, setArweaveClient] = useState(new ArQueryClient());

    const FilterNewChatLogs = async(events) =>{
        console.log(events)
        let logs = [];
        for(let event of events.filter(e => e.clearEvent)){
            let message = event.clearEvent
            if(message.type != "m.room.message"){
                return undefined;
            }
    
            let children = undefined;
            let msgtext = "";
            let imagesrc = "";

            // todo: take care of common mimetypes
            // type : content.info.mimetype
            switch(message.content.msgtype){
                case "m.notice":
                    continue;
                    let [noticetype, noticebody] = message.content.body.split(":")[0];
                    switch(noticetype){
                        case "chosenblocks":
                            break;
                        case "proposerate":
                            break;
                        case "previewupdated":
                            break;
                        case "finaluploaded":
                            break;
                    }
                    
                    break;
                case "m.text":
                    msgtext = message.content.body;
                    break;
                case "m.image":
                    // msgtext = message.content.body;
                    if(typeof message.content.url != "string")continue;
                    imagesrc = matrixClient.matrixclient.mxcUrlToHttp(message.content.url);
                    break;
                case "m.file":
                    break;
                case "m.audio":
                    break;
                case "m.video":
                    break;
            };

            let retelement = event.sender.name == matrixClient.matrix_name ?
            <SelfMessage text={msgtext} imagesrc={imagesrc}>
                {children}
            </SelfMessage>
            :
            <Message text={msgtext} pfp={pfpData} imagesrc={imagesrc}>
                {children}
            </Message>;
            
            logs.push(retelement)
        }
        return logs
    }

    /**
     * lazy loading
     */
    const FetchOlderMessages = async(logs_length) =>{
        return matrixClient.UpdateRoomOlderMessages(roomId, logs_length)
    }

    return {
        FilterNewChatLogs,
        FetchOlderMessages
    }

}