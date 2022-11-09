import { PaperClipIcon, PhotoIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';

// Two props
// props.mediaUrls -> [] dataurls/links to all media (videos/images) shared
// props.links -> [] all urls that don't end in file descriptors here
export default function MediaDisplay(props) {
	return(
		<div className="flex flex-col gap-y-4 p-4 w-full">
			<div className="flex flex-col basis-1/2">
				<div className="flex flex-row justify-between">
					<span className="text-2xl text-[#D7D7D7] font-bold">Media</span>
				</div>
				{
					props?.mediaUrls ? 
					<div className="grid lg:grid-cols-2 lg:grid-rows-2">
						
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
					<div className="grid lg:grid-cols-2 lg:grid-rows-2">
						
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
