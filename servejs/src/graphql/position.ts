import {
  GraphQLObjectType,
  GraphQLFloat
} from 'graphql';

export default new GraphQLObjectType({
  name: "position",
  fields: {
    lat: {
      type: GraphQLFloat
    },
    long: {
      type: GraphQLFloat
    },
  }
})