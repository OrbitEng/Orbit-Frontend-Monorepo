import { useContext, useState } from 'react'
import sdk from 'matrix-js-sdk'
import MatrixClientCtx from "@contexts/MatrixClientCtx"

const ROOM_CRYPTO_CONFIG = { algorithm: 'm.megolm.v1.aes-sha2' };

async function sendMessage(client, msg, roomid) {
	await client.sendMessage(roomid,
		{
			"body": msg + "",
			"msgtype": "m.text"
		}
	)
}

// So what we are going to do for login is
// user: wallet pubkey
// pass: the phrase "chatpassword" signed by the wallet
async function login(client, user, pass) {
	await client.login("m.login.password", {
			"user": user + "",
			"password": "Epicstyle03!"
		}).then(async (res) => {
			console.log(res);
			client = await sdk.createClient({
				baseUrl: 'https://matrix.org',
				userId: res.user_id,
				accessToken: res.access_token,
				deviceId: res.device_id,
				sessionStore: window.localStorage,
				cryptoStore: new sdk.MemoryCryptoStore(),
			})
		})/* this gets hung up on some typeError
		.catch(async (e) => {
			console.log(e.name)
			if (e.name == 'RuntimeError') {
				const res = await client.register(
					user,
					pass,
					null,
					{ type: 'm.login.dummy' }
				)

				client = await sdk.register({
					baseUrl: 'https://matrix.org',
					userId: res.user_id,
					accessToken: res.access_token,
					deviceId: res.device_id,
					sessionStore: new sdk.WebStorageSessionStore(window.localStorage),
					cryptoStore: new sdk.MemoryCryptoStore(),
				})
			}
		})*/

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

	return (roomId);
}


export default function chat() {
	const matrixClient = useContext(MatrixClientCtx)
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