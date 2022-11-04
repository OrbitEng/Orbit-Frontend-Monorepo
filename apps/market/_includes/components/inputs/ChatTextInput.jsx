import Image from "next/image";
import { TrashIcon, PaperClipIcon, CloudArrowUpIcon, TagIcon } from "@heroicons/react/24/outline";
import { useDropzone } from "react-dropzone";
import { useState } from "react";
import { useCallback, useContext } from "react";
import MatrixClientCtx from "@contexts/MatrixClientCtx";
import CommissionRequestModal from "@includes/components/modals/CommissionRequestModal";

export function ChatTextInput(props){
    const {matrixClient} = useContext(MatrixClientCtx);
    const [textMesage, setTextMessage] = useState("");
    const [openRequestModal, setOpenRequestModal] = useState(false);
    const [files, setFiles] = useState([]);

    const onDrop = (acceptedFiles) => {
        acceptedFiles.forEach((fin)=>{
            const afr = new FileReader()
            afr.onload = () => {
                setFiles(cf => [...cf, afr.result]);
            }
            afr.readAsDataURL(fin);
        });
	}

    const deleteFile = (filein)=>{
		let index = files.indexOf(filein);
		if(index == -1){
			return;
		}
		setFiles(cf => [...cf.slice(0,index), ...cf.slice(index+1)]);
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
            for(let uploadedimage of files){
                await matrixClient.UploadImage(props.roomid, uploadedimage)
            }
            await matrixClient.SendMessage(props.roomid, textMesage);
            setTextMessage("");
            props.updateChat();
        };
    },[props.roomid, textMesage, files])

    return(
        <div className="absolute flex flex-col  mx-3 bottom-0 mb-4 inset-x-0 p-3 bg-white bg-opacity-5 rounded-lg">
            {
                ((files && files.length > 0) &&
                
                    <div className="flex flex-row overflow-x-auto w-full my-2 border-b border-[#545454] place-items-center border-2 gap-4">
                        {
                            files.map((imgfile)=>{
                                return (
                                    <div className="relative w-32 h-32 flex flex-col justify-center group w-full border-2">
                                        <div className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 text-gray-700 z-[1]">
                                            <TrashIcon className="w-8 h-8"/>
                                        </div>
                                        <div className="relative overflow-hidden rounded-md w-full h-full z-[0]">
                                            <Image 
                                                src={imgfile}
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
        </div>
    )
}