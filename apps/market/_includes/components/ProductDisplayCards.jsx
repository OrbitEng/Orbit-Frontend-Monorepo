import Image from "next/image"
import Link from "next/link";

// sellerImg={product.sellerImg} // profile picture
// sellerName={product.sellerName} // seller name/nickname
// sellerAddr={product.sellerAddr} // wallet addr of seller
// name={product.name} // name of product string
// type={product.type} // "physical", "digital", "service", "nft", ...
// price={product.price} // price string (in usd)
// imgUrl={product.imageUrl} // imageUrl (arweave)
// paymentList={product.paymentTypes} // array ["solana", "usdc", ...]
// productId={product.accountId} // the solana account Id of the product account

export function ProductDisplayCardHome(props) {
	const glowColor = "bg-[#4541EE]"
	const borderColor = "border-[#4541EE]"
	const bgColor = "card-service-bg";
	const buttonSet = (
		<div className="flex flex-row gap-x-2 mt-3">
			<button className="font-semibold p-3 text-white bg-gradient-to-t from-[#000] to-[#0F1025] rounded-full drop-shadow text-[.75rem] border-2 border-[#2C2C4A]">🛒 Add to Cart</button>
			<button className="font-semibold p-3 text-white bg-gradient-to-t from-[#000] to-[#0F1025] rounded-full drop-shadow text-[.75rem] border-2 border-[#2C2C4A]">⚡ Quick Buy</button>
		</div>
	) 

	switch (props.type) {
		case "physical":
			glowColor = "bg-[#4541EE]";
			borderColor = "border-[#4541EE]";
			bgColor = "card-digital-bg";
			break;
		case "template":
			glowColor = "bg-[#FF31B9]";
			borderColor = "border-[#FF31B9]";
			bgColor = "card-service-bg";
			break;
		case "commission":
			glowColor = "bg-[#4541EE]";
			borderColor = "border-[#4541EE]";
			bgColor = "card-service-bg";
			buttonSet = (
				<div className="flex flex-row justify-center mt-3">
					<button className="font-semibold p-3 text-white bg-gradient-to-t from-[#000] to-[#0F1025] rounded-full drop-shadow text-[.75rem] border-2 border-[#2C2C4A]">✉️ Request</button>
				</div>
			)
			break;
		case "nft":
			glowColor = "bg-[#4541EE]";
			borderColor = "border-[#4541EE]";
			bgColor = "card-digital-bg";
			break;
	}

	return(
		<div className="row-span-1 col-span-1 my-3 mx-4 hover:scale-[101%] transition duration-700">
			<div className="relative group">
				<div className={glowColor + " absolute -inset-0 rounded-lg blur opacity-60 group-hover:opacity-100 transition duration-700 group-hover:duration-700 animate-tilt"} />
					<Link href={"/product/" + props.type + "/" + props.address}>
						<div className={bgColor + " relative py-4 rounded-lg leading-none flex flex-col items-center overflow-hidden"}>
							<div className="flex items-center content-center border-[#4F4F4F] border-2 border-opacity-30 rounded-full shadow bg-gradient-to-r to-[#120D20] from-[#19112E]">
								<div className="flex content-start rounded-full mx-2 py-1 pr-4 gap-2">
									<Image 
										className="rounded-full flex"
										alt="market profile picture"
										src={props.sellerImg || "https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50?d=mp&f=y"}
										height={10}
										width={30}
									/>
									<div className="flex flex-col w-5/6 mx-auto">
										<span className="flex text-gray-100 leading-none text-sm font-bold">{props.sellerName}</span>
										<span className="flex text-gray-300 text-xs">{props.sellerAddr?.slice(0,10) + "..."}</span>
									</div>
								</div>
							</div>
							<div className="relative mx-auto content-center my-2 overflow-visible">
								<div className={"absolute -bottom-3 -left-3 z-40 p-2  text-white font-bold bg-[#080B1A] bg-opacity-80 rounded-full border-[1px] text-ellipsis " + borderColor}>
									<span className="text-sm">{props.price}</span>
								</div>
								<div className="max overflow-hidden">
									<Image
										alt="product image"
										src={props.imgUrl || "/demologos.png"}
										layout="intrinsic"
										height={200}
										width={200}
									/>
								</div>
							</div>
							<div className="flex flex-col mt-4 justify-start w-4/5">
								<span className="font-bold text-white">{props.name}</span>
								<div className="flex flex-row gap-1 mt-1">
									<div className="bg-[#201B31] align-middle font-semibold rounded-md drop-shadow-md p-1 text-[#8B8B8B] text-[.8rem]">
										{(props.type?.charAt(0)?.toUpperCase() + "" +props.type?.slice(1))}
									</div>
									{
										props?.paymentList?.map((payment, index) => {
											return(
											<div className="flex bg-[#201B31] rounded-md drop-shadow-md p-1 text-[#8B8B8B] text-[.8rem]">
												<Image
													layout="fixed"
													src={"/" + payment + "LogoSmall.png"}
													height={16}
													width={16}
												/>
											</div>
											)
										})
									}
								</div>
							</div>
						{buttonSet}
					</div>
				</Link>
			</div>
		</div>
	)
}