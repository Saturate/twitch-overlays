import {
	GraphQLInt,
	GraphQLBoolean,
	GraphQLString,
	GraphQLList,
	GraphQLObjectType,
	GraphQLNonNull,
	GraphQLSchema
} from 'graphql';

import requestify from 'requestify';
import fetch from 'node-fetch';
import getTopDonators from './utilities/getTopDonators';

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
});

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
		allDonations: {
			type: new GraphQLList(DonationType),
			args: {},
			async resolve (parentValue, args, context) {
				const maxLimit = 100;

				async function getAllDonations (lastId, lastData, times) {
					let callTimes = times + 1 || 1;
					return await requestify.request('https://streamlabs.com/api/v1.0/donations', {
						method: 'GET',
						timeout: 3000,
						dataType: 'json',
						params: {
							currency: 'DKK',
							limit: maxLimit,
							before: lastId,
							access_token: context.user.token
						}	
					})
					.then(function(response) {
						const data = response.getBody().data;
						const lastDonationId = data[data.length-1].donation_id;

						// If there are "maxLimit" results, we have to assume that there are more.
						// We don't know the totalt amount. This might make a useless request, but it's the only thing we can do.
						if(data.length >= maxLimit) {
							console.log('calling again');
							return getAllDonations(lastDonationId, data.concat(lastData || []), callTimes);
						}

						return data.concat(lastData || []);
					})
					.catch((err) => console.error)
					.fail((err) => console.error)
				}

				const allDonations = await getAllDonations();

				await console.log('Found:', allDonations && allDonations.length || '0', 'donations');

				return allDonations;
			}
		},
		topDonations: {
			type: new GraphQLList(DonationType),
			args: {
				top: { type: GraphQLInt, defaultValue: 10 },
			},
			async resolve (parentValue, args, context) {
				const maxLimit = 100;

				console.log('context', context.user);

				async function getAllDonations (lastId, lastData, times) {
					let callTimes = times + 1 || 1;
					return await requestify.request('https://streamlabs.com/api/v1.0/donations', {
						method: 'GET',
						timeout: 3000,
						dataType: 'json',
						params: {
							currency: 'DKK',
							limit: maxLimit,
							before: lastId,
							access_token: context.user.token
						}	
					})
					.then(function(response) {
						const data = response.getBody().data;
						const lastDonationId = data[data.length-1].donation_id;

						// If there are "maxLimit" results, we have to assume that there are more.
						// We don't know the totalt amount. This might make a useless request, but it's the only thing we can do.
						if(data.length >= maxLimit) {
							console.log('calling again');
							return getAllDonations(lastDonationId, data.concat(lastData || []), callTimes);
						}

						return data.concat(lastData || []);
					})
					.catch((err) => console.error)
					.fail((err) => console.error)
				}

				const allDonations = await getAllDonations();

				await console.log('Found:', allDonations && allDonations.length || '0', 'donations');

				if (args.top !== 0) {
					return await getTopDonators(allDonations).slice(0, args.top );
				} else {
					return await getTopDonators(allDonations);
				}
			}
		},
		donations: {
			type: new GraphQLList(DonationType),
			args: {
				limit: { type: GraphQLInt, defaultValue: 100 },
				before: { type: GraphQLInt },
				after: { type: GraphQLInt },
				currency: { type: GraphQLString, defaultValue: 'DKK' }
			},
			async resolve (parentValue, args, context) {
				const donations = await requestify.request('https://streamlabs.com/api/v1.0/donations', {
					method: 'GET',
					timeout: 3000,
					dataType: 'json',
					params: {
						currency: args.currency,
						limit: args.limit,
						before: args.before,
						access_token: context.user.token
					}	
				})
				.then(function(response) {
					return response.getBody().data;
				})
				.catch((err) => console.error)
				.fail((err) => console.error);

				return donations;
			}
		}
	}
  })

const schema = new GraphQLSchema({
	query: RootQuery
})

export default schema 