import Image from "next/image";
import { TrashIcon, PaperClipIcon, CloudArrowUpIcon, TagIcon } from "@heroicons/react/24/outline";
import { useDropzone } from "react-dropzone";
import { useCallback, useContext, useEffect, useState } from "react";
import MatrixClientCtx from "@contexts/MatrixClientCtx";

export function ChatMessageInput(props){

    const {matrixClient} = useContext(MatrixClientCtx);
    const [textMesage, setTextMessage] = useState("");
    const [fileBlobs, setFileBlobs] = useState([]);

    const onDrop = (acceptedFiles) => {
        setFileBlobs(cf => [...cf, ...acceptedFiles]);
	}

    const deleteFile = (index)=>{
		if(index == -1){
			return;
		}
		setFileBlobs(cf => [...cf.slice(0,index), ...cf.slice(index+1)]);
	}

    const {open} = useDropzone({onDrop});


    const submitReview = useCallback(()=>{
        
    },[]);

    const attachPreview = useCallback(()=>{
        
    },[]);

    const submitFinal = useCallback(()=>{
        
    },[]);

    const sendChat = useCallback(async(e)=>{
        if(!(textMesage.length || fileBlobs.length) || !props.roomid) return;
        if(e.key == "Enter"){
            for(let uploadedimage of fileBlobs){
                await matrixClient.SendImage(props.roomid, uploadedimage)
            }
            if(textMesage != ""){
                await matrixClient.SendMessage(props.roomid, textMesage);
            }
            setTextMessage("");
            setFileBlobs([]);
            props.updateChat();
        };
    },[props.roomid, textMesage, fileBlobs]);

    

    return(
        <div className="flex flex-col  mx-3 bottom-0 mb-4 inset-x-0 p-3 bg-white bg-opacity-5 rounded-lg">
            {
                ((fileBlobs && fileBlobs.length > 0) &&
                
                    <div className="flex flex-row overflow-x-auto w-full my-2 border-b border-[#545454] place-items-center gap-x-4">
                        {
                            fileBlobs.map((imgfile, index)=>{
                                return (
                                    <div className="relative w-32 h-32 flex flex-col justify-center group w-full border-2" key={index}>
                                        <div className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 text-gray-700 z-[1]" onClick={()=>{deleteFile(index)}}>
                                            <TrashIcon className="w-8 h-8"/>
                                        </div>
                                        <div className="relative overflow-hidden rounded-md w-full h-full z-[0]">
                                            <Image 
                                                src={URL.createObjectURL(imgfile)}
                                                layout="fill"
                                                objectFit="contain"
                                            />
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                )
            }
            <div className="flex flex-row w-full">
                <input
                    className="flex flex-grow bg-transparent text-sm outline-none text-[#949494] placeholder:text-[#949494]"
                    type="text"
                    placeholder="Write a message..."
                    value={textMesage}
                    onChange={(e) => {setTextMessage(e.target.value)}}
                    onKeyDown={sendChat}
                />
                <div className="flex flex-row gap-x-2">
                    <button disabled className="disabled:cursor-not-allowed">
                        <PaperClipIcon className="h-5 w-5 text-[#949494]"/>
                    </button>
                    <div className="border-l-[#949494] border-l-[1px]" />
                    <button disabled className="disabled:cursor-not-allowed">
                        <CloudArrowUpIcon className="h-5 w-5 text-[#949494]"/>
                    </button>
                    <button disabled className="disabled:cursor-not-allowed">
                        <TagIcon className="h-5 w-5 text-[#949494]"/>
                    </button>
                </div>
            </div>
        </div>
    )
}