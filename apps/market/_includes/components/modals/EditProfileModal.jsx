import { PlusIcon, UserCircleIcon, PlusCircleIcon, PencilIcon, XMarkIcon} from "@heroicons/react/24/outline";
import { MarketAccountFunctionalities } from "@functionalities/Accounts";
import { useState, useCallback, useEffect, Fragment, useContext} from "react";
import { Transition, Dialog } from '@headlessui/react';
import { useDropzone } from "react-dropzone";
import { Transaction } from "@solana/web3.js";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import Image from "next/image";
import UserAccountCtx from "@contexts/UserAccountCtx";
import BundlrCtx from "@contexts/BundlrCtx";

export function EditProfileModal(props) {
	const {userAccount} = useContext(UserAccountCtx);
	const { connection } = useConnection();
	const wallet = useWallet();

	const {bundlrClient} = useContext(BundlrCtx);

	const closeModal = async () => {
		setIsOpen(false)
	}
	const openModal = async() => {
		setIsOpen(true)
	}

	const {UpdateMetadata, SetPfp} = MarketAccountFunctionalities();
	const [name, setName] = useState();
	const [bio, setBio] = useState();
	const [uploadedPfp, setUploadedPfp] = useState();

	let [isOpen, setIsOpen] = useState(false);

	useEffect(()=>{
		if(userAccount && userAccount.data.metadata){
			setName(userAccount.data.metadata.name)
		}
		if(userAccount && userAccount.data.metadata){
			setBio(userAccount.data.metadata.bio)
		}
	},[userAccount])

	const pfpFileCallback = useCallback((acceptedFiles) => {
		const reader = new FileReader()
		reader.onload = () => {
			setUploadedPfp(reader.result)
		}
		reader.readAsDataURL(acceptedFiles[0])
	}, [])
	const {getRootProps, getInputProps, open} = useDropzone({onDrop: pfpFileCallback});

	const updateProfileCallback = useCallback(async ()=>{
		let latest_blockhash = await connection.getLatestBlockhash();
		let tx = new Transaction({
			feePayer: wallet.publicKey,
			... latest_blockhash
		});

		let ixs = [];
		let dataitems = [];

		if(uploadedPfp != undefined){
			let temp = await SetPfp(
				uploadedPfp,
				wallet
			);
			ixs.push(temp[0]);
			dataitems.push(...temp[1]);
		}
		if(userAccount && (bio || name)){
			let temp = await UpdateMetadata(
				{
					name: name,
					bio: bio
				},
				wallet
			);
			ixs.push(temp[0]);
			dataitems.push(...temp[1]);
		}

		tx.add(bundlrClient.FundInstructionSizes)

		tx.add(...
			ixs[0]
		);
		await wallet.signTransaction(tx);

		let sig = await wallet.sendTransaction(tx, connection);
		let confirmation  = await connection.confirmTransaction({
			...latest_blockhash,
			signature: sig,
		});
		console.log(confirmation);

		await bundlrClient.SendTxItems(dataitems);

		setIsOpen(false);

	},[uploadedPfp, bio, name, userAccount, wallet, connection, bundlrClient])

	return(
		<div>
			<button
				type="button"
				onClick={openModal}
				className="rounded-full h-fit my-auto p-2 flex bg-gradient-to-tr from-[#181424] via-buttontransparent2 to-buttontransparent border-t-[0.5px] border-[#474747]"
			>
				<PencilIcon className="text-white h-4 w-4 my-auto stroke-2"/>
			</button>
			<Transition appear show={isOpen} as={Fragment}>
				<Dialog as="div" className="relative z-[100]" onClose={closeModal}>
				<Transition.Child
					as={Fragment}
					enter="ease-out duration-300"
					enterFrom="opacity-0"
					enterTo="opacity-100"
					leave="ease-in duration-200"
					leaveFrom="opacity-100"
					leaveTo="opacity-0"
				>
					<div className="fixed inset-0 backdrop-blur-xl" />
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
						<Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl text-left align-middle shadow-xl transition-all">
							<div className="flex flex-col rounded-2xl max-w-md bg-gradient-to-t from-[#32254E78] to-[#26232C9C] border-t border-x border-[#545454] border-opacity-30 py-10 px-[4rem] mx-auto w-full">
								<div className="relative top-0 right-0 flex pt-1 pr-4 justify-end">
									<button
										type="button"
										className="rounded-full text-white hover:text-white p-1 border-[#5b5b5b] border-[1px] focus:outline-none"
										onClick={closeModal}
									>
										<span className="sr-only">Close panel</span>
										<XMarkIcon className="h-6 w-6 text-[#e2e2e2]" aria-hidden="true" />
									</button>
								</div>
								<h1 className="text-3xl text-white font-bold">Edit Profile</h1>
								<span className="text-[#848484] font-bold">
									Update your profile to look just the way you like it!
								</span>
								<div className="group cursor-pointer relative mt-5 mb-2 mx-auto justify-center w-fit" {...getRootProps()}>
									
										<input {...getInputProps()} onClick={open}/>
										{
											(uploadedPfp != undefined) ?
											<div className="relative w-32 h-32 overflow-hidden rounded-full">
												<div className="w-full h-full rounded-full overflow-hidden">
													<Image
														src={uploadedPfp}
														layout="fill"
														objectFit="cover"
													/>
												</div>
											</div>
											:
											<div>
												<div className="relative h-32 w-32 overflow-hidden rounded-full z-0">
													<Image

														src={((props?.currentAccount?.data?.profilePic?.charAt(0) == '/' || props?.currentAccount?.data?.profilePic?.slice(0,4) == 'http' || props?.currentAccount?.data?.profilePic?.slice(0,4) == 'data') && props?.currentAccount?.data?.profilePic) || "https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50?d=mp&f=y"}
														layout="fill"
														objectFit="cover"
													/>
												</div>
												<div className="absolute bottom-0 right-0 h-8 w-9 z-50">
														<PlusCircleIcon className="w-3 h-3 lg:w-10 lg:h-10 text-red-500" />
													</div>
											</div>
										}
									</div>
								<button className="bg-[#2C2F36] text-white font-semibold mx-auto px-3 py-2 rounded-2xl mb-3 mt-1 " onClick={open}>Choose Avatar</button>
								<div className="flex flex-col gap-y-3">
									<div className="flex flex-col justify-start gap-y-1">
										<label className="font-bold text-white text-lg">Name<span className="text-red-500">*</span></label>
										<input
											className="rounded-xl p-3 text-md text-white border-[1px] border-[#444457] bg-[#222429] placeholder:font-bold placeholder:text-[#454545]"
											placeholder="Enter Name"
											value={name}
											onChange={(e) => {setName(e.target.value)}}
										/>
									</div>
									<div className="flex flex-col justify-start gap-y-1">
										<label className="font-bold text-white text-lg">Bio</label>
										<textarea
											className="rounded-xl p-3 text-md text-white border-[1px] border-[#444457] bg-[#222429] placeholder:font-bold placeholder:text-[#454545]"
											placeholder="Enter Bio"
											value={bio}
											onChange={(e) => {setBio(e.target.value)}}
										/>
									</div>
									<button className="flex flex-row mt-6 mx-auto text-md rounded-full font-bold text-white bg-[#1773EB] align-middle my-auto px-6 py-2" onClick={updateProfileCallback}>
										Update Profile
									</button>
								</div>
							</div>
						</Dialog.Panel>
					</Transition.Child>
					</div>
				</div>
				</Dialog>
			</Transition>
		</div>
	)
}