import {parsePriceData} from "@pythnetwork/client";
import { PublicKey } from "@solana/web3.js";

export default class PythClient{
    constructor(connection, cluster){
        this.connection = connection;
        this.cluster = cluster;
        this.addrs = {
            "mainnet":{
                "eur/usd":new PublicKey("CQzPyC5xVhkuBfWFJiPCvPEnBshmRium4xxUxnX1ober"),
                "sol/usd":new PublicKey("H6ARHf6YXhGYeQfUzQNGk6rDNnLBQKrenN712K4AQJEG")
            },
            "devnet":{
                "eur/usd":new PublicKey("E36MyBbavhYKHVLWR79GiReNNnBDiHj6nWA7htbkNZbh"),
                "sol/usd":new PublicKey("J83w4HKfqxwcq3BEMMkPFSppX3gqekLyLJBexebFVkix")
            }
        }
    }

    GetEurUsd = async() => {
        let data_buffer = await this.connection.getAccountInfo(this.addrs[this.cluster]["eur/usd"]);
        let price_data = parsePriceData(data_buffer.data);
        return price_data
    }

    GetSolUsd = async() =>{
        let data_buffer = await this.connection.getAccountInfo(this.addrs[this.cluster]["sol/usd"]);
        let price_data = parsePriceData(data_buffer.data);
        return price_data
    }
}