import { useContext, useState } from 'react'
import sdk from 'matrix-js-sdk'
import MatrixClientCtx from "@contexts/MatrixClientCtx"

const ROOM_CRYPTO_CONFIG = { algorithm: 'm.megolm.v1.aes-sha2' };

async function sendMessage(client, msg, roomid) {
	await client.sendEvent(roomid, "m.room.message", {
		"body": msg + "",
		"msgtype": "m.text"
	})
}

// So what we are going to do for login is
// user: wallet pubkey
// pass: the phrase "chatpassword" signed by the wallet
async function login(client, user, pass) {
	await client.login("m.login.password", {
			"user": user + "",
			"password": pass + ""
		}).then((res) => {
			console.log(res);
		})
		await client.initCrypto();
		await client.startClient();

		await client.once('sync', function(state, prevState, res) {
			console.log(state);
		})
}

async function makeEncRoom(client, usersToInvite) {
	const {
	  room_id: roomId,
	} = await client.createRoom({
	  visibility: 'private',
	  invite: usersToInvite,
	});

	// (see https://github.com/matrix-org/matrix-js-sdk/issues/905)
	await client.sendStateEvent(
	  roomId, 'm.room.encryption', ROOM_CRYPTO_CONFIG,
	);
	await client.setRoomEncryption(
	  roomId, ROOM_CRYPTO_CONFIG,
	);

	let room = client.getRoom(roomId);
	let members = (await room.getEncryptionTargetMembers()).map(x => x["userId"])
	let memberkeys = await client.downloadKeys(members);
	for (const userId in memberkeys) {
	  for (const deviceId in memberkeys[userId]) {
		await client.setDeviceVerified(userId, deviceId);
	  }
	}

	return roomId;
}


export default function chat() {
	const matrixClient = useContext(MatrixClientCtx)
	const [ chatText, setChatText ] = useState()
	const [ roomId, setRoomId ] = useState()
	const [ userName, setUserName ] = useState()
	const [ password, setPassword ] = useState()

	return(
		<div className="bg-[#070513] w-full min-h-screen flex flex-col m-auto">
			<div className="m-10 flex flex-col">
				<input type="text" value={userName || ''} onChange={e => {setUserName(e.target.value)}} className="m-10"/>
				<input type="text" value={password || ''} onChange={e => {setPassword(e.target.value)}} className="m-10"/>
				<button className="bg-white m-10" onClick={e => {login(matrixClient, userName, password)}}>LOGIN</button>
			</div>
			<div className="m-10 flex flex-col">
				<input type="text" value={chatText || ''} onChange={(e) => {setChatText(e.target.value)}} className="m-10"/>
				<input type="text" value={roomId || ''} onChange={(e) => {setRoomId(e.target.value)}} className="m-10"/>
				<button className="bg-white m-10" onClick={e => {sendMessage(matrixClient, chatText)}}>Send Message</button>
			</div>
		</div>
	)
}