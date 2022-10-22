import { useState, useContext, useEffect } from "react";
import Carousel from "react-multi-carousel"
import { ChevronUpIcon } from "@heroicons/react/24/outline";
import Image from 'next/image'
import { EditPhysicalProductModal } from "@includes/components/modals/EditListingsModal";
import { CartFunctionalities } from '@functionalities/Cart';
import UserAccountCtx from "@contexts/UserAccountCtx";
import 'react-multi-carousel/lib/styles.css';
import PosModal from "@includes/components/modals/PosModal";

const responsive = {
	superLargeDesktop: {
		breakpoint: { max: 4000, min: 3000 },
		items: 1,
		slidesToSlide: 1
	},
	desktop: {
	  breakpoint: { max: 3000, min: 1024 },
	  items: 1,
	  slidesToSlide: 1
	},
	tablet: {
	  breakpoint: { max: 1024, min: 464 },
	  items: 1,
	  slidesToSlide: 1
	},
	mobile: {
	  breakpoint: { max: 464, min: 0 },
	  items: 1,
	  slidesToSlide: 1
	}
};

export function PhysicalProductLayout(props) {
	const [ descriptionOpen, setDescriptionOpen ] = useState(false);
	const [ openPos, setOpenPos ] = useState(false);
	const [ itemAsCart, setItemAsCart] = useState()
	const {userAccount} = useContext(UserAccountCtx);
	const {AddItem} = CartFunctionalities();

	const [isOwner, setIsOwner] = useState(false);

	useEffect(()=>{
		if(!(props.prodInfo.data && props.prodInfo.data.metadata.seller && props.prodInfo.data.metadata.seller.data.wallet && userAccount)){
			return;
		}

		setItemAsCart({items:[props.prodInfo], total:props.prodInfo.data.metadata.price});

		if(userAccount.data.wallet.toString() == props.prodInfo.data.metadata.seller.data.wallet.toString()){
			setIsOwner(true)
		}else{
			setIsOwner(false)
		}

	}, [userAccount, props.prodInfo])

	return(
		<div className="flex flex-row w-[90%] mx-auto mt-6 mb-20 h-[80vh] gap-8">
			<div className="bg-white flex rounded-3xl bg-opacity-5 h-full w-1/2 p-10">
			<Carousel 
					className="w-full h-full"
					responsive={responsive} 
					arrows={true}
					swipeable={true}
					draggable={true}
					showDots={true}
					infinite={false}
					autoPlay={false}
					keyBoardControl={true}
					transitionDuration={500}
					removeArrowOnDeviceType={["tablet", "mobile"]}
					deviceType={"desktop"}
					dotListClass="custom-dot-list-style"
					itemClass="carousel-item-padding-40px"
				>
					{
						(props.prodInfo?.data?.metadata && props.prodInfo?.data?.metadata?.media) ? props.prodInfo?.data?.metadata?.media?.map((url, index) => {
								if(url.indexOf("data:image") == 0){
									return <div className="relative mx-auto w-[400px] h-[400px] sl:w-[450px] sl:h-[450px] justify-center" key={index}>
												<Image 
													src={url}
													layout="fill"
													objectFit="cover"
												/>
											</div>
								}else
								if(url.indexOf("data:audio") == 0){

								}else
								if(url.indexOf("data:text") == 0){
									
								}else
								if(url.indexOf("data:video") == 0){
									return 	<video
													autoplay
													width='500'
													height='500'
													key={index}
												>
													<source src="/blue.mp4" />
												</video>
								}
						}) : <div className="flex mx-auto justify-center">
								<Image 
									src={"/demologos.png"}
									layout="fixed"
									width={400}
									height={400}
								/>
							</div>
					}
				</Carousel>
			</div>
			<div className={"bg-white rounded-3xl bg-opacity-5 h-full w-1/2 p-10 flex flex-col gap-y-5 text-ellipsis " + (descriptionOpen ? " overflow-y-auto" : " overflow-hidden")}>
				<div className="flex w-56 items-center content-center rounded-full shadow-lg bg-gradient-to-r from-[#222222] to-selleridproductpagetrans">
					<div className="flex content-start rounded-full mx-2 py-1 pr-4 gap-2">
						<Image 
							className="rounded-full"
							alt="market profile picture"
							layout="fixed"
							src={props.prodInfo?.data?.metadata?.seller?.data?.profilePic || "https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50?d=mp&f=y"}
							height={48}
							width={64}
						/>
						<div className="flex flex-col w-5/6 mx-auto align-middle my-auto">
							<span className="flex text-gray-100 leading-none font-bold">{props.prodInfo?.data?.metadata?.seller?.data?.metadata?.name || "Jackimus"}</span>
							<span className="flex text-gray-300 text-sm">{(props.prodInfo?.data?.metadata?.seller?.address?.toString().slice(0,10) + "...") || "DMgY6wi2FV..."}</span>
						</div>
					</div>
				</div>
				<div className="flex flex-col mt-10 gap-y-2" >
					<div className="flex flex-row w-full h-full content-center mb-10">
						<h1 className="font-bold text-4xl text-white ml-3">{(props.prodInfo?.data?.metadata?.info?.name && (props.prodInfo.data.metadata.info.name.charAt(0).toUpperCase() + props.prodInfo.data.metadata.info.name.slice(1))) || "NULL PRODUCT" }</h1>
					</div>
					<div className="flex flex-row gap-3">
						<div className="rounded-full font-bold bg-[#261832] text-[#72478C] px-2 py-2 text-sm">
							{"Availability: " + (props.prodInfo?.data?.quantity?.toString() || "∞") }
						</div>
						<div className="rounded-full font-bold bg-[#311132] text-[#7D348F] px-2 py-2 text-sm">
							Physical Product
						</div>
					</div>
					<div className="font-semibold align-top ml-3">
						<span className="text-white text-lg align-top mr-2">Price:{' '}</span>
						<span className="text-[#5a5a5a] text-3xl align-top">
							{
								(props.prodInfo?.data?.metadata?.price?.toString() || "Custom")
							}
						</span>
					</div>
				</div>
				<div className="flex flex-col bg-[#484848] bg-opacity-10 rounded-3xl p-10 w-full bottom-0 overflow-hidden">
					<button
						className="text-xl text-white font-bold flex flex-row border-b-[1px] border-[#636363] w-full"
						onClick={() => {setDescriptionOpen(!descriptionOpen)}}
					>
						Description
						{
							(props.prodInfo?.data?.metadata?.info?.description.length > 218) && 
							<ChevronUpIcon className={"h-4 w-4 my-auto ml-auto justify-self-end stroke-[2px] transition translate" + (descriptionOpen ? " rotate-180" : " rotate-0") } />
						}
					</button>
					<p className="text-[#838383] whitespace-pre-line transition w-full">
						{
							// this is super scuffed
							descriptionOpen ? props.prodInfo?.data?.metadata?.info?.description : props.prodInfo?.data?.metadata?.info?.description?.slice(0,218) + (props.prodInfo?.data?.metadata?.info?.description.length > 218 ? "..." : "")
						}
					</p>
				</div>
				<div className="flex flex-row w-full justify-center mt-6">
					{
						// FIXME(millionz): eventually more types will come along and break this
						!isOwner ? (
							<div className="flex flex-row justify-center">
								<EditPhysicalProductModal selectedProduct={props.prodInfo}/>
							</div> 
						) : (
							<div className="flex flex-row gap-x-4">
								<button className="font-semibold p-3 text-white bg-gradient-to-t from-[#000] to-[#0F1025] rounded-full drop-shadow text-lg border-2 border-[#2C2C4A]"
								onClick={()=>{AddItem(props.prodInfo)}}>🛒 Add to Cart</button>
								<button className="font-semibold p-3 text-white bg-gradient-to-t from-[#000] to-[#0F1025] rounded-full drop-shadow text-lg border-2 border-[#2C2C4A]" onClick={()=>{setOpenPos(true)}}>⚡ Quick Buy</button>
							</div>
						) 
					}
				</div>
				{itemAsCart && <PosModal openPos={openPos} setOpenPos={setOpenPos} cart={itemAsCart} setCart={setItemAsCart} />}
			</div>
		</div>
	)
}