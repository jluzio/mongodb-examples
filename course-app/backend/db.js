import { MongoClient } from 'mongodb';

const uri = 'mongodb://root:secret@127.0.0.1:27017/course_app?authSource=admin';

/* 
NOTE:
- the driver provides a connection pool
- the client can be reused

TODO:
- client singleton
- export client singleton method
- init client instance when app.js starts
- import client singleton on products.js
- find docs to confirm the reason on why reusing client is recommended
*/
export class DbService {
  /** @type {DbService} */
  static _INSTANCE = null
  /** @type {MongoClient} */
  client = null
  initialized = false

  static async init() {
    this._INSTANCE = new DbService()
    return await this._INSTANCE.connect()
  }
  static get() {
    return this._INSTANCE;
  }
  static client() {
    return this.get().client;
  }
  static db() {
    return this.get().client.db();
  }

  constructor() {
    this.client = new MongoClient(uri)
  }

  async connect() {
    await this.client.connect()
    console.log("Connected to MongoDB Database")
    this.initialized = true
  }
}
