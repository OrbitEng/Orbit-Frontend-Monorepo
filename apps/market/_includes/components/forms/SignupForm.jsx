import { PlusIcon, UserCircleIcon, PlusCircleIcon } from "@heroicons/react/24/outline";
import { MarketAccountFunctionalities } from "@functionalities/Accounts";
import Image from "next/image";
import { useState, useCallback, useEffect, useContext } from "react";
import { useDropzone } from "react-dropzone";
import { XMarkIcon } from "@heroicons/react/24/solid";
import UserAccountCtx from "@contexts/UserAccountCtx";

import MatrixClientCtx from "@contexts/MatrixClientCtx";
import ReCAPTCHA from "react-google-recaptcha";

export function SignupForm(props) {
	const [nickName, setName] = useState("");
	const [biography, setBio] = useState("");
	const [reflink, setReflink] = useState("");
	const {CreateAccount} = MarketAccountFunctionalities();
	const {setUserAccount} = useContext(UserAccountCtx);
	const {matrixClient} = useContext(MatrixClientCtx)

	const [pfp, setPfp] = useState("");
	
	const [captchaVal, setCaptchaVal] = useState(undefined);
	const [matrixCaptchaPubkey, setMatrixCaptchaPubkey] = useState(undefined);
	const [matrixSession, setMatrixSession] = useState(undefined)

	useEffect(async ()=>{
		if(!matrixClient || matrixClient.logged_in)return;
		try{
			let res = await matrixClient.CreateAccountInit();
			setMatrixCaptchaPubkey(res.data.params["m.login.recaptcha"].public_key);
			setMatrixSession(res.data.session);
		}catch(e){
			return;
		}
	},[matrixClient])

	useEffect(async ()=>{
		if(!captchaVal)return;
		await matrixClient.CreateAccountCaptcha(captchaVal, matrixSession);
		await matrixClient.CreateAccountFinish(matrixSession)
	},[captchaVal])

	const createAccountCallback = useCallback(async ()=>{
		let acc = await CreateAccount(
			{
				name: nickName,
				bio: biography
			},
			pfp,
			reflink
		);
		props.setOpen(false);
		props.setMarketAccount(acc);
		setUserAccount(acc);
	},[pfp, reflink, nickName, biography])

	const pfpFileCallback = useCallback((acceptedFiles) => {
		const reader = new FileReader()
		reader.onload = () => {
			setPfp(reader.result)
		}
		reader.readAsDataURL(acceptedFiles[0]);
	}, [])
	const {getRootProps, getInputProps, open} = useDropzone({onDrop: pfpFileCallback});

	return(
		<div className="rounded-2xl max-w-lg bg-gradient-to-t from-[#32254E78] to-[#26232C9C] border-t border-x border-[#545454] border-opacity-30 py-10 px-16 mx-auto">
			<div className="relative top-0 right-0 flex pt-1 justify-end">
				<button
					type="button"
					className="rounded-full text-white hover:text-white p-1 border-[#5b5b5b] border-[1px] focus:outline-none"
					onClick={() => props.setOpen(false)}
				>
					<span className="sr-only">Close panel</span>
					<XMarkIcon className="h-6 w-6 text-[#e2e2e2]" aria-hidden="true" />
				</button>
			</div>
			<h1 className="text-4xl text-white font-bold mb-1">Sign Up</h1>
			<span className="text-[#848484] font-bold">
				Create an account to list and buy products!
			</span>
			<div className="group cursor-pointer relative my-5 mx-auto justify-center w-fit" {...getRootProps()}>
				<input {...getInputProps()}  onClick={open}/>
				<div className="flex absolute bottom-4 right-4 bg-blue-500 rounded-full h-8 w-8 align-middle">
					<PlusIcon className="h-5 w-5 text-white my-auto mx-auto stroke-[4px]"/>
				</div>
				
				{
					pfp ? 
					<div className="h-32 w-32 relative">
						<Image
							src={pfp || "/"}
							layout="fill"
							objectFit="cover"
						/>
					</div> : <UserCircleIcon className="h-32 w-32 text-white mx-auto"/>
				}
			</div>
			<div className="flex flex-col gap-y-4">
				<div className="flex flex-col justify-start gap-y-1">
					<label className="font-bold text-white text-lg">Name<span className="text-red-500">*</span></label>
					<input
						required
						className="rounded-lg p-3 text-white border-[1px] border-[#40444F] bg-[#222429] placeholder:font-bold placeholder:text-[#454545]"
						placeholder="Enter Name"
						value={nickName}
						onChange={(e) => {setName(e.target.value)}}
					/>
				</div>
				<div className="flex flex-col justify-start gap-y-1">
					<label className="font-bold text-white text-lg">Referral Link</label>
					<input
						className="rounded-lg p-3 text-white border-[1px] border-[#40444F] bg-[#222429] placeholder:font-bold placeholder:text-[#454545]"
						placeholder="Enter Referral Link"
						value={reflink}
						onChange={(e) => {setReflink(e.target.value)}}
					/>
				</div>
				<div className="flex flex-col justify-start gap-y-1">
					<label className="font-bold text-white text-lg">Bio</label>
					<textarea
						className="rounded-lg p-3 text-white border-[1px] border-[#40444F] bg-[#222429] placeholder:font-bold placeholder:text-[#454545]"
						placeholder="Enter Bio"
						value={biography}
						onChange={(e) => {setBio(e.target.value)}}
					/>
				</div>
				{
					(matrixCaptchaPubkey && matrixSession) && <ReCAPTCHA 
						sitekey = {matrixCaptchaPubkey}
						onChange = {setCaptchaVal}
					/>
				}
				<button
					className="flex flex-row mt-6 w-full rounded-lg align-middle my-auto py-5 bg-white bg-opacity-10 hover:scale-105 transition duration-200"
					onClick={createAccountCallback}
				>
					<span className="mx-auto text-2xl font-sans font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#D55CFF] to-[#8BBAFF]">Sign Up!</span>
				</button>
			</div>
		</div>
	)

}