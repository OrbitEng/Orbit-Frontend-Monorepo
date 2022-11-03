export default class IDBClient{
    /**
     * this creates a db instance for said program.
     * it is important to call this first before anything else
     * @param {string} db_name 
     * @param {number} version 
     */
    constructor(db_name){
        if(window && window.indexedDB){
            this.idb = window.indexedDB;
        }
        this.db_name = db_name;
    }

    /**
     * loads table for given program. if it does not exist,
     * table with given name is created
     * @param {string} table_name table name
     * @param {string[]?} params array of column names
     * @returns 
     */
    LoadTables = (tables, version = 2) => {
        var client = this;
        return new Promise(
            function(resolve, reject){
                let dbreq  = client.idb.open(client.db_name, version);
                dbreq.onsuccess = function(e){
                    resolve();
                }
                dbreq.onupgradeneeded = function(e) {
                    for(let table of tables){
                        try{
                            let object_store = e.target.result.createObjectStore(table.table_name, {keyPath: "id"});
                            if(table.params){
                                for(let param of table.params){
                                    object_store.createIndex(param, param);
                                };
                            };
                        }catch(e){
                            console.log("table exists: ", e)
                        }
                    }
                    resolve();
                };
                dbreq.onerror = function(e) {
                    reject("could not open object store")
                };
            }
        )
    };
    
    /**
     * loads a value from the table
     * key can be of any type
     * @param {string} table_name 
     * @param {any} key 
     * @param {string} index? optional index
     * @returns 
     */
    ReadKeyValue = (table_name, key, index, version = 2) => {
        var client = this;
        return new Promise(
            function(resolve, reject){
                let openreq = client.idb.open(client.db_name, version);
                openreq.onsuccess = function(e){
                    let tx = e.target.result.transaction(table_name, "readonly");
                    let store_req = tx.objectStore(table_name);
                    if(index){
                        store_req = store_req.index(index)
                    }
                    let query = store_req.get(key);

                    query.onerror = function(){
                        reject("errored in query")
                    }

                    query.onsuccess = function(){
                        if(query.result){
                            resolve(query.result)
                        }else{
                            reject("no query result")
                        }
                    }

                }
                openreq.onerror = function(e){
                    reject(e)
                }
            }
        )
    };

    /**
     * loads a value from the table
     * key can be of any type
     * @param {string} table_name 
     * @param {any} key 
     * @param {string} index? optional index
     * @returns 
     */
     ReadKey = (table_name, key, index, version = 2) => {
        var client = this;
        return new Promise(
            function(resolve, reject){
                let openreq = client.idb.open(client.db_name, version);
                openreq.onsuccess = function(e){
                    let tx = e.target.result.transaction(table_name, "readonly");
                    let store_req = tx.objectStore(table_name);
                    if(index){
                        store_req = store_req.index(index)
                    }
                    let query = store_req.getKey(key);

                    query.onerror = function(){
                        reject("error")
                    }

                    query.onsuccess = function(){
                        if(query.result){
                            resolve(query.result)
                        }else{
                            reject("error")
                        }
                    }

                }
            }
        )
    };

    /**
     * writes a value into table
     * key and value can be any type
     * @param {string} table_name 
     * @param {any} key 
     * @param {any} value 
     * @returns 
     */
    WriteDatabase = (table_name, key, value, version = 2) => {
        var client = this;
        return new Promise(
            function(resolve, reject){
                let openreq = client.idb.open(client.db_name, version);
                openreq.onsuccess = function(e){
                    let tx = e.target.result.transaction(table_name, "readwrite");
                    let store_req = tx.objectStore(table_name);
                    value.id = key;
                    let query = store_req.put(value);

                    query.onerror = function(){
                        reject("error")
                    }

                    query.onsuccess = function(){
                        if(query.result){
                            resolve(query.result)
                        }else{
                            reject("error")
                        }
                    }
                }
            }
        )
    };

    DeleteKeyValue = (table_name, key, version = 2) => {
        var client = this;
        return new Promise(
            function(resolve, reject){
                let openreq = client.idb.open(client.db_name, version);
                openreq.onsuccess = function(e){
                    let tx = e.target.result.transaction(table_name, "readwrite");
                    let store_req = tx.objectStore(table_name);
                    let query = store_req.delete(key);

                    query.onerror = function(){
                        reject("error")
                    }

                    query.onsuccess = function(){
                        if(query.result){
                            resolve(query.result)
                        }else{
                            reject("error")
                        }
                    }
                }
            }
        )
    };

    /**
     * reads all keys for a table.
     * good when the keys themselves provide info
     * eg: catalog program stores info in the form
     *  catalog name: address on chain
     * 
     * in this case, the catalog names themselves
     * would give user meta info into what catalogs theyve made
     * more so than random numbers (addresses)
     * @param {string} table_name 
     * @returns {string[]}
     */
    ReadAllKeys = (table_name, version = 2) => {
        var client = this;
        return new Promise(
            function(resolve, reject){
                let openreq = client.idb.open(client.db_name, version);
                openreq.onsuccess = function(e){
                    let tx = e.target.result.transaction(table_name, "readonly");
                    let store_req = tx.objectStore(table_name);
                    let index = store_req.index("id");
                    let query = index.getAllKeys();

                    query.onerror = function(){
                        reject("error")
                    }

                    query.onsuccess = function(){
                        if(query.result){
                            resolve(query.result)
                        }else{
                            reject(`error`)
                        }
                    }

                }
            }
        )
    };

    ReadAllValues = (table_name, version = 2) => {
        var client = this;
        return new Promise(
            function(resolve, reject){
                let openreq = client.idb.open(client.db_name, version);
                openreq.onsuccess = function(e){
                    let tx = e.target.result.transaction(table_name, "readonly");
                    let store_req = tx.objectStore(table_name);
                    let index = store_req.index("id");
                    let query = index.getAll();

                    query.onerror = function(){
                        reject("error")
                    }

                    query.onsuccess = function(){
                        if(query.result){
                            resolve(query.result)
                        }else{
                            reject(`error`)
                        }
                    }

                }
            }
        )
    };
}