import {useContext} from "react";
import UserAccountCtx from "@contexts/UserAccountCtx";
import { FullScreenConvos } from "@includes/components/chat/Convos";


export default function FullScreenChat(props) {
	return(
		<div className="relative w-full h-[80vh] mx-auto  mt-5 mb-20 overflow-hidden">
			<div className="bg-[#101010] bg-opacity-50 h-full mx-10 rounded-2xl flex flex-row overflow-hidden">
				<div className="flex basis-[20%] flex-shrink-0 flex-grow-0 overflow-hidden">
					<FullScreenConvos />
				</div>
				<div className="flex basis-[60%] flex-shrink-0 border-x-[1px] border-[#323232]">
				</div>
				<div className="flex basis-[20%] flex-shrink-0">

				</div>
			</div>
		</div>
	)
}