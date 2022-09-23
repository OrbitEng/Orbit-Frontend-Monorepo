import { useState, useCallback } from "react";
import { HeaderSearchBar } from "@includes/components/SearchBar";
import { HomeHeader } from "@includes/MarketHeader";
import { MainFooter } from "@includes/Footer";
import Head from "next/head";
import Image from "next/image";
import { ArrowRightIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useDropzone } from "react-dropzone";
import { Listbox } from "@headlessui/react";

import {DigitalProductFunctionalities, PhysicalProductFunctionalities} from "@functionalities/Products";

const token_addresses = {
	mainnet: {
		"sol": "11111111111111111111111111111111",
		"usdc": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"
	},
	devnet: {
		"sol": "11111111111111111111111111111111",
		"usdc":"4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU"
	}
}

export function SellLayout(props){
	const [ searchBar, setSearchBar ] = useState(<HeaderSearchBar />);
	const [ selectedCategory, setSelectedCategory ] = useState(null);

    return(
		<div className="w-full min-h-screen bg-transparent">
			<Head>
				<title>Market Home</title>
				<link rel="icon" href="orbit.png" />
			</Head>
			<main className="bg-[url('/oldbgWallpaper.png')] bg-cover min-h-screen">
				<HomeHeader headerMiddle={searchBar}/>
				<div className={(selectedCategory == null ? "-mt-14 sm:-mt-32" : "") + " max-w-7xl align-center mx-auto min-h-view"}>
					{
						(selectedCategory == null || selectedCategory == undefined) ? 
						(
							<CategorySelect cat={{selectedCategory, setSelectedCategory}} />	
						) : (
							<>
							{(selectedCategory == "digital") && <DigitalUpload />}
							{(selectedCategory == "physical") && <PhysicalUpload />}
							{(selectedCategory == "service") && <ServiceUpload />}
							</>
						)
					}
					<MainFooter />
				</div>
			</main>
		</div>
	)
}

function DigitalUpload(props) {
	let uploadedImages = null;
	
	const {ListProductTemplate} = DigitalProductFunctionalities();

	const [prodName, setProdName] = useState();
	const [price, setProdPrice] = useState();
	const [currency, setCurrency] = useState("11111111111111111111111111111111");
	const [description, setDescription] = useState();
	
	const [files, setFiles] = useState();

	console.log(process.env.NEXT_PUBLIC_CLUSTER_NAME)
	const tokenlist = token_addresses[process.env.NEXT_PUBLIC_CLUSTER_NAME];

	const onDrop = useCallback((acceptedFiles) => {
		setFiles(acceptedFiles)
	}, [])
	const {getRootProps, getInputProps, open} = useDropzone({onDrop});

	return(
		<div className="flex flex-col w-full mx-auto my-auto content-center max-w-5xl min-h-screen">
			<h1 className="text-white font-bold text-4xl my-10">Create New Digital Product</h1>
			<div className="flex flex-row justify-between h-[55vh] mb-12">
				<div className="basis-7/12 h-fit mx-8">
					<div className="flex flex-col mb-2 leading-tight">
						<h3 className="font-bold text-white text-xl">Upload Preview</h3>
						<span className="text-[#767676]">Formats: jpg, mp4, png</span>
					</div>
					<div {...getRootProps()} className="flex flex-col border-4 border-dashed border-[#3D3D3D] rounded-2xl w-full content-center align-middle py-12 px-28">
						<input {...getInputProps()}/>
						<div className="relative flex h-52 mx-16">
							<Image
								src="/PhotoIcon.png"
								layout="fill"
								objectFit="contain"
							/>
						</div>
						<div className="flex flex-col">
							<span className="align-middle text-center my-auto mx-auto text-2xl font-bold text-white">Drag & Drop Files</span>	
							<span className="align-middle mx-auto text-[#AD61E8] font-bold">Or import png,svg,mp4,gif</span>
						</div>
					</div>
				</div>
				<div className="basis-5/12 flex-grow-0 h-full mx-8">
					<div className="top-0 bg-transparent backdrop-blur-lg">
						<div className="flex flex-col mb-2 leading-tight">
							<h3 className="font-bold text-white text-xl">Import Content</h3>
							<span className="text-[#767676] mb-2">Formats: jpg, mp4, png</span>
						</div>
						<div className="flex justify-center bg-[#171717] rounded-2xl py-4 mx-auto w-full shadow-lg">
							<button className="bg-[#383838] font-bold text-white rounded-full mx-auto w-1/2 p-2" onClick={open}>
								Choose File
							</button>
						</div>
					</div>
					<div className="flex flex-col w-full h-76 my-4 gap-y-4 overflow-scroll scrollbar scrollbar-thumb-[#5B5B5B] scrollbar-track-[#8E8E8E] scrollbar-thumb-rounded-full scrollbar-track-rounded-full">
						{
							uploadedImages && uploadedImages?.map(() => {
								return(
									<div className="bg-[#171717] rounded-full"></div>
								)
							})
						}
						{
							Array(20).fill(0).map((v) => {
								return (
									<div className="flex flex-row flex-none w-full bg-[#171717] rounded-full py-3 px-4 justify-around">
											<span className="flex flex-none justify-center flex-row gap-x-1 whitespace-nowrap text-white font-semibold basis-3/4 align-middle mx-auto my-auto overflow-ellipsis">
												Uploaded file:{" "}
												<span className="font-semibold flex-none text-[#AD61E8] overflow-ellipsis">fnameashdkjashjdhaoufvaskjasbkdjbs.png</span>
											</span>
											<button className="flex flex-grow-0 p-1 align-middle my-auto mx-auto basis-1/4 justify-center">
												<TrashIcon className="flex text-white h-6 w-6"/>
											</button>
										</div>	
								)
							})
						}
					</div>
				</div>
			</div>
			<form className="flex flex-col gap-y-6 mb-32" onSubmit={()=>{ListProductTemplate()}}>
				<div className="flex flex-col">
					<label for="title" className="text-white font-semibold text-xl">Listing Title</label>
					<input
						className="rounded-lg p-3 text-lg focus:outline-0 bg-[#171717] text-[#4E4E4E]"
						type="text"
						id="title"
						name="title"
					/>
				</div>
				<div className="flex flex-col">
					<label for="price" className="text-white font-semibold text-xl">Price</label>
					<div classname="flex flex-row gap-x-5 bg-[#171717]">
						<input
							className="p-3 text-lg focus:outline-0 bg-[#171717] text-[#4E4E4E] rounded-lg"
							type="text"
							id="price"
							name="price"
							onChange={(e)=>{setProdPrice(e.target.value)}}
						/>
						<Listbox>
							<Listbox.Button>{currency}</Listbox.Button>
							<Listbox.Options>
								{
									Object.entries(tokenlist).map(([k,v], i)=>{
										return (
											<Listbox.Option
												key = {i}
												value = {v}
												onClick = {()=>{setCurrency(v)}}
											>
												{k}
											</Listbox.Option>
										)
									})
								}
							</Listbox.Options>
						</Listbox>
					</div>
				</div>
				
				{/* digital dont get quantity tf */}
				<div className="flex flex-col">
					<label for="stock" className="text-white font-semibold text-xl">Item Quantity</label>
					<input
						className="p-3 text-lg focus:outline-0 bg-[#171717] text-[#4E4E4E] rounded-lg"
						type="number"
						id="stock"
						name="stock"
					>
					</input>
				</div>

				<div className="flex flex-col">
					<label for="description" className="text-white font-semibold text-xl">Description</label>
					<textarea
						className="p-3 h-96 text-lg focus:outline-0 bg-[#171717] text-[#4E4E4E] rounded-lg"
						id="description"
						name="description"
						onChange={(e)=>{setDescription(e.target.value)}}
					/>
				</div>
				<div className="bg-[#171717] px-16 py-3 rounded-full flex justify-center mx-auto">
					<input className="text-transparent py-2 bg-clip-text font-bold bg-gradient-to-tr from-[#8BBAFF] to-[#D55CFF] mx-auto text-3xl rounded-full" type="submit" value="Upload"/>
				</div>
			</form>
		</div>
	)
}

function PhysicalUpload(props) {
	const {ListProduct} = PhysicalProductFunctionalities();
}

function ServiceUpload(props) {
	const {ListProductCommission} = DigitalProductFunctionalities();
}

function CategorySelect(props) {
	const {selectedCategory, setSelectedCategory} = props.cat;
	return(
		<div className="flex flex-row justify-around w-full mx-auto h-[100vh] gap-24 content-center my-auto">
			<div
				className="flex group relative rounded-2xl my-auto h-1/2 w-1/3 hover:scale-[103%] transition duration-700"
				onClick={() => setSelectedCategory("physical")}
			>
				<div className="bg-[#26308F] absolute -inset-0 bg-opacity-70 rounded-lg blur-xl group-hover:bg-opacity-100 transition duration-700" />
				<div className="flex flex-col py-4 px-8 relative bg-gradient-to-tr from-[#2c2c2cc0] to-[#4a4a4ac0] w-full h-full rounded-2xl">
					<div className="relative flex w-1/2 h-1/2 mx-auto">
						<Image
							src="/emojis/globeEmojiImage.png"
							layout="fill"
							objectFit="contain"
							width={50}
						/>
					</div>
					<h1 className="text-3xl font-bold text-white mx-auto text-center">Physical</h1>
					<p className="text-xl text-[#6A6A6A] mx-auto justify-center mt-4 leading-tight text-center">
						Sell shoes, clothes tech, and much more with orbit, it's just a few clicks away!
					</p>
					<div className="rounded-full p-2 my-auto h-14 w-14 bg-gradient-to-tr from-[#0E0C15] to-[#18171D] via-[#161320] mx-auto content-center align-middle">
						<ArrowRightIcon className="h-10 w-10 text-[#3F46FF] m-auto stroke-2" />
					</div>
				</div>
			</div>
			<div
				className="flex group relative rounded-2xl my-auto h-1/2 w-1/3 hover:scale-[103%] transition duration-700"
				onClick={() => setSelectedCategory("service")}
			>
				<div className="bg-[#4E268F] absolute -inset-0 bg-opacity-70 rounded-lg blur-xl group-hover:bg-opacity-100 transition duration-700" />
				<div className="flex flex-col py-4 px-8 relative bg-gradient-to-tr from-[#2c2c2cc0] to-[#4a4a4ac0] w-full h-full rounded-2xl">
					<div className="relative flex w-1/2 h-1/2 mx-auto">
						<Image
							src="/emojis/filesEmojiImage.png"
							layout="fill"
							objectFit="contain"
							width={50}
						/>
					</div>
					<h1 className="text-3xl font-bold text-white mx-auto text-center">Services</h1>
					<p className="text-xl text-[#6A6A6A] mx-auto justify-center mt-4 leading-tight text-center">
						Freelance and take comissions through Orbit, start your custom content adventures!
					</p>
					<div className="rounded-full p-2 my-auto h-14 w-14 bg-gradient-to-tr from-[#0E0C15] to-[#18171D] via-[#161320] mx-auto content-center align-middle">
						<ArrowRightIcon className="h-10 w-10 text-[#4E268F] m-auto stroke-2" />
					</div>
				</div>
			</div>
			<div
				className="flex group relative rounded-2xl my-auto h-1/2 w-1/3 hover:scale-[103%] transition duration-700"
				onClick={() => setSelectedCategory("digital")}
			>
				<div className="bg-[#81268F] absolute -inset-0 bg-opacity-70 rounded-lg blur-xl group-hover:bg-opacity-100 duration-700 transition" />
				<div className="flex flex-col py-4 px-8 relative bg-gradient-to-tr from-[#2c2c2cc0] to-[#4a4a4ac0] w-full h-full rounded-2xl">
					<div className="relative flex w-1/2 h-1/2 mx-auto">
						<Image
							src="/emojis/wrenchEmojiImage.png"
							layout="fill"
							objectFit="contain"
							width={50}
						/>
					</div>
					<h1 className="text-3xl font-bold text-white mx-auto text-center">Digital</h1>
					<p className="text-xl text-[#6A6A6A] mx-auto justify-center mt-4 leading-tight text-center">
						Get paid for your digital art, premade designs, beatpacks, private content and more!
					</p>
					<div className="rounded-full p-2 my-auto h-14 w-14 bg-gradient-to-tr from-[#0E0C15] to-[#18171D] via-[#161320] mx-auto content-center align-middle">
						<ArrowRightIcon className="h-10 w-10 text-[#FB3FFF] m-auto stroke-2" />
					</div>
				</div>
			</div>
		</div>
	)
}