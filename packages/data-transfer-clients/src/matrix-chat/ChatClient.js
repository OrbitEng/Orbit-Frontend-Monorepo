import olmWasmPath from '@matrix-org/olm/olm.wasm'
import Olm from '@matrix-org/olm';
import sdk from "matrix-js-sdk";
import {IDBClient, enc_common} from "browser-clients";
const ROOM_CRYPTO_CONFIG = { algorithm: 'm.megolm.v1.aes-sha2' };

export default class ChatClient{
    constructor(auth_keypair, accounts_client, transactionClient, ar_client, userAccount){
        if(auth_keypair){
            this.auth_keypair = auth_keypair;
            this.matrix_name = this.UnsanitizeName(this.auth_keypair.publicKey.toString())
            this.marketAccountsClient = accounts_client;
            this.transactionClient = transactionClient;
            this.arweaveClient = ar_client;
            this.userAccount = userAccount;
        }
        
        this.matrixclient = sdk.createClient({
            baseUrl: 'https://matrix.foss.wtf',
            deviceId: "orbit_client"
        });
        
        Olm.init({
            locateFile: () => process.env.NEXT_PUBLIC_URL + olmWasmPath.replace("/_next",""),
        });
    }

    initialize = async() =>{
        if(this.auth_keypair.signMessage && !this.password){
            this.password = (await this.auth_keypair.signMessage("chatpassword")).toString("hex").slice(0,64)+"A.";
        };
    }

    Login = async()=>{
        
        let res = await this.matrixclient.login('m.login.password', {user: this.matrix_name, password: this.password, device_id: "orbit_client"});
        

        if(res.errcode){
            console.log(res.errcode)
            return false
        }

        this.matrixclient = sdk.createClient({
            baseUrl: 'https://matrix.foss.wtf',
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
            console.log("client sync: ", state);
            if(state == "PREPARED"){
                await this.matrixclient.uploadKeys();
                this.matrixclient.setGlobalErrorOnUnknownDevices(false);
                

                for (let invitation of (await this.CheckInvites())){
                    try{
                        await this.JoinInvite(invitation.roomId)
                    }catch(e){
                        console.log(e)
                        await this.LeaveConvo(invitation.roomId);
                    }
                }

                let rooms = await this.GetJoinedRooms();
                let rooms_mapped = {};

                for(let i = 0; i < rooms.length; i++){
                    let room = rooms[i];
                    await this.RoomInitSync(room);
                    let members = (await this.GetRoomMembers(room));
                    if(members.length != 1){
                        await this.LeaveConvo(room);
                        continue
                    }

                    let desanitized_acc_address = this.SanitizeName(members[0])
                    let other_party_data;

                    try{
                        other_party_data = await this.marketAccountsClient.GetAccount(
                            this.marketAccountsClient.GenAccountAddress(desanitized_acc_address)
                        );
                    }catch(e){
                        console.log("error", e)
                        await this.LeaveConvo(room);
                        continue;
                    }
                    other_party_data.data.metadata = await this.arweaveClient.GetMetadata(other_party_data.data.metadata);
                    other_party_data.data.profilePic = await this.arweaveClient.GetPfp(other_party_data.data.profilePic);

                    rooms_mapped[desanitized_acc_address] = {
                        other_party: other_party_data,
                        ...this.matrixclient.getRoom(room)
                    }
                }
                
                let buyer_transactions = [];
                let seller_transactions = [];
                
                if(this.userAccount.data.buyerDigitalTransactions.toString() != "11111111111111111111111111111111"){
                    let txs = (await this.transactionClient.GetBuyerOpenTransactions(this.userAccount.data.buyerDigitalTransactions)).data;
                    let indexes = txs.indices[0].toString(2).split("").reverse().join("") + txs.indices[1].toString(2).split("").reverse().join("") + txs.indices[2].toString(2).toString(2).split("").reverse().join("")
                    for(let i = 0; i < indexes.length; i++){
                        if(indexes[i] == "0") continue;
                        buyer_transactions.push(txs.openTransactions[i])
                    }
                }
                if(this.userAccount.data.buyerPhysicalTransactions.toString() != "11111111111111111111111111111111"){
                    let txs = (await this.transactionClient.GetBuyerOpenTransactions(this.userAccount.data.buyerPhysicalTransactions)).data;
                    let indexes = txs.indices[0].toString(2).split("").reverse().join("") + txs.indices[1].toString(2).split("").reverse().join("") + txs.indices[2].toString(2).toString(2).split("").reverse().join("")
                    for(let i = 0; i < indexes.length; i++){
                        if(indexes[i] == "0") continue;
                        buyer_transactions.push(txs.openTransactions[i])
                    }
                }
                if(this.userAccount.data.buyerCommissionTransactions.toString() != "11111111111111111111111111111111"){
                    let txs = (await this.transactionClient.GetBuyerOpenTransactions(this.userAccount.data.buyerCommissionTransactions)).data;
                    let indexes = txs.indices[0].toString(2).split("").reverse().join("") + txs.indices[1].toString(2).split("").reverse().join("") + txs.indices[2].toString(2).toString(2).split("").reverse().join("")
                    for(let i = 0; i < indexes.length; i++){
                        if(indexes[i] == "0") continue;
                        buyer_transactions.push(txs.openTransactions[i])
                    }
                }

                /// other party is the return of this call
                let buyer_convos = await this.transactionClient.GetMultipleTransactionSeller(buyer_transactions);
                let seller_wallets = await this.transactionClient.GetMultipleTxLogOwners(buyer_convos);
                for(let i = 0; i < seller_wallets.length; i++){
                    rooms_mapped[seller_wallets[i].toString()].txid = buyer_transactions[i];
                    rooms_mapped[seller_wallets[i].toString()].side = "buyer";
                }


                if(this.userAccount.data.sellerDigitalTransactions.toString() != "11111111111111111111111111111111"){
                    let txs = (await this.transactionClient.GetSellerOpenTransactions(this.userAccount.data.sellerDigitalTransactions)).data;
                    let indexes = txs.openTransactions[0].toString(2).split("").reverse().join("") + txs.openTransactions[1].toString(2).split("").reverse().join("") + txs.openTransactions[2].toString(2).split("").reverse().join("") + txs.openTransactions[3].toString(2).toString(2).split("").reverse().join("")
                    for(let i = 0; i < indexes.length; i++){
                        if(indexes[i] == "0") continue;
                        seller_transactions.push(txs.openTransactions[i])
                    }
                }
                if(this.userAccount.data.sellerPhysicalTransactions.toString() != "11111111111111111111111111111111"){
                    let txs = (await this.transactionClient.GetSellerOpenTransactions(this.userAccount.data.sellerPhysicalTransactions)).data;
                    let indexes = txs.openTransactions[0].toString(2).split("").reverse().join("") + txs.openTransactions[1].toString(2).split("").reverse().join("") + txs.openTransactions[2].toString(2).split("").reverse().join("") + txs.openTransactions[3].toString(2).toString(2).split("").reverse().join("")
                    for(let i = 0; i < indexes.length; i++){
                        if(indexes[i] == "0") continue;
                        seller_transactions.push(txs.openTransactions[i])
                    }
                }
                if(this.userAccount.data.sellerCommissionTransactions.toString() != "11111111111111111111111111111111"){
                    let txs = (await this.transactionClient.GetSellerOpenTransactions(this.userAccount.data.sellerCommissionTransactions)).data;
                    let indexes = txs.openTransactions[0].toString(2).split("").reverse().join("") + txs.openTransactions[1].toString(2).split("").reverse().join("") + txs.openTransactions[2].toString(2).split("").reverse().join("") + txs.openTransactions[3].toString(2).toString(2).split("").reverse().join("")
                    for(let i = 0; i < indexes.length; i++){
                        if(indexes[i] == "0") continue;
                        seller_transactions.push(txs.openTransactions[i])
                    }
                }

                let seller_convos = await this.transactionClient.GetMultipleTransactionBuyer(seller_transactions);
                let buyer_wallets = await this.transactionClient.GetMultipleTxLogOwners(seller_convos);
                for(let i = 0; i < buyer_wallets.length; i++){
                    rooms_mapped[buyer_wallets[i].toString()].txid = seller_transactions[i];
                    rooms_mapped[buyer_wallets[i].toString()].side = "seller";
                }
                
                this.chatrooms = rooms_mapped
                this.chatroommount ? this.chatroommount(rooms_mapped) : {};
            }

        });

        this.matrixclient.on("event", async (event)=>{
            switch(event.type){
                case "m.room.member":
                    if((event.content.membership == "invite") && (event.content.displayname == this.matrix_name)){
                        this.chatroommount ? this.chatroommount(rooms_mapped) : {};
                    };
                    break;
                case "m.room.encrypted":
                    break;
            }
        });
        await this.matrixclient.startClient();
        return true;
        
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
        let mxurl = await this.UploadImage(image_data);
        console.log(mxurl)
        if((typeof mxurl != "string") && (mxurl.slice(0,3) != "mxurl")) return;
        await this.matrixclient.sendMessage(
            roomid,
            {
                url: mxurl,
                msgtype: "m.image",
                body: image_data.name + image_data.type
            }
        )
    }

    UploadImage = async(image_data) => {
        return this.matrixclient.uploadContent(
            image_data
        )
    }


    ////////////////////////////////////////
    /// BASIC UTILS

    StartConvo = async(userprofile, txid = undefined)=>{
        const {
            room_id: roomId,
        } = await this.matrixclient.createRoom({
            visibility: 'private',
            invite: ["@"+this.UnsanitizeName(userprofile.data.wallet.toString())+":foss.wtf"],
            initial_state:[{
                type: "m.room.encryption",
                state_key: "",
                content: ROOM_CRYPTO_CONFIG
            }]
        });

        
        let room = this.matrixclient.getRoom(roomId);
        let members = (await room.getEncryptionTargetMembers()).map(x => x["userId"])
        let memberkeys = await this.matrixclient.downloadKeys(members);
        for (const userId in memberkeys) {
            for (const deviceId in memberkeys[userId]) {
                await this.matrixclient.claimOneTimeKeys([[userId, deviceId]], "signed_curve25519");
                await this.matrixclient.setDeviceVerified(userId, deviceId, true);
            }
        }

        
        await this.matrixclient.uploadKeys();
        await this.matrixclient.sendSharedHistoryKeys(roomId, members);
        this.chatrooms[userprofile.data.wallet.toString()] = {
            ...room,
            other_party: userprofile
        };
        if(txid){
            this.chatrooms[inv_user][txid] = txid;
        }
        this.chatroommount(this.chatrooms);
        return roomId;
    }

    LeaveConvo = async(chatroom_name, roomid)=>{
        await this.matrixclient.leaveRoomChain(roomid);
        await this.matrixclient.forget(roomid, true);
        delete this.chatrooms[chatroom_name];
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
        
        await Promise.all(room.timeline.map(e => this.matrixclient.decryptEventIfNeeded(e)))
        return room.timeline.filter(event=>
            (event.clearEvent && event.clearEvent.type == "m.room.message")
        );
    }

    GetNoticesForRoom = async(room) => {
        if(typeof room == "string"){
            room = this.matrixclient.getRoom(room);
        }

        await Promise.all(room.timeline.map(e => this.matrixclient.decryptEventIfNeeded(e)))
        let notices = room.timeline.filter(event=>
            (event.clearEvent && event.clearEvent.type == "m.room.message") && (event.clearEvent && event.clearEvent.content.msgtype == "m.notice")
        );
        return notices;
    }

    GetRoomMembers = async(roomid) => {
        let room = (this.matrixclient.getRoom(roomid));
        if(!room) return [];
        let members = room.getMembers();
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
        await Promise.all(room.timeline.map(e => this.matrixclient.decryptEventIfNeeded(e)))
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
        await Promise.all(room.timeline.map(e => this.matrixclient.decryptEventIfNeeded(e)))
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