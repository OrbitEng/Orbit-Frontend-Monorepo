import { PlusIcon, UserCircleIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import { useState } from "react";

export function SignupForum(props) {
	const [name, setName] = useState();
	const [bio, setBio] = useState();

	return(
		<div className="rounded-xl max-w-xl bg-[#141619] py-10 px-20 mx-auto">
			<h1 className="text-4xl text-white font-bold">Sign Up</h1>
			<span className="text-[#848484]">
			You account is the key to the Orbit market network. Create an account to list and buy products!
			</span>
			<div className="group cursor-pointer relative my-5 mx-auto justify-center w-fit">
				<div className="flex absolute bottom-5 right-5 bg-blue-500 rounded-full h-8 w-8 align-middle">
					<PlusIcon className="h-5 w-5 text-white my-auto mx-auto stroke-2"/>
				</div>
				<UserCircleIcon className="h-44 w-44 text-white mx-auto" />
			</div>
			<div className="flex flex-col gap-y-4">
				
				<div className="flex flex-col justify-start gap-y-2">
					<label className="font-bold text-white text-xl">Name<span className="text-red-500">*</span></label>
					<input
						className="rounded-lg p-2 text-white text-lg border-2 border-[#40444F] bg-[#222429] placeholder:font-bold placeholder:text-[#454545]"
						placeholder="Enter Name"
						value={name}
						onChange={(e) => {setName(e.target.value)}}
					/>
				</div>
				<div className="flex flex-col justify-start gap-y-2">
					<label className="font-bold text-white text-xl">Bio</label>
					<textarea
						className="rounded-lg p-2 text-white text-lg border-2 border-[#40444F] bg-[#222429] placeholder:font-bold placeholder:text-[#454545]"
						placeholder="Enter Bio"
						value={bio}
						onChange={(e) => {setBio(e.target.value)}}
					/>
				</div>
				<button className="flex flex-row gap-x-2 mt-6 mx-auto text-2xl rounded-full font-bold text-white bg-gradient-to-tr from-[#181424] via-buttontransparent2 to-buttontransparent border-t-[0.5px] border-[#474747] bg-transparent align-middle my-auto px-4 py-2">
					<div className="relative flex flex-shrink-0 h-7 w-7 align-middle my-auto">
						<Image
							src="/orbit.png"
							height={20}
							width={20}
							layout="fill"
							objectFit="contain"
						/>
					</div>
					Sign Up
				</button>
			</div>
		</div>
	)

}


export function SignupModal(props) {
	const [name, setName] = useState();
	const [bio, setBio] = useState();

	return(
		<div className="rounded-xl max-w-lg bg-[#141619] py-10 px-[4rem] mx-auto">
			<h1 className="text-3xl text-white font-bold">Sign Up</h1>
			<span className="text-[#848484]">
			You account is the key to the Orbit market network. Create an account to list and buy products!
			</span>
			<div className="group cursor-pointer relative my-5 mx-auto justify-center w-fit">
				<div className="flex absolute bottom-5 right-5 bg-blue-500 rounded-full h-8 w-8 align-middle">
					<PlusIcon className="h-5 w-5 text-white my-auto mx-auto stroke-2"/>
				</div>
				<UserCircleIcon className="h-32 w-32 text-white mx-auto" />
			</div>
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
				<button className="flex flex-row gap-x-2 mt-6 mx-auto text-lg rounded-full font-bold text-white bg-gradient-to-tr from-[#181424] via-buttontransparent2 to-buttontransparent border-t-[0.5px] border-[#474747] bg-transparent align-middle my-auto px-4 py-2">
					<div className="relative flex flex-shrink-0 h-6 w-6 align-middle my-auto">
						<Image
							src="/orbit.png"
							height={20}
							width={20}
							layout="fill"
							objectFit="contain"
						/>
					</div>
					Sign Up
				</button>
			</div>
		</div>
	)
}

export function EditModal(props) {
	const [userName, setUserName] = useState();
	const [name, setName] = useState();
	const [bio, setBio] = useState();

	return(
		<div className="flex flex-col rounded-xl max-w-lg bg-[#141619] py-10 px-[4rem] mx-auto w-full">
			<h1 className="text-3xl text-white font-bold">Edit Profile</h1>
			<span className="text-[#848484]">
				Update your profile to look just the way you like it!
			</span>
			<div className="group cursor-pointer relative mt-5 mb-2 mx-auto justify-center w-fit">
				<div className="flex flex-shrink-0 relative h-32 w-32 overflow-hidden rounded-full">
					<Image
						src={props?.vendor?.profilepic || "https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50?d=mp&f=y"}
						layout="fill"
						objectFit="contain"
					/>
				</div>
			</div>
			<button className="bg-[#222429] text-white font-semibold text-lg mx-auto px-3 py-1 rounded-full mb-4">Choose Avatar</button>
			<div className="flex flex-col gap-y-3">
				<div className="flex flex-col justify-start gap-y-1">
					<label className="font-bold text-white text-lg">Username<span className="text-red-500">*</span></label>
					<input
						className="rounded-lg p-2 text-white border-2 border-[#40444F] bg-[#222429] placeholder:font-bold placeholder:text-[#454545]"
						placeholder="Enter Username"
						value={userName}
						onChange={(e) => {setUserName(e.target.value)}}
					/>
				</div>
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
				<button className="flex flex-row mt-6 mx-auto text-lg rounded-full font-bold text-white bg-[#1773EB] align-middle my-auto px-6 py-2">
					Update Profile
				</button>
			</div>
		</div>
	)
}