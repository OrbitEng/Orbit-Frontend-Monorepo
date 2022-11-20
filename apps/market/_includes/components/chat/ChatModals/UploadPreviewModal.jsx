import Image from "next/image";
import { useState, Fragment, useEffect } from "react";
import { Dialog, Transition, Listbox } from "@headlessui/react";
import { useDropzone } from "react-dropzone";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { PlusIcon } from "@heroicons/react/24/outline";
import { CommissionFunctionalities } from "@functionalities/Transactions";
import { useCallback } from "react";

export function ChatUploadPreviewModal(props) {
	const [txid, setTxid] = useState(props.tx[0].txid);
    const {CommitPreview} = CommissionFunctionalities();

	const [fileUrls, setFileUrls] = useState([]);
	const [fileBlobs, setFileBlobs] = useState([]);
	const [statusMessage, setStatusMessage] = useState("percent completed");

    const SubmissionCallback = useCallback(async ()=>{
        if(!txid) return;
        await CommitPreview(
            txid,
            fileUrls
        );
        props.setOpen(false)
    },[CommitPreview, props, fileUrls])

	const onDrop = (acceptedFiles) => {
		acceptedFiles.forEach((fin)=>{
			const afr = new FileReader()
            afr.onload = () => {
				setFileBlobs(fsb => [...fsb, fin])
                setFileUrls(cf => [...cf, afr.result]);
            }
            afr.readAsDataURL(fin);
        });
	}

    const deleteFile = (index)=>{
		if(index == -1){
			return;
		}
		setFileUrls(cf => [...cf.slice(0,index), ...cf.slice(index+1)]);
		setFileBlobs(cf => [...cf.slice(0,index), ...cf.slice(index+1)]);
	}

    const {getRootProps, getInputProps, open} = useDropzone({onDrop});

	return(
		<Transition show={props.open} as={Fragment}>
			<Dialog as="div" className="fixed z-[260]" onClose={() => props.setOpen(false)}>
			<Transition.Child
				as={Fragment}
				enter="ease-out duration-300"
				enterFrom="opacity-0"
				enterTo="opacity-100"
				leave="ease-in duration-200"
				leaveFrom="opacity-100"
				leaveTo="opacity-0"
			>
				<div className="fixed inset-0 backdrop-blur" />
			</Transition.Child>
			<div className="fixed inset-0 overflow-y-auto">
				<div className="flex min-h-full items-center justify-center p-4 text-center">
				<Transition.Child
					as={Fragment}
					enter="ease-out duration-300"
					enterFrom="opacity-0 scale-95"
					enterTo="opacity-100 scale-100"
					leave="ease-in duration-[200ms]"
					leaveFrom="opacity-100 scale-100"
					leaveTo="opacity-0 scale-95"
				>
					<Dialog.Panel className={`w-[600px] transform rounded-2xl backdrop-blur bg-gradient-to-t from-[#32254EB3] to-[#26232CE6] border-t-[0.5px] border-[#474747] text-left align-middle shadow-xl transition-all duration-500`}>
						<div className="flex flex-col rounded-xl py-10 px-[4rem] w-full transition duration-700">
							<div className="top-0 left-0 flex flex-row pt-1 justify-center">
								<h1 className="text-3xl text-white font-bold">Upload Content</h1>
								<Listbox value={txid} onChange={setTxid} id="availability">
									<div className="flex flex-col relative w-3/4 text-xl h-1/2 justify-end">
										<Listbox.Button className="w-full h-full rounded-lg justify-center">
											<div className='w-full bg-[#242424] rounded-lg overflow-hidden h-4/5 ring-1 ring-inset ring-blue-200'>
												{(txid && txid.toString()) || ""}
											</div>
										</Listbox.Button>
										<Listbox.Options className="w-full text-center absolute -bottom-8 transition rounded-b">
											{
												props.tx.map(tx => (
													<Listbox.Option
														key={tx.txid}
														value = {tx.txid}
														className="w-full bg-[#242424] rounded-lg overflow-hidden h-4/5 ring-1 ring-inset ring-blue-200"
													>
														{tx.txid.toString()}
													</Listbox.Option>
												))
											}
										</Listbox.Options>
									</div>
								</Listbox>
								<div className="flex-grow"/>
								<button
									type="button"
									className="rounded-full text-white hover:text-white p-1 border-[#5b5b5b] border-[1px] focus:outline-none"
									onClick={() => props.setOpen(false)}
								>
									<span className="sr-only">Close panel</span>
									<XMarkIcon className="h-6 w-6 text-[#e2e2e2]" aria-hidden="true" />
								</button>
							</div>

							<div className="grid grid-cols-1 mt-8 border-[#545454] border-[1px] bg-[#131313] bg-opacity-[56%] h-[280px] rounded-xl text-white place-items-center">
								{
									(fileUrls.length > 0) ? 
									<div className="grid grid-cols-1 w-full h-full justify-center place-items-center border-red-400 border-8 overflow-y-auto scrollbar-thumb-[#5B5B5B] scrollbar-track-[#8E8E8E] scrollbar-thumb-rounded-full scrollbar-track-rounded-full place-items-center">
                                        {
                                            fileUrls.map((file, index)=>{
                                                return (
                                                    <div className="flex flex-row shrink-0 items-center gap-x-3 w-full h-1/3 border-2 px-2">
                                                        <div className="w-1/5 h-[90%] relative flex flex-col place-items-center rounded-lg overflow-hidden my-2">
                                                            <Image 
                                                                src={file}
                                                                layout="fill"
                                                                objectFit="cover"
                                                            />
                                                        </div>
                                                        <div className="flex flex-col flex-grow text-center">
                                                            <div className="text-lg font-bold ">{fileBlobs[index].name.slice(0,24)}</div>
                                                            <div>{[...fileBlobs[index].type.split("/"), fileBlobs[index].size].join("\u00B7")}</div>
                                                        </div>
                                                        <div className="absolute right-0 w-16 h-16" onClick={()=>{deleteFile(index)}}>
                                                            <XMarkIcon className="text-[#B74747] h-full"/>
                                                        </div>
                                                    </div>
                                                )
                                            }).concat(
                                                <div className="relative flex flex-row items-center gap-x-3 w-full h-1/3 border-2" {...getRootProps()}>
                                                    <div className="relative w-1/4 h-full">
                                                        <PlusIcon className="w-full h-full text-white"/>
                                                    </div>
                                                    <div>
                                                        Add another preview
                                                    </div>
                                                </div>
                                            )
                                        }
                                    </div>
									:
									<div className="w-4/5 h-4/5 flex flex-col justify-center border-dashed border-2 rounded-sm" {...getRootProps()}>
                                        <input {...getInputProps()}/>
										<div className="relative flex flex-col h-16 mx-16  place-items-center align-center">
											<Image
												src="/foldericon.svg"
												layout="fill"
												objectFit="contain"
											/>
										</div>
										<div className="flex flex-col">
											<span className="align-middle text-center my-auto mx-auto text-xl font-bold">Drag & Drop
												<span className="text-[#9944EE]"> fileBlobs</span>,
												<span className="text-[#9944EE]"> images</span>,
											</span>
											<span className="align-middle text-center my-auto mx-auto text-xl font-bold">
												<span className="text-[#9944EE]"> audio</span>,
												and more</span>
											<span className="align-middle mx-auto font-bold text-sm">Or <span className="text-[#9944EE] underline">browse for fileBlobs</span> on your computer</span>
										</div>
									</div>
								}
							</div>
							
							<div className="text-white py-4">{statusMessage}</div>
							
							<div className="w-full bg-[#131313] rounded-full overflow-hidden bg-opacity-[56%] h-6 border-[#545454] border-[1px]">
									<div className="rounded-full bg-[url('/progressgradient.png')] bg-center w-[40%] h-full border-[1px] background-clip-border"/>
							</div>

							<div className="flex flex-row justify-center text-white my-4">
								<div>Project completion</div>
								<div className="flex-grow"/>
								<div className="text-sm">60% complete</div>
							</div>

							<div className="h-2 w-full bg-[#2F2F2F] rounded-full overflow-hidden">
								<div className="rounded-full w-[40%] overflow-hidden bg-gradient-to-r from-[#3375F4] to-[#98E6FF] via-[#4FAEF7] bg-clip-content h-full"></div>
							</div>

							<button
								className={"py-4 px-8 z-[120] flex flex-row justify-center bg-[#008C1F3c] rounded-full mt-8 w-fit mx-auto opacity-100"}
								onClick={SubmissionCallback}
							>
								<span className="text-transparent bg-clip-text bg-gradient-to-t from-[#19B500] to-white font-bold flex flex-row my-auto">
									Commit Previews
								</span>
							</button>
						</div>
					</Dialog.Panel>
				</Transition.Child>
				</div>
			</div>
			</Dialog>
		</Transition>
	)
} 