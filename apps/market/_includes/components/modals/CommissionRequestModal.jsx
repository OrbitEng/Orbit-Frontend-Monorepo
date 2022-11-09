import { Fragment, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useDropzone } from "react-dropzone";
import { ChevronLeftIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { Wallet } from "@project-serum/anchor";
import { useState } from "react";

export default function CommissionRequestModal(props) {
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

							<div className="flex mt-8 flex-col border-[#545454] border-[1px] bg-[#131313] bg-opacity-[56%] min-h-[360px] h-full rounded-xl" {...getRootProps()}>
								<input {...getInputProps()}/>
								{
									(files.length > 0) ? 
									
									files.map((file)=>{
										return 
											<div>
											</div>
									})
									:
									<div className="w-[90%] ">

									</div>
								}
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