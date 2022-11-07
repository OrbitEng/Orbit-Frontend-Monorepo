import { enc_common } from "browser-clients";

export default class ArQueryClient{
    /**
     * 
     * @param {string} arweave_url 
     * @returns {Promise<Response>}
     */
    FetchData = async (arweave_url) => {
        return ((await fetch(`https://arweave.net/${arweave_url}`)).text());
    }

    /**
     * lowkey works for videos and shit too
     * @param {*} arweave_url 
     * @returns {Promise<[]DataUrl>}
     */
    GetImageData = async (arweave_url) => {
        let data = await this.FetchData(arweave_url);
        if(!data || (data == '\x00') || (data == "Invalid hash.")){
            return undefined
        }
        let media = data.split(">UwU<");
        return media
    }

    GetPfp = async(ar_addr)=>{
        try{
            let data = (await this.GetImageData(ar_addr))[0];
            return data
        }catch{
            return undefined
        }
    }

    GetMetadata = async(ar_addr)=>{
        try{
            let data = await this.FetchData(ar_addr);
            return JSON.parse(data)
        }catch{
            return undefined
        }
    }
}