import * as anchor from "@project-serum/anchor";

async function EncryptStrings(dataurls){
    return Promise.all(
        dataurls.map(async (dataurl) => {
            let kp = anchor.web3.Keypair.generate();
            let buff = stou(dataurl);
            let ct = await AesEncrypt(kp.publicKey, buff);
            return [kp, ct]
        })
    )
}

/**
 * 
 * @param {keymap} keys 
 * @param {*} blocks 
 * @returns {Promise<Buffer[]>}
 * keymap is of form {ind: , pubkey: }
 */
async function DecryptStrings(keys, blocks){
    return Promise.all(
        keys.map((key_obj)=>AesDecrypt(key_obj.pubkey, blocks[key_obj.ind]))
    )
}

/**
 * 
 * @param {PublicKey} pubkey
 * @param {Buffer} plaintext
 * @returns {Promise<String>} encrypted buffer
 */
async function AesEncrypt (pubkey, plaintext){
    let iv = crypto.getRandomValues(new Uint8Array(12))

    let aes_key = await crypto.subtle.importKey(
        "raw",
        pubkey.toBuffer(),
        {   //this is the algorithm options
            name: "AES-GCM",
        },
        false,
        ["encrypt", "decrypt"]
    );

    let ciphertext = await crypto.subtle.encrypt(
        { name: 'AES-GCM', iv: iv },
        aes_key,
        plaintext
    );

    return btoa(utos(iv + new Uint8Array(ciphertext)))
}

/**
 * @param {PublicKey} pubkey
 * @param {String} ciphertext_block
 * @returns {Promise<ArrayBuffer>} decrypted plaintext
 */
async function AesDecrypt (pubkey, ciphertext_block){
    let data = stou(atob(ciphertext_block));
    let iv = data.slice(0,12);
    let ciphertext = data.slice(12);

    let aes_key = await crypto.subtle.importKey(
        "raw",
        pubkey.toBuffer(),
        {   //this is the algorithm options
            name: "AES-GCM",
        },
        false,
        ["encrypt", "decrypt"]
    );

    return crypto.subtle.decrypt(
        { name: 'AES-GCM', iv: iv },
        aes_key,
        ciphertext
    );
}

/**
 * Convert an Uint8Array into a string.
 * @param {Uint8Array} uint8array
 * @returns {String}
 */
 function utos(uint8array){
    return new TextDecoder("utf-8").decode(uint8array);
}

/**
 * Convert a string into a Uint8Array.
 * @param {String} myString
 * @returns {Uint8Array}
 */
function stou(myString){
    return new TextEncoder("utf-8").encode(myString);
}

export {
    EncryptStrings,
    DecryptStrings,
    AesEncrypt,
    AesDecrypt,
    utos,
    stou
}