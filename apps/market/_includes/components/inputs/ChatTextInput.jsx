import Image from "next/image";
import { InformationCircleIcon, PaperClipIcon, CloudArrowUpIcon, TagIcon, PencilSquareIcon } from "@heroicons/react/24/outline";
import { useDropzone } from "react-dropzone";
import { Message, SelfMessage, ContractRequest } from "@includes/components/chat/Messages";
import { useEffect, useRef, useState } from "react";
import { ChatRoomFunctionalities } from "@functionalities/Chat";
import { useCallback, useContext } from "react";
import MatrixClientCtx from "@contexts/MatrixClientCtx";
import CommissionRequestModal from "@includes/components/modals/CommissionRequestModal";

export function ChatTextInput(props){
    const {matrixClient} = useContext(MatrixClientCtx);
    const [textMesage, setTextMessage] = useState("");
    const [openRequestModal, setOpenRequestModal] = useState(false);
    const [file, setFile] = useState("");

    const onDrop = (acceptedFiles) => {
        const afr = new FileReader()
            afr.onload = () => {
                setFile(afr.result);
            }
            afr.readAsDataURL(acceptedFiles[0]);
	}
	const {open} = useDropzone({onDrop});

    const submitReview = useCallback(()=>{
        
    },[]);

    const attachPreview = useCallback(()=>{
        
    },[]);

    const submitFinal = useCallback(()=>{
        
    },[]);

    const sendChat = useCallback(async(e)=>{
        if(textMesage == "" || !props.roomid) return;
        if(e.key == "Enter"){
            setTextMessage("");
            await matrixClient.SendMessage(props.roomid, textMesage);
            props.updateChat();
        };
    },[props.roomid, textMesage])

    return(
        <div className="sticky flex flex-row mx-3 bottom-0 mb-4 inset-x-0 p-3 bg-white bg-opacity-5 rounded-lg">
            <input
                className="flex flex-grow bg-transparent text-sm outline-none text-[#949494] placeholder:text-[#949494]"
                type="text"
                placeholder="Write a message..."
                value={textMesage}
                onChange={(e) => {setTextMessage(e.target.value)}}
                onKeyDown={sendChat}
            />
            <div className="flex flex-row justify-between w-24">
                <PaperClipIcon className="h-5 w-5 text-[#949494]" onClick={open}/>
                <div className="border-x border-[#4D4D4D]" />
                <CloudArrowUpIcon className="h-5 w-5 text-[#949494]"/>
                <button className="flex" onClick={() => {setOpenRequestModal(true)}}>
                    <TagIcon className="h-5 w-5 text-[#949494]"/>
                </button>
            </div>
            <CommissionRequestModal open={openRequestModal} setOpen={setOpenRequestModal} />
        </div>
    )
}