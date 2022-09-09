export default function NewsCard(props) {
	return(
		<div
			className="group flex rounded-xl h-56 bg-cover p-10"
			style={{backgroundImage: `url('/NewsCardImages/${props.imgSrc}')`}}
		>
			<div className="bottom-5 absolute">
				<div className="flex flex-col">
					<span className="text-sm text-[#8A8A8A] -mb-2">{props.detail}</span>
					<span className="text-xl font-bold text-white">{props.title}</span>
				</div>
			</div>
		</div>
	)
} 