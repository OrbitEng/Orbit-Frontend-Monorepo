const keystore = require("keystore");
var matrixSdk = require("matrix-js-sdk");

export default class ChatClient{
    constructor(){
        this.roomsLastSync = {};
        this.roomsChatHistoryMessages = {};

        this.MatrixClient = matrixSdk.createClient("https://matrix.org");
        this.MatrixClient.on("Room.timeline", function(event, room) {
            if (event.getType() !== "m.room.message") {
                return; // only use messages
            }
            
            this.roomsChatHistoryMessages[room.roomId] = [this.HandleMessageEvent(event), ...this.roomsChatHistoryMessages[room.roomId]];
        });

        this.MatrixClient.initCrypto();
        this.MatrixClient.startClient();

        this.MatrixClient.getRooms().map(room => this.SyncRoom(room.roomId));
        
        ////////////////////////////
        
        this.keystore = new keystore();
        
        let matrixAccesstoken = this.keystore.getKeyVal("matrixAccessToken");
        if(matrixAccesstoken){
            this.matrixAccessToken = matrixAccesstoken;
        };

    }

    Register(username, password){
        this.MatrixClient.register(username, password).then((res)=>{
            console.log(res);
            this.keystore.setKeyVal("matrixAccessToken", res.access_token);
            this.keystore.setKeyVal("matrixDeviceId", res.device_id);
            this.keystore.setKeyVal("matrixUserId", res.user_id);
            return res.user_id;
        }).catch((e)=>{
            console.log(e);
            return undefined;
        });
    }

    Login(username, password){
        this.MatrixClient.loginWithPassword(username, password).then((res)=>{
            console.log(res);
            let access_token = res.access_token;
            keystore.setKeyVal("matrixAccessToken", access_token);
            this.matrixAccessToken = matrixAccesstoken;
            return access_token;
        }).catch((e)=>{
            console.log(e);
            return undefined;
        });
        
    }

    // todo userid's to invite
    CreatePrivateRoom(invUsers){
        this.MatrixClient.createRoom({
            invite: invUsers,
            // i think this defaults to private but we should check
            visibility: 1,
        }).then((res)=>{
            return res.room_id;
        }).catch((e)=>{
            console.log(e);
            return undefined;
        })
    }


    // join all invited chats
    JoinInvites(){
        this.MatrixClient.getRooms().map((room) => {
            if(room.getMyMembership() === "invite"){
                this.JoinRoom(room.roomId);
            }
        });
    }

    JoinRoom(roomId){
        this.MatrixClient.joinRoom(roomId);
    }

    LeaveRoom(roomId){
        this.MatrixClient.leave(roomId);
    };

    async SyncRoom(roomId){
        let syncState = await this.MatrixClient.roomInitialSync(roomId);
        if(this.roomsLastSync[roomId] && syncState.messages.start == this.roomsLastSync[roomId].start){
            return;
        }
        if(syncState.messages){
            this.roomsChatHistoryMessages[roomId] = syncState.messages.chunk.map(e=>this.HandleMessageEvent(e));
            this.roomsLastSync[roomId] = {start: syncState.messages.start, end: syncState.messages.end};
        }
    }

    // everytime this is called, it increments internal counter. thus, it auto keeps pagination
    FetchMessages(roomId){
        let messages = await this.MatrixClient.createMessagesRequest(roomId, this.roomsLastSync[roomId].end, 30, "f");
        if(messages.chunk?.length <= 0){
            return;
        }

        this.roomsChatHistoryMessages[roomId] = [...this.roomsChatHistoryMessages[roomId], ...messages.chunk.map(e=>this.HandleMessageEvent(e))];
    };

    SendMessage(roomId, message){
        this.MatrixClient.sendMessage(roomId, {body: message, msgtype: 'm.text'});
    }

    // all files are files. receiver will decode properly
    // ArrBuf can be from event.target.result when FileReader.readAsArrayBuffer
    async SendFile(roomId, arrayBuffer, msgType, desc){
        let mxcUri = await this.MatrixClient.uploadContent(arrayBuffer);

        // message type enum

        let mte;
        switch(msgType){
            case "audio":
                mte = matrixSdk.MsgType.Audio
                break;
            case "file":
                mte = matrixSdk.MsgType.File
                break;
            case "image":
                mte = matrixSdk.MsgType.Image
                break;
            case "video":
                mte = matrixSdk.MsgType.Video
                break;
        }
        

        const content = {
            msgtype: mte,
            url: mxcUri,
            info: desc || "",
            body: desc || "",
        };

        await this.MatrixClient.sendMessage(roomId, null, content);
    }

    //////////////////////////
    // HELPERS
    HandleMessageEvent = (event)=>{
        if(event.type != "m.room.message"){
            return undefined;
        }
        let ret = {
            sender:event.sender,
            type: event.content.msgtype.slice(2)
        };

        // todo: take care of common mimetypes
        // type : content.info.mimetype
        switch(event.content.msgtype){
            case "m.text":
                ret.body =  event.content.body;
                break;
            case "m.image":
            case "m.file":
            case "m.audio":
            case "m.video":
                // + event.content.body
                ret.body =  this.MatrixClient.mxcUrlToHttp(event.content.url);
                break;
        };

        return ret;
    };
}