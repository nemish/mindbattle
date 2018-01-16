import {
  GraphQLList,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
  GraphQLInt,
  GraphQLFloat
} from 'graphql';
import Challenge from '../models/Challenge';
import { handleCreateChallenge } from '../controllers/home';
const {makeExecutableSchema} = require('graphql-tools');


const typeDefs = `
    scalar Date

    # Player temp object
    type Player {
      _id: String!
      name: String!
    }

    # Question temp object
    type Question {
      options: [String]!
      result: String!
      operation: String
    }

    # Answer temp object
    type Answer {
      _id: String!
      option: String!
      elapsed: Float!
      timestamp: Date
    }


    # Representing of Challenge model
    type Challenge {
        _id: ID!
        userId: String!
        types: [String]
        timestamp: Date!
        state: String!
        access: String!
        maxPlayers: Int!
        players: [Player]!
        playersCount: Int!
        currentRoundStartTime: Date
        currentQuestion: Int
        questions: [Question]
        anwers: [Answer]
    }

    # Challenge data received from client
    input ChallengeInput {
        userId: String
        timestamp: Date
        state: String
        access: String
    }

    type Query {
        challenges: [Challenge]
        challenge(_id: String!): Challenge
    }

    type Mutation {
        newChallenge(
            userId: String!
            access: String
        ): Challenge
    }

    schema {
        query: Query
        mutation: Mutation
    }
`;

const resolvers = {
    Mutation: {
        newChallenge: (_, args) => {
            return new Promise((res, rej) => {
                console.log('new Promise', args);
                handleCreateChallenge(Object.assign({}, args, { errCb: () => rej() }), ch => {
                    return res(ch);
                });
            });
        }
    },

    Query: {
        challenges: () => Challenge.find(),
        challenge: (_, { _id }) => Challenge.findById(_id)
    }
};


export const GQLSchema = makeExecutableSchema({typeDefs, resolvers});
