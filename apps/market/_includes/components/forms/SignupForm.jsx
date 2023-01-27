import { PlusIcon, UserCircleIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { MarketAccountFunctionalities } from "@functionalities/Accounts";
import { useState, useCallback, useEffect, useContext } from "react";
import { useDropzone } from "react-dropzone";
import Image from "next/image";

import UserAccountCtx from "@contexts/UserAccountCtx";
import MatrixClientCtx from "@contexts/MatrixClientCtx";
// import ReCAPTCHA from "react-google-recaptcha";

import { ACCOUNTS_PROGRAM } from "orbit-clients";

import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { Transaction } from "@solana/web3.js";
import { GenAccountAddress } from "orbit-clients/clients/MarketAccountsClient";
import BundlrCtx from "@contexts/BundlrCtx";

export function SignupForm(props) {
	const wallet = useWallet();
	const {connection} = useConnection();

	const [nickName, setName] = useState("");
	const [biography, setBio] = useState("");
	const [reflink, setReflink] = useState("");
	const {CreateAccount} = MarketAccountFunctionalities();
	const {setUserAccount} = useContext(UserAccountCtx);
	const {matrixClient} = useContext(MatrixClientCtx);

	const [pfp, setPfp] = useState("");
	const {bundlrClient} = useContext(BundlrCtx);
	
	// const [matrixCaptchaPubkey, setMatrixCaptchaPubkey] = useState(undefined);
	// const [captchaVal, setCaptchaVal] = useState(undefined);
	// if(!captchaVal)return;
	// await matrixClient.CreateAccountCaptcha(captchaVal, matrixSession);
	// setMatrixCaptchaPubkey(res.data.params["m.login.recaptcha"].public_key);

	useEffect(async ()=>{
		if(!matrixClient || matrixClient.chatrooms)return;
		try{
			let res = await matrixClient.CreateAccountInit();
			await matrixClient.CreateAccountFinish(res.data.session)
		}catch(e){
			console.log(e);
			return;
		}
	},[matrixClient])

	const createAccountCallback = useCallback(async ()=>{
		console.log("creating account")
		let latest_blockhash = await connection.getLatestBlockhash();
		let tx = new Transaction({
			feePayer: wallet.publicKey,
			... latest_blockhash
		});

		let [instructions, data_items] = await CreateAccount(
			{
				name: nickName,
				bio: biography
			},
			pfp,
			reflink,
			wallet
		);

		tx.add(...instructions);
		await wallet.signTransaction(tx);

		let sig = await wallet.sendTransaction(tx, connection);
		
		let confirmation  = await connection.confirmTransaction({
			...latest_blockhash,
			signature: sig,
		});
		

		await bundlrClient.SendTxItems(data_items, sig);
		props.setOpen(false);
		setUserAccount( await ACCOUNTS_PROGRAM.GetAccount(GenAccountAddress(wallet.publicKey)));
	},[pfp, reflink, nickName, biography, bundlrClient, wallet.publicKey, ACCOUNTS_PROGRAM.MARKET_ACCOUNTS_PROGRAM._provider.connection])

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
					<div className="h-32 w-32 relative rounded-full overflow-hidden">
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