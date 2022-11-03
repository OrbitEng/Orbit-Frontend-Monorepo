import { WebBundlr } from "@bundlr-network/client";
import { file_client, enc_common, IDBClient} from "browser-clients";

export default class BundlrClient{
    constructor(provider){
        this.bundlr = new WebBundlr("https://devnet.bundlr.network", "solana", provider, {providerUrl:"https://api.devnet.solana.com"});
    }

    initialize = async()=>{
        this.idb = new IDBClient("bundlr-client");
        await this.idb.LoadTables([{
            table_name:"transactions",
            params: ["keypairs"]
        }],
        2
        );
        await this.bundlr.ready()
    }


    UploadImageFinal = async(image_blob, x_slices, y_slices) =>{
        
        let [width, height, dataurls] = await file_client.ChopImage(image_blob, x_slices, y_slices);
        
        let encrypted = await enc_common.EncryptStrings(dataurls); // returns (pubkey, string)[]

        let kps = encrypted.map(arr => arr[0]);
        let buffs = encrypted.map(arr => arr[1]);

        buffs.unshift(width, height, x_slices, y_slices);
        let tx = await this.UploadBuffer(buffs.join(">UwU<"));

        await this.idb.WriteDatabase("transactions", tx, {"keypairs": kps});
        return [tx, kps]

    }


    UploadAudio = async(image_audio) =>{
        
    }
    UploadVideo = async(image_video) =>{
        
    }

    UploadBuffer = async(buffer_in) => {
        let dataitem = this.bundlr.createTransaction(buffer_in);

        await dataitem.sign();
        
        let price = await this.bundlr.getPrice(dataitem.size);

        await this.bundlr.fund(price);
        
        let txid = dataitem.id;
        await dataitem.upload();
        
        return txid;
    }

    /////////////////////
    /// LOCAL UTILS
    DeleteTransactionKp = async(bundlr_tx) => {
        await this.idb.DelteKeyValue("transactions", bundlr_tx);
    }

    GetTransactionsKp = async(bundlr_tx) => {
        await this.idb.ReadKeyValue("transactions", bundlr_tx);
    }
}