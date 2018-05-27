import { Apartment } from './db'
import schema from './graphql/schema'

import * as express from 'express'
import * as graphqlHTTP from 'express-graphql'

class App {
  public app: express.Application

  constructor () {
    this.app = express()
    this.mountRoutes()
  }

  private mountRoutes (): void {
    const router = express.Router()
    router.get('/api/json', async (req, res) => {
      try {
        const apartments = await Apartment.find({}).exec()
        res.json({
          apartments: apartments
        })
      } catch(e) {
        console.log(e)
      }
    })

    router.use('/api/graphql', graphqlHTTP({
      schema,
      graphiql: true
    }))

    this.app.use('/', router);
  }
}

export default new App().app