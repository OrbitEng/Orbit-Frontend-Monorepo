import { GenKwdTreeCacheAddress } from "orbit-clients/clients/SearchProgramClient";

export  async function InitPhysicalTags(tags){
    let bucket_size = tags.length;
    for(let word of tags){
        let address = GenKwdTreeCacheAddress(word, bucket_size, "physical");
    }
}

export async function InitDigitalTags(tags){

}

export async function InitCommissionTags(tags){

}