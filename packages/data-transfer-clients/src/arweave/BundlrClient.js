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


    UploadFinalBufferInstruction = async(image_blob, x_slices, y_slices) =>{
        
        let [width, height, dataurls] = await file_client.ChopImage(image_blob, x_slices, y_slices);
        
        let encrypted = await enc_common.EncryptStrings(dataurls); // returns (pubkey, string)[]

        let kps = encrypted.map(arr => arr[0]);
        let buffs = encrypted.map(arr => arr[1]);

        buffs.unshift(width, height, x_slices, y_slices);
        let [funding_tx, data_item] = await this.UploadBufferInstruction(buffs.join(">UwU<"));

        await this.idb.WriteDatabase("transactions", data_item.id, {"keypairs": kps});
        return [funding_tx, data_item, kps]

    }

    /**
     *  tx_id = DataItem.id
     *  ret[0].sendTx(), DataItem.upload()
     * @param {Buffer | TypedArray} buffer_in 
     * @returns {Promise<[]FundingInstruction, DataItem>}
     */
    UploadBufferInstruction = async(buffer_in) => {
        let dataitem = this.bundlr.createTransaction(buffer_in);

        await dataitem.sign();
        
        // let txid = dataitem.id;
        // await dataitem.upload();
        
        return dataitem;
    }

    SendTxItems = async(sig, txitems) => {
        let res = await this.bundlr.utils.api.post(`/account/balance/${this.bundlr.utils.currency}`, { tx_id: sig});
		if(res.status == 400){
			throw(res.data)
		}
        await Promise.all(txitems.map(txitem => txitem.upload()));
    }

    /////////////////////
    /// LOCAL UTILS
    DeleteTransactionKp = async(bundlr_tx) => {
        await this.idb.DelteKeyValue("transactions", bundlr_tx);
    }

    GetTransactionsKp = async(bundlr_tx) => {
        await this.idb.ReadKeyValue("transactions", bundlr_tx);
    }

    /////////////////////////
    /// SOL UTILS: custom funding func for async instruction creation and sending

    FundInstruction = async(data_items) =>{
        let price = 0;
        for(let item of data_items){
            price += await this.bundlr.getPrice(item.size);
        }
        
        const c = this.bundlr.utils.currencyConfig;
        const to = await this.bundlr.utils.getBundlerAddress(this.bundlr.utils.currency);
        let fee = "0";
        if (c.needsFee) {
            // winston's fee is actually for amount of data, not funds, so we have to 0 this.
            const baseFee = await c.getFee(c.base[0] === "winston" ? 0 : price, to);
            fee = (baseFee.multipliedBy(1)).toFixed(0).toString();
        }
        const tx = await c.createTx(price, to, fee);
        // c.sendTx
        return tx
    }
}