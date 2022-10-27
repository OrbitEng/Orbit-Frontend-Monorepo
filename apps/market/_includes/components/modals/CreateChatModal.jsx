import Link from 'next/link';
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useContext, useState, useEffect} from "react"
import { CloudArrowUpIcon, InformationCircleIcon, MagnifyingGlassIcon, PaperClipIcon, PencilSquareIcon, TagIcon, XMarkIcon } from "@heroicons/react/24/outline";
import MatrixClientCtx from "@contexts/MatrixClientCtx";
import ReCAPTCHA from "react-google-recaptcha";
import { useCallback } from 'react';

export function CreateChatModal(props){
    console.log("chat modal openend")
    const {matrixClient} = useContext(MatrixClientCtx);
    const [captchaVal, setCaptchaVal] = useState(undefined);
	const [matrixCaptchaPubkey, setMatrixCaptchaPubkey] = useState(undefined);
	const [matrixSession, setMatrixSession] = useState(undefined);

    const [isOpen, setIsOpen] = useState(false);

    function closeModal() {
        setIsOpen(false)
    }
    
    function openModal() {
        setIsOpen(true)
    }

    useEffect(async ()=>{
		if(!matrixClient || matrixClient.logged_in)return;

		let res = await matrixClient.CreateAccountInit();
		setMatrixCaptchaPubkey(res.data.params["m.login.recaptcha"].public_key);
		setMatrixSession(res.data.session);
        openModal()
	},[matrixClient])

	let createChat = useCallback(async ()=>{
		if(!captchaVal)return;
		await matrixClient.CreateAccountCaptcha(captchaVal, matrixSession);
		await matrixClient.CreateAccountFinish(matrixSession);
        await matrixClient.Login();
        props.setChat(true);
	},[captchaVal])

    return (
        <div className='w-screen h-screen'>
            <Transition appear show={isOpen} as={Fragment}>
			<Dialog as="div" className="relative z-[200]" onClose={closeModal} static={true}>
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
					leave="ease-in duration-200"
					leaveFrom="opacity-100 scale-100"
					leaveTo="opacity-0 scale-95"
				>
					<div>
						<Dialog.Panel className="w-full max-w-xl rounded-2xl transform overflow-hidden backdrop-blur bg-gradient-to-t from-[#32254EB3] to-[#26232CE6] border-t-[0.5px] border-[#474747] shadow-xl">
							<div className='flex flex-col text-white w-max max-w-md h-fit text-center p-6'>
                                <div className='text-5xl font-bold my-2 mx-auto flex'>
                                    <span className='text-transparent bg-clip-text bg-gradient-to-r from-[#16C7FF] to-[#C625FF]'> Hold on! </span>
                                </div>
                                <span>
                                    Make a catalog first before you list!
                                </span>
                                <span>
                                    That way, your products can be seen by everyone
                                </span>
                                {
                                    (matrixCaptchaPubkey && matrixSession) && 
                                    <div className='w-[90%] flex flex-row place-items-center'>
                                        <ReCAPTCHA 
                                            sitekey = {matrixCaptchaPubkey}
                                            onChange = {setCaptchaVal}
                                        />
                                    </div>
                                }
                                <div className='flex flex-row w-full justify-evenly pt-6 pb-2'>
									<button 
										className='flex border-[1px] border-[#5B5B5B] font-bold hover:scale-[105%] px-4 py-2 rounded-lg'
										onClick={createChat}
									>
										<span>Create</span>
									</button>
									<Link href={"/"}>
										<div className='flex border-[1px] border-[#5B5B5B] font-bold hover:scale-[105%] px-4 py-2 rounded-lg'>
												Later
										</div>
									</Link>
                                </div>
                            </div>
						</Dialog.Panel>
					</div>
				</Transition.Child>
				</div>
			</div>
			</Dialog>
		</Transition>
        </div>
    )
}