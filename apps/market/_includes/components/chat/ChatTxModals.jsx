import Image from "next/image";
import { Fragment, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useDropzone } from "react-dropzone";
import { ChevronLeftIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { Wallet } from "@project-serum/anchor";
import { useState } from "react";


export function ChatUploadPreviewModal(props) {
	const [fileUrls, setFileUrls] = useState([]);
	const [fileBlobs, setFileBlobs] = useState([]);
	const [statusMessage, setStatusMessage] = useState("percent completed");

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

							<div className="flex mt-8 flex-col border-[#545454] border-[1px] bg-[#131313] bg-opacity-[56%] min-h-[280px] h-full rounded-xl justify-center place-items-center text-white" {...getRootProps()}>
								<input {...getInputProps()}/>
								{
									(fileUrls.length > 0) ? 
									
									fileUrls.map((file, index)=>{
										return (
											<div className="flex flex-row items-center w-[90%] h-[100%] border-2">
												<div className="relative h-full w-[20%] flex-shrink-0 rounded-md flex flex-col place-items-center">
													<Image 
														src={file}
														layout="fill"
														objectFit="cover"
													/>
												</div>
												<div className="flex flex-col flex-grow text-sm">
													<div>{fileBlobs[index].name}</div>
													<div>{[...fileBlobs[index].type.split("/"), fileBlobs[index].size].join("\u00B7")}</div>
												</div>
												<XMarkIcon className="text-[#B74747] h-full"/>
											</div>
										)
									})
									:
									<div className="w-[80%] h-full flex flex-col place-items-center py-4 px-4 border-dashed border-2 rounded-sm">
										<div className="relative flex h-20 mx-16 w-full place-items-center">
											<Image
												src="/PhotoIcon.png"
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
								onClick={()=>{}}
							>
								<span className="text-transparent bg-clip-text bg-gradient-to-t from-[#19B500] to-white font-bold flex flex-row my-auto">
									Save & Confirm
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

export function CommissionRequestModal(props) {
	const [files, setFiles] = useState([]);
	const [statusMessage, setStatusMessage] = useState("percent completed");

	const onDrop = (acceptedFiles) => {
		acceptedFiles.forEach((fin)=>{
            const afr = new FileReader()
            afr.onload = () => {
                setFiles(cf => [...cf, ...acceptedFiles]);
            }
            afr.readAsDataURL(fin);
        });
	}

    const deleteFile = (index)=>{
		if(index == -1){
			return;
		}
		setFiles(cf => [...cf.slice(0,index), ...cf.slice(index+1)]);
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
					<Dialog.Panel className={`w-[860px] transform overflow-hidden rounded-2xl backdrop-blur bg-gradient-to-t from-[#32254EB3] to-[#26232CE6] border-t-[0.5px] border-[#474747] text-left align-middle shadow-xl transition-all duration-500`}>
						<div className="flex flex-col rounded-xl py-10 px-[4rem] w-full transition duration-700">
							<div className="top-0 left-0 flex flex-row pt-1 justify-center">
								<h1 className="text-3xl text-white font-bold">Upload Content</h1>
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
							
							<div className="text-white py-4">{statusMessage}</div>
							
							<div className="w-full bg-white rounded-full overflow-hidden bg-opacity-[56%] h-6 border-[#545454] border-[1px]">
									<div className="rounded-full bg-[url('/bargradient.png')] w-[60%] h-full border-2 background-clip-border">

									</div>
							</div>
						</div>
					</Dialog.Panel>
				</Transition.Child>
				</div>
			</div>
			</Dialog>
		</Transition>
	)
} 