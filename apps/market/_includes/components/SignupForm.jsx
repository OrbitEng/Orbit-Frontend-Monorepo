import { PlusIcon, UserCircleIcon, PlusCircleIcon } from "@heroicons/react/24/outline";
import { MarketAccountFunctionalities } from "@functionalities/Accounts";
import Image from "next/image";
import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { useEffect } from "react";
import { XMarkIcon } from "@heroicons/react/24/solid";

export function SignupForm(props) {
	const [nickName, setName] = useState();
	const [biography, setBio] = useState();
	const [reflink, setReflink] = useState();
	const {CreateAccount} = MarketAccountFunctionalities();

	const [pfp, setPfp] = useState();
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
					<div className="h-32 w-32">
						<Image
							src={pfp || "/"}
							width={100}
							height={100}
							layout="fill"
							objectFit="cover"
						/>
					</div> : <UserCircleIcon className="h-32 w-32 text-white mx-auto"/>
				}
			</div>
			<div className="flex flex-col gap-y-4">
				
				<div className="flex flex-col justify-start gap-y-1">
					<label className="font-bold text-white text-xl">Name<span className="text-red-500">*</span></label>
					<input
						required
						className="rounded-lg p-3 text-white border-2 border-[#40444F] bg-[#222429] placeholder:font-bold placeholder:text-[#454545]"
						placeholder="Enter Name"
						value={nickName}
						onChange={(e) => {setName(e.target.value)}}
					/>
				</div>
				<div className="flex flex-col justify-start gap-y-1">
					<label className="font-bold text-white text-xl">Referral Link</label>
					<input
						className="rounded-lg p-3 text-white border-2 border-[#40444F] bg-[#222429] placeholder:font-bold placeholder:text-[#454545]"
						placeholder="Enter Referral Link"
						value={reflink}
						onChange={(e) => {setReflink(e.target.value)}}
					/>
				</div>
				<div className="flex flex-col justify-start gap-y-1">
					<label className="font-bold text-white text-xl">Bio</label>
					<textarea
						className="rounded-lg p-3 text-white border-2 border-[#40444F] bg-[#222429] placeholder:font-bold placeholder:text-[#454545]"
						placeholder="Enter Bio"
						value={biography}
						onChange={(e) => {setBio(e.target.value)}}
					/>
				</div>
				<button
					className="flex flex-row mt-6 w-full rounded-lg align-middle my-auto py-5 bg-white bg-opacity-10 hover:scale-105 transition duration-200"
					onClick={()=>{
						CreateAccount(
							{
								name: nickName,
								bio: biography
							},
							pfp,
							reflink
						);
					}}
				>
					<span className="mx-auto text-2xl font-sans font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#D55CFF] to-[#8BBAFF]">Sign Up!</span>
				</button>
			</div>
		</div>
	)

}

export function EditModal(props) {
	const {UpdateMetadata, SetPfp} = MarketAccountFunctionalities();
	const [name, setName] = useState();
	const [bio, setBio] = useState();

	const [uploadedPfp, setUploadedPfp] = useState();

	useEffect(()=>{
		if(props.currentAccount && props.currentAccount.data.metadata){
			setName(props.currentAccount.data.metadata.name)
		}
		if(props.currentAccount && props.currentAccount.data.metadata){
			setBio(props.currentAccount.data.metadata.bio)
		}
	},[props.currentAccount])

	const pfpFileCallback = useCallback((acceptedFiles) => {
		const reader = new FileReader()
		reader.onload = () => {
			setUploadedPfp(reader.result)
		}
		reader.readAsDataURL(acceptedFiles[0])
	}, [])
	const {getRootProps, getInputProps, open} = useDropzone({onDrop: pfpFileCallback});

	const updateProfileCallback = useCallback(async ()=>{
		if(uploadedPfp != undefined){
			await SetPfp(uploadedPfp)
		}
		if(props.currentAccount && (bio || name)){
			await UpdateMetadata({
				name: name,
				bio: bio
			})
		}
	},[uploadedPfp, bio, name, props.currentAccount])

	return(
		<div className="flex flex-col rounded-2xl max-w-md bg-gradient-to-t from-[#32254E78] to-[#26232C9C] border-t border-x border-[#545454] border-opacity-30 py-10 px-[4rem] mx-auto w-full">
			<div className="relative top-0 right-0 flex pt-1 pr-4 justify-end">
				<button
					type="button"
					className="rounded-full text-white hover:text-white p-1 border-[#5b5b5b] border-[1px] focus:outline-none"
					onClick={() => props.setOpen(false)}
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
							<div className="w-full h-full">
								<Image
									src={uploadedPfp}
									layout="fill"
									objectFit="cover"
								/>
							</div>
						</div>
						:
						<div>
							<div className="flex flex-shrink-0 relative h-32 w-32 overflow-hidden rounded-full z-0">
								<Image
									src={props?.currentAccount?.data?.profilepic || "https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50?d=mp&f=y"}
									layout="fill"
									objectFit="contain"
								/>
							</div>
							<div className="absolute bottom-0 right-0 h-8 w-9 z-50">
									<PlusCircleIcon className="w-3 h-3 lg:w-10 lg:h-10 text-red-500" />
								</div>
						</div>
					}
				</div>
			<button className="bg-[#222429] text-white font-semibold text-lg mx-auto px-3 py-1 rounded-full mb-4" onClick={open}>Choose Avatar</button>
			<div className="flex flex-col gap-y-3">
				<div className="flex flex-col justify-start gap-y-1">
					<label className="font-bold text-white text-lg">Name<span className="text-red-500">*</span></label>
					<input
						className="rounded-lg p-2 text-white border-2 border-[#40444F] bg-[#222429] placeholder:font-bold placeholder:text-[#454545]"
						placeholder="Enter Name"
						value={name}
						onChange={(e) => {setName(e.target.value)}}
					/>
				</div>
				<div className="flex flex-col justify-start gap-y-1">
					<label className="font-bold text-white text-lg">Bio</label>
					<textarea
						className="rounded-lg p-2 text-white border-2 border-[#40444F] bg-[#222429] placeholder:font-bold placeholder:text-[#454545]"
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
	)
}