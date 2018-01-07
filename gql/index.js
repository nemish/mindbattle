import {
  GraphQLList,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
  GraphQLInt,
  GraphQLFloat
} from 'graphql';
import Challenge from '../models/Challenge';
const {makeExecutableSchema} = require('graphql-tools');


const typeDefs = `
    scalar Date

    type Challenge {
      _id: ID!
      userId: String!
      timestamp: Date!
      state: String!
      access: String!
      maxPlayers: Int!
      players: [String]!
      playersCount: Int!
      currentRoundStartTime: Date!
      currentQuestion: Int!
    }


    type Query {
        challenges: [Challenge]
        challenge(_id: String!): Challenge
    }

    schema {
        query: Query
    }
`;

const resolvers = {
    Query: {
        challenges: () => Challenge.find(),
        challenge: (_, { _id }) => Challenge.findById(_id)
    }
};

// const ChallengeType = new GraphQLObjectType({
//   name: 'challenge',
//   fields: function () {
//     return {
//       _id: {
//         type: GraphQLString
//       },
//       userId: {
//         type: GraphQLString
//       },
//       timestamp: {
//         type: GraphQLInt
//       },
//       state: {
//         type: GraphQLString
//       },
//       access: {
//         type: GraphQLString
//       },
//       maxPlayers: {
//         type: GraphQLInt
//       },
//       players: {
//         type: new GraphQLList(GraphQLString)
//       },
//       playersCount: {
//         type: GraphQLInt
//       },
//       questions: {
//         type: new GraphQLList(GraphQLString)
//       },
//       currentRoundStartTime: {
//         type: GraphQLInt
//       },
//       currentQuestion: {
//         type: GraphQLInt
//       }
//     }
//   }
// });


// const queryType = new GraphQLObjectType({
//   name: 'Query',
//   fields: function () {
//     return {
//       challenge: {
//         type: new GraphQLList(ChallengeType),
//         resolve: function () {
//             return Challenge.find();
//             // return  new Promise((resolve, reject) => {
//             //     Challenge.find({}).exec((err, items) => {
//             //       if (err) {
//             //           reject(err);
//             //       } else {
//             //           resolve(items);
//             //       }
//             //     });
//             // });
//         }
//       },
//       ch: {
//         type: GraphQLString,
//         args: {
//             _id: {
//                 type: GraphQLInt
//             }
//         },
//         resolve(root, args) {
//             return 'ololo' + args._id;
//         }
//       }
//       // challenge1: {
//       //   type: new GraphQLObjectType(ChallengeType),
//       //   resolve: function (root, args) {
//       //       return Challenge.findById(args._id);
//       //       // return  new Promise((resolve, reject) => {
//       //       //     Challenge.find({}).exec((err, items) => {
//       //       //       if (err) {
//       //       //           reject(err);
//       //       //       } else {
//       //       //           resolve(items);
//       //       //       }
//       //       //     });
//       //       // });
//       //   }
//       // }
//     }
//   }
// });



export const GQLSchema = makeExecutableSchema({typeDefs, resolvers});
// export const GQLSchema = new GraphQLSchema({
//     query: queryType
// });
