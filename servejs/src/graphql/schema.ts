import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLList,
  GraphQLString
} from 'graphql';

import db from '../db'
import apartment from './apartment'

export default new GraphQLSchema({
  query: new GraphQLObjectType({
    name: "Query",
    fields: {
      apartment: {
        type: new GraphQLList(apartment),
        args: {
          id: {
            type: GraphQLString
          },

          external_id: {
            type: GraphQLString
          }
        },
        resolve(root, {id, external_id}) {
          console.log("req", id, external_id)
          const query: any = {}
          if (external_id)
            query['external_id'] = external_id
          if (id)
            query['_id'] = id

          return db.apartments!.find(query).toArray()
        }
      }
    }
  })
})

