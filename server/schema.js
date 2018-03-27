import {
    GraphQLInt,
    GraphQLBoolean,
    GraphQLString,
    GraphQLList,
    GraphQLObjectType,
    GraphQLNonNull,
    GraphQLSchema
} from 'graphql';

import fetch from 'node-fetch';

const DonationType = new GraphQLObjectType({
    name: 'Donation',
    description: 'Streamlabs donations',
    fields: {
        donation_id: { type: GraphQLInt },
        created_at: { type: GraphQLInt },
        name: { type: GraphQLString },
        currency: { type: GraphQLString },
        amount: { type: GraphQLString },
        message: { type: GraphQLString },
        email: { type: GraphQLString }
    }
})

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        SocketToken: {
            type: GraphQLString,
            args: {},
            async resolve (parentValue, args, context) {
                console.log(parentValue, args, context.user.token);
                const socketToken = await fetch('https://streamlabs.com/api/v1.0/socket/token?access_token=' + context.user.token)
                const json = await socketToken.json()
                return json.socket_token;
            }
        },
        donations: {
            type: new GraphQLList(DonationType),
            args: {},
            resolve (parentValue, args) {
                const mockdata = {
                    data: [
                        {
                            donation_id: 102348567,
                            created_at: 1522143180,
                            currency: "USD",
                            amount: "34.0000000000",
                            name: "fishsticks",
                            message: "gege",
                            email: "O0rbekiYDG"
                        },
                        {
                            donation_id: 102072012,
                            created_at: 1521465960,
                            currency: "USD",
                            amount: "10.0000000000",
                            name: "TestName",
                            message: "YOU ARE THE BEST!",
                            email: "dD2MQW9Jzb"
                        }
                    ]
                };

                return mockdata.data;
            }
        }
    }
  })

const schema = new GraphQLSchema({
    query: RootQuery
})

export default schema 