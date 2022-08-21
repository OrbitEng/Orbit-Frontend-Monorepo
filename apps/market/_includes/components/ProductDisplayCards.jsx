import Image from "next/image"

const keyStr =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='

const triplet = (e1, e2, e3) =>
  keyStr.charAt(e1 >> 2) +
  keyStr.charAt(((e1 & 3) << 4) | (e2 >> 4)) +
  keyStr.charAt(((e2 & 15) << 2) | (e3 >> 6)) +
  keyStr.charAt(e3 & 63)

const rgbDataURL = (r, g, b) =>
  `data:image/gif;base64,R0lGODlhAQABAPAA${
    triplet(0, r, g) + triplet(b, 255, 255)
  }/yH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==`


export function ProductDisplayCard(props) {
	return(
		<div className="row-span-1 col-span-1">
			<div className="relative group">
				<div className="absolute -inset-0 bg-gradient-to-r from-[#1D23ED] to-[#21CECE] rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-100 animate-tilt"></div>
				<div className="relative px-7 py-4 bg-[#120D20] rounded-lg leading-none flex flex-col items-center divide-x divide-gray-600">
					<div className="flex items-center content-center border-[#4F4F4F] border-2 border-opacity-30 rounded-full shadow bg-gradient-to-r to-[#120D20] from-[#19112E]">
						<div className="flex content-start rounded-full mx-2 py-1 pr-4">
							<Image 
								alt="market profile picture"
								src="/profile.png"
								height={10}
								width={30}
								blurDataURL={rgbDataURL(43, 113, 211)}
								placeholder="blur"
							/>
							<div className="flex flex-col">
								<p className="flex text-gray-100 leading-none text-sm font-bold">MarketplaceSeller</p>
								<p className="flex text-gray-300 text-xs">@MarketplaceSeller</p>
							</div>
						</div>
					</div>
					<div className="flex mx-auto content-center my-2">
						<Image
							alt="product image"
							src="/productimg.png"
							layout="fixed"
							height={200}
							width={200}
						/>
					</div>
				</div>
			</div>
		</div>
	)
}