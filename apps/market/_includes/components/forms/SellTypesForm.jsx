import { useDropzone } from "react-dropzone";
import { useState, useCallback } from "react";
import Image from "next/image";
import { XMarkIcon } from "@heroicons/react/24/solid";


export function PhysicalProductForm(props){
    
    return (
        <div >
            <div className="flex flex-col gap-y-6">
					<label htmlFor="description" className="text-white font-semibold text-xl">Stock</label>
					<input
						className="rounded-lg p-3 text-lg focus:outline-0 bg-[#171717] text-[#8E8E8E] placeholder:text-[#4E4E4E]"
						placeholder="Quantity"
						type="number"
						min="1"
						id="qty"
						name="qty"
						onChange={(e)=>{props.setMetaInf(metainf => {metainf.quantity = e.target.value; return metainf})}}
					/>
				</div>
				<div className="flex flex-col gap-y-6">
					<label htmlFor="description" className="text-white font-semibold text-xl">Delivery</label>
					<input
						className="rounded-lg p-3 text-lg focus:outline-0 bg-[#171717] text-[#8E8E8E] placeholder:text-[#4E4E4E]"
						placeholder="Delivery ETA"
						type="number"
						min="1"
						id="delivery"
						name="delivery"
						onChange={(e)=>{props.setMetaInf(metainf => {metainf.delivery = e.target.value; return metainf})}}
					/>
				</div>
        </div>
    )
}

export function DigitalProductForm(props){
	const [files, setFiles] = useState([]);
    const [fileNames, setFileNames] = useState([]);

	const addFile = (acceptedFiles) => {
        acceptedFiles.forEach((fin)=>{
            const afr = new FileReader()
            afr.onload = () => {
                setFiles(cf => [...cf, afr.result]);
            }
            afr.readAsDataURL(fin);

            setFileNames(fn => [...fn, [fin.name.split(".")[0],fin.type, fin.size] ]);
        });
	}

	const deleteFile = (filein)=>{
		let index = files.indexOf(filein);
		if(index == -1){
			return;
		}
		setFiles(cf => [...cf.slice(0,index), ...cf.slice(index+1)]);
        setFileNames(fn => [...fn.slice(0,index), ...fn.slice(index+1)]);
	}

	const {getRootProps, getInputProps, open} = useDropzone({onDrop: addFile});

    return (
        <div>
			<div className="flex flex-col gap-y-6">
				<label htmlFor="description" className="text-white font-semibold text-xl">Content Files</label>
				<div className="w-full bg-[#100e14] rounded-lg">
					
                    <div className="w-4/5 h-4/5 flex flex-col justify-center items-center border-dashed border rounded-sm border-[#9783d0] mx-auto my-6 py-6" {...getRootProps()}>
                        <input {...getInputProps()}/>

                        <div className="relative h-12 w-12 rounded-3xl flex flex-col bg-[#2c1c3c] justify-center place-items-center align-center">
                            <Image
                                src="/foldericon.svg"
                                layout="fixed"
                                width={30}
                                height={30}
                            />
                        </div>

                        <div className="flex flex-col text-white text-2xl">
                            <span className="align-middle text-center my-auto mx-auto font-bold">Drag & Drop
                                <span className="text-[#9944EE]"> files</span>,
                                <span className="text-[#9944EE]"> images</span>,
                                <span className="text-[#9944EE]"> audio</span>,
                            </span>
                            <span className="align-middle text-center my-auto mx-auto font-bold">
                                and more</span>
                            <span className="align-middle mx-auto font-bold text-lg">Or <span className="text-[#9944EE] underline">browse for files</span> on your computer</span>
                        </div>
                    </div>
                        {
                    
                            files?.length > 0 && 
                            <div className="text-white h-52">
                                {
                                    files.map((file, fileind)=>(
                                        <div className="flex flex-row w-full h-1/3 justify-center">
                                            <div className="relative h-12 w-12">
                                                <Image
                                                    src = {file}
                                                    layout="fill"
                                                    objectFit="contain"
                                                />
                                            </div>
                                            <div className="">
                                                {fileNames[fileind][0]}
                                            </div>
                                            <div className="">
                                                {fileNames[fileind][1].split("/")[0]}
                                                <span className="w-2 h-2 rounded-lg"/>
                                                {fileNames[fileind][1].split("/")[1]}
                                                <span className="w-2 h-2 rounded-lg"/>
                                            </div>
                                            <div className="w-5 h-5">
                                                <XMarkIcon className="text-[#b74747]"/>
                                            </div>
                                        </div>
                                    ),[])
                                }
                            </div>
                        }
				</div>
			</div>
        </div>
    )
}

export function CommissionProductForm(props){
    return(
        <div>

        </div>
    )
}