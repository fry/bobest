import config from './config'
import * as mongodb from 'mongodb'

class Database {
  private client = new mongodb.MongoClient(config.mongo_uri);
  
  db: mongodb.Db | null = null
  apartments: mongodb.Collection | null = null

  constructor() {

  }

  public async connect() {
    await this.client.connect()

    console.log(`Connecting to DB ${config.mongo_uri}/${config.mongo_database}`)
    this.db = this.client.db(config.mongo_database)

    this.apartments = this.db.collection("apartments")
  }
}

export default new Database()