import { useState, useCallback } from "react";
import { FullScreenConvos } from "@includes/components/chat/Convos";
import { FullScreenTexts } from "@includes/components/chat/Texts";
import MediaDisplay from "@includes/components/chat/Media";


export default function FullScreenChat(props) {
	const [textRoom, setTextRoom] = useState({});
	const setTextRoomExt = useCallback((roominfo)=>{
		setTextRoom(roominfo);
	}, [setTextRoom])

	return(
		<div className="relative w-full h-[80vh] mx-auto  mt-5 mb-20 overflow-hidden">
			<div className="bg-[#101010] bg-opacity-50 h-full mx-10 rounded-2xl flex flex-row overflow-hidden">
				<div className="flex basis-[20%] flex-shrink-0 flex-grow-0 overflow-hidden">
					<FullScreenConvos  setTextRoomAndPanel={setTextRoomExt} />
				</div>
				<div className="flex basis-[60%] flex-shrink-0 border-x-[1px] border-[#323232]">
					<FullScreenTexts textRoom={textRoom}/>
				</div>
				<div className="flex basis-[20%] flex-shrink-0">
					<MediaDisplay />
				</div>
			</div>
		</div>
	)
}