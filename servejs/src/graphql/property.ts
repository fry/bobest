import {
  GraphQLObjectType,
  GraphQLString
} from 'graphql';

export default new GraphQLObjectType({
  name: "property",
  fields: {
    id: {
      type: GraphQLString
    },
    name: {
      type: GraphQLString
    },
  }
})