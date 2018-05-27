import config from '../config'
import * as mongoose from 'mongoose'

import Apartment from './models/apartment'

class Database {
  private client = new mongoose.Mongoose();
  
  constructor() {

  }

  public async connect() {
    this.client.connect(config.mongo_uri)

    console.log(`Connecting to DB ${config.mongo_uri}/${config.mongo_database}`)
  }
}

export default new Database()
export {
  Apartment
}