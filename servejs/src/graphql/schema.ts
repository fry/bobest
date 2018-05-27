import { makeExecutableSchema } from 'graphql-tools';


import { Apartment } from '../db'

const typeDefs = `
type Position {
  lat: Float
  long: Float
}

type Property {
  id: String
  name: String
}

type Apartment {
  _id: ID
  external_id: ID
  address: String
  area: String
  floor: String
  position: Position
  preconditions: [Property]
  included: [Property]
  properties: [Property]
  publish_date: String
  move_in_date: String
  apply_before: String
  rent: Int
  size: Int
  rooms: String
  url: String
  photo: String
  photo_floorplan: String
}

type Query {
  apartment(id: ID): [Apartment]
}
`

const resolvers: any = {
  Query: {
    apartment(id: String) {
      const query: any = {}
      // if (external_id)
      //   query['external_id'] = external_id
      if (id)
        query['_id'] = id

      return Apartment.find(query).exec()
    }
  }
}

export default makeExecutableSchema({
  typeDefs, resolvers
})
