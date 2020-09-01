import 'reflect-metadata';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { BeerResolver } from './resolvers/beer.resolver';
import { createConnection } from 'typeorm';

(async () => {
	const app = express();

	await createConnection()
		.then(() => console.log('✅ Database Connection Success!'))
		.catch(error => console.log(`❌ Database Connection Failure: ${error}`))

	const server = new ApolloServer({
		schema: await buildSchema({
			resolvers: [BeerResolver]
		}),
		context: ({req, res}) => ({req, res})
	});

	server.applyMiddleware({
		app,
		path: '/api/archivemybeer',
		cors: true
	});

	app.listen(4123, () => {
		console.log(`✅ Server Start Success! http://localhost:4123/api/archivemybeer`);
	});
})();