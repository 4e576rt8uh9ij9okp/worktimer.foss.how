class Storage{
    constructor(dbname, version){
        this._dbname = dbname;
        this._version = version;
        this.db;
    }

    id(){
        return window.crypto.randomUUID()
    }

    connect(){
        const indexedDB =
            window.indexedDB ||
            window.mozIndexedDB ||
            window.webkitIndexedDB ||
            window.msIndexedDB ||
            window.shimIndexedDB;

        return new Promise((res, rej) => {
            const dbReq = indexedDB.open(this._dbname, this._version);

            dbReq.onupgradeneeded = (e) => {
                const db = e.target.result
                const store = db.createObjectStore("entries", {autoIncrement: true})
                store.createIndex("month", ["month"], {unique: false})
                store.createIndex("year", ["year"], {unique: false})

            }
    
            dbReq.onsuccess = (e) => {
                this.db = dbReq.result
                res()
            }

            dbReq.onerror = (e) => {
                console.error(`Database error: ${e.target.errorCode}`);
                rej(e.target.errorCode)
            }
        })

    }

    tx(collection, mode){
        this._tx = this.db.transaction(collection, mode)

        return this
    }

    store(store){
        this._store = this._tx.objectStore(store)
        this.index = null;

        return this
    }

    index(index){
        this._index = this._store.index(index)

        return this
    }

    insert(data){
        const storeOrIndex = this._index ? this._index : this._store;
        
        storeOrIndex.add(data)
    }

    get(){
        return new Promise((res, rej) => {
            const storeOrIndex = this._index ? this._index : this._store;
            const req = storeOrIndex.getAll()
            req.onsuccess = (e) => {
                res(e.target.result)
            }
        })
    }
}