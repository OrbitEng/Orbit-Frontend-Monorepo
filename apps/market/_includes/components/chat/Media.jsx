import { PaperClipIcon, PhotoIcon } from '@heroicons/react/24/outline';
import { fill } from 'next-pwa/cache';
import Image from 'next/image';

// Two props
// props.mediaUrls -> [] dataurls/links to all media (videos/images) shared
// props.links -> [] all urls that don't end in file descriptors here
export default function MediaDisplay(props) {
	return(
		<div className="flex flex-col gap-y-8 p-4 w-full">
			<div className="flex flex-col basis-1/2">
				<div className="flex flex-row justify-between">
					<span className="text-2xl text-[#D7D7D7] font-bold">Media</span>
				</div>
				{
					props?.mediaUrls ? 
					<div className="grid lg:grid-cols-2 lg:grid-rows-2">
						{
							// got no idea if these work correctly plz populate :D
							props.mediaUrls.map((mediaUrl) => {
							<div className="relative col-span-1 row-span-1">
								<Image
									src={mediaUrl}
									layout="fill"
									objectFit="cover"
								/>
							</div>
						})}
					</div>
					:
					<div className="flex flex-col m-auto">
						<PhotoIcon className="h-16 w-16 text-[#7D7D7D] mx-auto"/>
						<span className="text-[#7D7D7D] text-center truncate">No media found</span>
					</div>
				}
			</div>
			<div className="flex flex-col basis-1/2">
				<div className="flex flex-row justify-between">
					<span className="text-2xl text-[#D7D7D7] font-bold">Links & Files</span>
				</div>
				{props?.links ? 
					<div className="flex flex-col overflow-y-scroll">
						{props.links.map((link, linkIndex) => {
							<LinkDisplay linkImage={link.linkImage} name={link.linkName} url={link.url} date={link.date} />
						})}
					</div>
					: 
					<div className="flex flex-col m-auto">
						<PaperClipIcon className="h-16 w-16 text-[#7D7D7D] mx-auto mb-1"/>
						<span className="text-[#7D7D7D] text-center truncate">No links or files found</span>
					</div>
				}
			</div>
		</div>
	)
}

function LinkDisplay(props) {
	return(
		<div className="flex flex-row justify-between rounded-lg bg-[#231E2C] bg-opacity-50 w-full my-auto gap-x-4">
			{props?.linkImage ?
				<div className="relative h-7 w-7">
					<Image
						src={props?.linkImage}
						layout="fill"
						objectFit="contain"
					/>
				</div>
				:
				<PaperClipIcon className='h-7 w-7 text-white'/>
			}
			<div className="flex flex-col justify-self-start">
				<span className="text-white text-lg font-bold">{props.name}</span>
				<span className="text-[#4F4F4F] text-sm">{props.url}</span>
			</div>
			<span className="text-[#4F4F4F]">{props.date}</span>
		</div>
	)
}
