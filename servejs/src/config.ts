import * as dotenv from 'dotenv'
import * as process from 'process'

class Config {
  readonly mongo_uri: string
  readonly mongo_database: string

  constructor() {
    dotenv.config({
      path: "../.env"
    });
    
    this.mongo_uri = process.env.MONGO_URI as string
    this.mongo_database = process.env.MONGO_DATABASE as string
  }
}

export default new Config();