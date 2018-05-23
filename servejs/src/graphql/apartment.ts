import position from './position'
import property from './property'

import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLID,
  GraphQLInt
} from 'graphql';

export default new GraphQLObjectType({
  name: "apartment",
  fields: {
    id: {
      type: GraphQLID,
      resolve(apartment) {
        return apartment._id
      }
    },
    external_id: {
      type: GraphQLID,
    },
    address: {
      type: GraphQLString,
    },
    area: {
      type: GraphQLString,
    },
    floor: {
      type: GraphQLString,
    },
    position: {
      type: position,
    },
    preconditions: {
      type: new GraphQLList(property)
    },
    included: {
      type: new GraphQLList(property)
    },
    properties: {
      type: new GraphQLList(property)
    },
    publish_date: {
      type: GraphQLString
    },
    move_in_date: {
      type: GraphQLString
    },
    apply_before: {
      type: GraphQLString
    },
    rent: {
      type: GraphQLInt
    },
    size: {
      type: GraphQLInt
    },
    rooms: {
      type: GraphQLString
    },
    url: {
      type: GraphQLString
    },
    photo: {
      type: GraphQLString
    },
    photo_floorplan: {
      type: GraphQLString
    }
  }
})
