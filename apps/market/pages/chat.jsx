import { useContext, useState } from 'react'
import MatrixClientCtx from "@contexts/MatrixClientCtx"


export default function chat() {
	const {matrixClient} = useContext(MatrixClientCtx)
	const [ chatText, setChatText ] = useState()
	const [ roomId, setRoomId ] = useState()
	const [ inviteUser, setInviteUser ] = useState()
	const [ userName, setUserName ] = useState()
	const [ password, setPassword ] = useState()

	return(
		<div className="bg-[#070513] w-full min-h-screen flex flex-col m-auto">
			<div className="m-10 flex flex-col">
				<input type="text" placeholder="username" value={userName || ''} onChange={e => {setUserName(e.target.value)}} className="m-2"/>
				<input type="text" placeholder="password" value={password || ''} onChange={e => {setPassword(e.target.value)}} className="m-2"/>
				<button className="bg-white m-2" onClick={e => {login(matrixClient, userName, password)}}>LOGIN</button>
			</div>
			<div className="m-10 flex flex-col">
				<input type="text" value={chatText || ''} placeholder="chat message" onChange={(e) => {setChatText(e.target.value)}} className="m-2"/>
				<input type="text" value={roomId || ''} placeholder="message target roomid" onChange={(e) => {setRoomId(e.target.value)}} className="m-2"/>
				<button className="bg-white m-2" onClick={e => {sendMessage(matrixClient, chatText)}}>Send Message</button>
			</div>
			<div className="m-10 flex flex-col">
				<input type="text" value={inviteUser || ''} placeholder="invite userid" onChange={(e) => {setInviteUser(e.target.value)}} className="m-2"/>
				<button className="bg-white m-2" onClick={e => {makeEncRoom(matrixClient, [inviteUser])}}>Make Room</button>
			</div>
			<div className="m-10 flex flex-col">
				<button className="bg-white m-2" onClick={e => {sendMessage(matrixClient, chatText)}}>idk</button>
				<button className="bg-white m-10" onClick={e => {sendMessage(matrixClient, chatText)}}>idk#2</button>
			</div>
		</div>
	)
}