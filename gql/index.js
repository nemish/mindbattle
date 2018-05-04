import {
  GraphQLList,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
  GraphQLInt,
  GraphQLFloat
} from 'graphql';
import Challenge from '../models/Challenge';
import UserDraft from '../models/UserDraft';
import {
    handleCreateChallenge,
    handleStartChallenge,
    handleExitChallenge,
    handleJoinChallenge
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
        challenges(exceptUserId: String): [Challenge]
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

        joinChallenge(
            challengeId: String!
            userId: String!
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
        exitChallenge: createMutation(handleExitChallenge),
        joinChallenge: createMutation(handleJoinChallenge)
    },

    Query: {
        challenges: (_, {exceptUserId}) => {
            if (exceptUserId) {
                return new Promise((res, rej) => {
                    UserDraft.findById(exceptUserId).exec((err, user) => {
                        if (err) {
                            return res([]);
                        }
                        return res(Challenge.find({
                            $or: [{
                                userId: {$ne: exceptUserId},
                                state: {
                                    $in: [
                                        Challenge.states.INITIAL,
                                        Challenge.states.READY
                                    ]
                                }
                            }, {
                                _id: user.current_challenge_id
                            }]
                        }));
                    });
                });
            }
            return Challenge.find();
        },
        challenge: (_, { _id }) => Challenge.findById(_id)
    }
};


export const GQLSchema = makeExecutableSchema({typeDefs, resolvers});
