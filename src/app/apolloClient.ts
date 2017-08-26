import { ApolloClient, createNetworkInterface } from 'apollo-client';

// by default, this client will send queries to `/graphql` (relative to the URL of your app)
const client = new ApolloClient({
  networkInterface: createNetworkInterface({
    uri: 'http://localhost:3012/graphql/'
  }),
});

export function provideClient(): ApolloClient {
  return client;
};
