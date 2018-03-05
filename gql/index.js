import {
  GraphQLList,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
  GraphQLInt,
  GraphQLFloat
} from 'graphql';
import Challenge from '../models/Challenge';
import {
    handleCreateChallenge,
    handleStartChallenge,
    handleExitChallenge
} from '../controllers/home';
const {makeExecutableSchema} = require('graphql-tools');


const typeDefs = `
    scalar Date

    type ResponseData {
        status: String!
    }

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

        startChallenge(
            id: String!
        ): Challenge

        exitChallenge(
            id: String!
            userId: String!
        ): ResponseData
    }

    schema {
        query: Query
        mutation: Mutation
    }
`;

const createMutation = handler => {
    return (_, args) => {
        return new Promise((res, rej) => {
            console.log('new Promise', args);
            handler(Object.assign({}, args, { errCb: () => rej() }), data => {
                return res(data);
            });
        });
    }
}

const resolvers = {
    Mutation: {
        newChallenge: createMutation(handleCreateChallenge),
        startChallenge: createMutation(handleStartChallenge),
        exitChallenge: createMutation(handleExitChallenge)
    },

    Query: {
        challenges: () => Challenge.find(),
        challenge: (_, { _id }) => Challenge.findById(_id)
    }
};


export const GQLSchema = makeExecutableSchema({typeDefs, resolvers});
