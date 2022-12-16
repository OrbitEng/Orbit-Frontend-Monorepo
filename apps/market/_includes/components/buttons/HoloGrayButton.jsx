export default function HoloGrayButton(props) {
	return(
		<button
			className="inline-flex relative rounded-lg bg-gradient-to-tr from-[#181424] via-buttontransparent2 to-buttontransparent border-t-[0.5px] border-[#474747] bg-transparent text-white align-middle my-auto p-2 transition hover:scale-[105%]"
			onClick={props.onClick}
		>
			{props.children}
		</button>
	)
}