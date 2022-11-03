import olmWasmPath from '@matrix-org/olm/olm.wasm'
import Olm from '@matrix-org/olm';
import sdk from "matrix-js-sdk";
import {IDBClient, enc_common} from "browser-clients";
const ROOM_CRYPTO_CONFIG = { algorithm: 'm.megolm.v1.aes-sha2' };

export default class ChatClient{
    constructor(auth_keypair){
        if(auth_keypair){
            this.auth_keypair = auth_keypair;
            this.matrix_name = this.UnsanitizeName(this.auth_keypair.publicKey.toString())
        }
        this.logged_in = false;
        
        this.matrixclient = sdk.createClient({
            baseUrl: 'https://projectsegfau.lt',
            deviceId: "orbit_client"
        });
        
        Olm.init({
            locateFile: () => process.env.NEXT_PUBLIC_URL + olmWasmPath.replace("/_next",""),
        });
    }

    initialize = async() =>{
        if(this.auth_keypair.signMessage && !this.password){
            this.password = (await this.auth_keypair.signMessage("chatpassword")).toString("hex").slice(0,64)+"A"
        };
        this.matrixclient.once("sync", (state, prevstate, res)=>{
            if(state == "PREPARED"){
                this.logged_in = true;
                this.last_sync = {};
            }
        })
    }

    Login = async()=>{
        
        let res = await this.matrixclient.login('m.login.password', {user: this.matrix_name, password: this.password, device_id: "orbit_client"});
        

        if(res.errcode){
            throw(res.errcode)
        }

        this.matrixclient = sdk.createClient({
            baseUrl: 'https://projectsegfau.lt',
            userId: res.user_id,
            accessToken: res.access_token,
            sessionStore: window.localStorage,
            cryptoStore:  new sdk.IndexedDBCryptoStore(
                indexedDB, "matrix-js-sdk:crypto",
            ),
            deviceId: "orbit_client"
        });
        
        await this.matrixclient.initCrypto();
        this.matrixclient.on("sync", async (state, prevstate, res)=>{
            if(state == "PREPARED"){
                this.logged_in = true;
                this.last_sync = {};
                await this.matrixclient.uploadKeys();
                this.matrixclient.setGlobalErrorOnUnknownDevices(false);
                // await this.matrixclient.uploadDeviceSigningKeys();
            }
        });
        await this.matrixclient.startClient();
        console.log("done logging in", this.matrixclient)
        
    }

    ////////////////////////////
    /// SYNCING

    Sync = async() =>{
        this.matrixclient.once("sync", (state, prevstate, res)=>{
            this.last_sync = {};
            console.log("synced: ", state)
        })
    }

    RoomInitSync = async(roomid) =>{
        await this.matrixclient.roomInitialSync(roomid);
        await this.GetMessagesForRoom(roomid)
    }

    /////////////////////////
    /// SENDING DATA

    SendMessage = async(roomid, msg)=>{
        await this.matrixclient.sendMessage(roomid,
            {
                "body": msg + "",
                "msgtype": "m.text"
            }
        )
    }

    SendNotice = async(roomid, msg)=>{
        await this.matrixclient.sendMessage(roomid,
            {
                "body": msg + "",
                "msgtype": "m.notice"
            }
        )
    }

    SendImage = async(roomid, image_data) => {
        await this.matrixclient.sendMessage(roomid,
            {
                url:image_data,
                msgtype: "m.image",
                text:""
            }
        )
    }


    ////////////////////////////////////////
    /// BASIC UTILS

    StartConvo = async(inv_user)=>{
        const {
            room_id: roomId,
        } = await this.matrixclient.createRoom({
            visibility: 'private',
            invite: ["@"+this.UnsanitizeName(inv_user)+":projectsegfau.lt"],
            initial_state:[{
                type: "m.room.encryption",
                state_key: "",
                content: ROOM_CRYPTO_CONFIG
            }]
        });

        
        let room = this.matrixclient.getRoom(roomId);
        let members = (await room.getEncryptionTargetMembers()).map(x => x["userId"])
        console.log(members)
        let memberkeys = await this.matrixclient.downloadKeys(members);
        console.log(memberkeys);
        for (const userId in memberkeys) {
            for (const deviceId in memberkeys[userId]) {
                console.log(userId, deviceId);
                await this.matrixclient.claimOneTimeKeys([[userId, deviceId]], "signed_curve25519");
                await this.matrixclient.setDeviceVerified(userId, deviceId, true);
            }
        }

        
        await this.matrixclient.uploadKeys();
        await this.matrixclient.sendSharedHistoryKeys(roomId, members);
        
        return roomId;
    }

    LeaveConvo = async(roomid)=>{
        await this.matrixclient.leaveRoomChain(roomid);
    }

    //////////////////////////////////////////////
    /// ACCOUNT CREATION
    CreateAccountCaptcha = async(token, sessionid)=>{
        return await this.matrixclient.registerRequest(
            {
                username: this.matrix_name,
                password: this.password,
                initial_device_display_name: "orbit_client",
                auth: {
                    type: "m.login.recaptcha",
                    response: token,
                    session: sessionid,
                    device_id: "orbit_client"
                }
            }
        ).catch(res => res)
    }
    CreateAccountFinish = async(sessionid)=>{
        let res = await this.matrixclient.registerRequest(
            {
                username: this.matrix_name,
                password: this.password,
                initial_device_display_name: "orbit_client",
                auth: {
                    type: "m.login.dummy",
                    session: sessionid,
                    device_id: "orbit_client"
                }
            }
        )
        if(res.errcode){
            return res.errcode
        }
    }
    CreateAccountInit = async()=>{
        return await this.matrixclient.registerRequest(
            {
                username: this.matrix_name,
                password: this.password,
                initial_device_display_name: "orbit_client",
                auth: {
                    device_id: "orbit_client"
                }
            }
        ).catch(res => res)
    }
    
    ////////////////////////////////////
    /// INVITATION UTILS

    CheckInvites = async()=>{
        let rooms = this.matrixclient.getRooms().filter(room => room.getMyMembership() === "invite");
        return rooms
    }
    JoinInvite = async(roomid)=>{
        await this.matrixclient.joinRoom(roomid);
        await this.matrixclient.uploadKeys();
        
        let room = this.matrixclient.getRoom(roomid);
        let members = (await room.getEncryptionTargetMembers()).map(x => x["userId"])
        let memberkeys = await this.matrixclient.downloadKeys(members);
        for (const userId in memberkeys) {
            for (const deviceId in memberkeys[userId]) {
                await this.matrixclient.claimOneTimeKeys([[userId, deviceId]], "signed_curve25519");
                await this.matrixclient.setDeviceVerified(userId, deviceId);
            }
        }
        // await this.matrixclient.sendKeyBackup();
    }

    ///////////////////////////////////////////
    /// ROOM INFO FETCHING

    GetJoinedRooms = async() => {
        let jrres = await this.matrixclient.getJoinedRooms();
        return (jrres).joined_rooms;
    }

    GetMessagesForRoom = async(room)=>{
        if(typeof room == "string"){
            room = this.matrixclient.getRoom(room);
        }
        
        await Promise.all(room.timeline.filter(async(e)=>{return await this.matrixclient.decryptEventIfNeeded(e)}))
        return room.timeline.filter(event=>
            (event.clearEvent && event.clearEvent.type == "m.room.message")
        );
    }

    GetNoticesForRoom = async(room) => {
        if(typeof room == "string"){
            room = this.matrixclient.getRoom(room);
        }

        await Promise.all(room.timeline.filter(async(e)=>{return await this.matrixclient.decryptEventIfNeeded(e)}))
        let notices = room.timeline.filter(event=>
            (event.clearEvent && event.clearEvent.type == "m.room.message") && (event.clearEvent && event.clearEvent.content.msgtype == "m.notice")
        );
        return notices;
    }

    GetRoomMembers = async(roomid) => {
        let room = (this.matrixclient.getRoom(roomid));
        if(!room) return [];
        let members = room.getMembers();
        console.log(members)
        let member_ids = [];
        for(let member of members){
            if(member.name == this.matrix_name) continue;
            member_ids.push(member.name)
        };
        return member_ids;
    }

    ///////////////////////
    /// ROOM LAZY LOAD SCROLLBACK

    UpdateRoomOlderMessages = async(room, limit = 0) =>{
        if(typeof room == "string"){
            room = this.matrixclient.getRoom(room);
        }
        await this.matrixclient.scrollback(room);
        await Promise.all(room.timeline.filter(async(e)=>{return await this.matrixclient.decryptEventIfNeeded(e)}))
        let older_messages = room.timeline.slice(limit).filter(event=>
            (event.clearEvent && event.clearEvent.type == "m.room.message")
        );
        return older_messages
    }

    UpdateRoomOlderNotices = async(room, limit = 0) =>{
        if(typeof room == "string"){
            room = this.matrixclient.getRoom(room);
        }
        await this.matrixclient.scrollback(room);
        await Promise.all(room.timeline.filter(async(e)=>{return await this.matrixclient.decryptEventIfNeeded(e)}))
        let older_messages = room.timeline.slice(limit).filter(event=>
            (event.clearEvent && event.clearEvent.type == "m.room.message") && (event.clearEvent && event.clearEvent.content.msgtype == "m.notice")
        );
        return older_messages
    }


    ///////////////////////////////////////////////////////////
    /// UTILS

    SanitizeName = (name_raw) =>{
        return name_raw.replaceAll(/\_([a-z])/g, (whole, letter)=>{ return letter.toUpperCase()}).slice(9).split(":")[0]
    }

    UnsanitizeName = (pk_string) =>{
        return "orbituser"+pk_string.replaceAll(/([A-Z])/g, (whole, letter)=>{
            return "_"+letter.toLowerCase()
        });
    }
}