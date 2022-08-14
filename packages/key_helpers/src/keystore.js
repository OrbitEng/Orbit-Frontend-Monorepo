export default class KeyStore{
    constructor(){
    }

    // i think this also returns a promise. should be awaited
    // then keys can be used
    loadRsaKeys(){
      this.accessDB(function (store) {

        var getData = store.get("rsa");
        getData.onsuccess = function(event) {
          var keys = event.target.result.keys;
          this.rsaPubkey = keys.pub;
          this.rsaPrivkey = keys.priv;
          console.log("decrypted data", data);
        };

        getData.onerror = function (event){
          console.log("your keys have not been made yet :(");
          console.log("generating...");
          this.genChatKp();
        };

      })
    }

    accessDB(fn_) {
      // Open (or create) the database
      var open = indexedDB.open("keyDB");
    
      // Create the schema
      open.onupgradeneeded = function(event) {
          var db = event.target.result;
          db.createObjectStore("keyStore", {keyPath: "name"});
      };
    
    
      open.onsuccess = function(event) {
          // Start a new rsa
          var db = event.target.result;
          var tx = db.transaction("keyStore", "readwrite");
          var store = tx.objectStore("keyStore");
    
          fn_(store)
    
          // Close the db when the rsa is done
          tx.oncomplete = function() {
              db.close();
          };
      }
    }

    async rsaEnc(rsapk, text){
      return window.crypto.subtle.encrypt(
        {
          name: "RSA-OAEP"
        },
        rsapk,
        text
      );
    }

    async rsaDec(ct, sk){
      return window.crypto.subtle.encrypt(
        {
          name: "RSA-OAEP"
        },
        sk ? sk : this.rsaPrivkey,
        ct
      );
    }

    async encData(data, rsaPk) {
      const enckey = await window.crypto.subtle.generateKey(
        {
          name: "AES-GCM",
          length: 256
        },
        true,
        ["encrypt", "decrypt"]
      );

      const exKey = window.crypto.subtle.exportKey("raw", enckey);
      const strExKey = exKey.map(b => String.fromCharCode(b)).join('');

      const iv = crypto.getRandomValues(new Uint8Array(12));
      const ivStr = iv.map(b => String.fromCharCode(b)).join('');
  
      const alg = { name: 'AES-GCM', iv: iv };
  
      const ctBuffer = await crypto.subtle.encrypt(alg, enckey, data);
  
      const ctArray = Array.from(new Uint8Array(ctBuffer));
      const ctStr = ctArray.map(byte => String.fromCharCode(byte)).join('')
  
      return await this.rsaEnc(rsaPk, strExKey)+":"+await this.rsaEnc(rsaPk, ivStr)+":"+ctStr;                                                          // iv+ciphertext base64-encoded
    }

    async decData(message, pk) {
      try {
        const firstcolon = message.indexOf(":");
        const secondcolon = message.slice(firstcolon+1).indexOf(":")
        let rk = message.slice(0,firstcolon);
        let riv = message.slice(firstcolon+1, firstcolon+secondcolon+1);
        let rmessage = message.slice(firstcolon+secondcolon+1);

        const keyBytes = new Uint8Array(
          [...await this.rsaDec(rk, pk)].map((char) => char.charCodeAt(0))
        );

        const ivBytes = new Uint8Array(
          [...await this.rsaDec(riv, pk)].map((char) => char.charCodeAt(0))
        );
    
        const messageBytes = new Uint8Array(
          [...rmessage].map((char) => char.charCodeAt(0))
        );
        
        const decryptedData = await window.crypto.subtle.decrypt(
          {
            name: "AES-GCM",
            iv: ivBytes,
          },
          keyBytes,
          messageBytes
        );
    
        return decryptedData;
      } catch (e) {
        return `error decrypting message: ${e}`;
      }
    };

    async exportRsaPubKey(key){
      const exported = await window.crypto.subtle.exportKey(
        "pkcs8",
        key
      );
      const exportedAsString = ab2str(exported);
      const exportedAsBase64 = window.btoa(exportedAsString);
      return `-----BEGIN PUBLIC KEY-----\n${exportedAsBase64}\n-----END PUBLIC KEY-----`;
    }

    importRsaPubKey(pem) {
      // fetch the part of the PEM string between header and footer
      const pemHeader = "-----BEGIN PUBLIC KEY-----";
      const pemFooter = "-----END PUBLIC KEY-----";
      const pemContents = pem.substring(pemHeader.length, pem.length - pemFooter.length);
      // base64 decode the string to get the binary data
      const binaryDerString = window.atob(pemContents);
      // convert from a binary string to an ArrayBuffer
      const binaryDer = str2ab(binaryDerString);
  
      return window.crypto.subtle.importKey(
        "pkcs8",
        binaryDer,
        {
          name: "RSA-OAEP",
          hash: "SHA-256"
        },
        true,
        ["encrypt"]
      );
    }

    async exportRsaPrivKey(key) {
      const exported = await window.crypto.subtle.exportKey(
        "pkcs8",
        key
      );
      const exportedAsString = ab2str(exported);
      const exportedAsBase64 = window.btoa(exportedAsString);
      return `-----BEGIN PRIVATE KEY-----\n${exportedAsBase64}\n-----END PRIVATE KEY-----`;
    }

    importRsaPrivKey(pem) {
      // fetch the part of the PEM string between header and footer
      const pemHeader = "-----BEGIN PRIVATE KEY-----";
      const pemFooter = "-----END PRIVATE KEY-----";
      const pemContents = pem.substring(pemHeader.length, pem.length - pemFooter.length);
      // base64 decode the string to get the binary data
      const binaryDerString = window.atob(pemContents);
      // convert from a binary string to an ArrayBuffer
      const binaryDer = str2ab(binaryDerString);
    
      return window.crypto.subtle.importKey(
        "pkcs8",
        binaryDer,
        {
          name: "RSA-OAEP",
          hash: "SHA-256",
        },
        true,
        ["decrypt"]
      );
    }

    ab2str(buf) {
      return String.fromCharCode.apply(null, new Uint8Array(buf));
    }

    async genRsaKp(){
      let kp = await window.crypto.subtle.generateKey(
        {
          name: "RSA-OAEP",
          // should be 4096 but i kinda wanna try something
          modulusLength: 2048,
          publicExponent: new Uint8Array([1, 0, 1]),
          hash: "SHA-256"
        },
        true,
        ["encrypt", "decrypt"]
      );

      return [kp.publicKey, kp.privateKey]
    }

    async genChatKp(){
      let [rsapk, rsask] = await this.genRsaKp();

      this.accessDB(function (store) {
        store.put({name: "rsa", keys: {pub: rsapk, priv :rsask}});
      });

      this.rsaPubkey = rsapk;
      this.rsaPrivkey = rsask;
      
      console.log("generated and set rsa keypair");
    }

    setKeyVal(name, value){
      this.accessDB(function (store) {
        store.put({name: name, key: value});
      });
    }

    getKeyVal(name){
      this.accessDB(function (store) {
        var getData = store.get(name);
        getData.onsuccess = function(event) {
          return event.target.result.key;
        };

        getData.onerror = function (event){
          console.log("key for this index does not exist");
          return undefined;
        };
      })
    }
}