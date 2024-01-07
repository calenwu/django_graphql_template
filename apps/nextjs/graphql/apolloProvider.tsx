'use client';

import { ApolloLink, HttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import {
  ApolloNextAppProvider,
  NextSSRInMemoryCache,
  NextSSRApolloClient,
  SSRMultipartLink,
} from '@apollo/experimental-nextjs-app-support/ssr';
import { BACKEND_URL_GRAPHQL } from '@/utils/const';

function makeClient() {

  const authLink = setContext((_, { headers }) => {
    // get the authentication token from local storage if it exists
    const token = ''; //localStorage.getItem('token');
    const tokenExp = localStorage.getItem('tokenExp');
    // return the headers to the context so httpLink can read them
    return {
      headers: {
        ...headers,
        authorization: token ? `JWT ${token}` : '',
      }
    }
  });

  const httpLink = new HttpLink({
    uri: (op) => BACKEND_URL_GRAPHQL + (op.variables['__uriExtra'] ? op.variables['__uriExtra'] : ''),
    credentials: 'include',
  });

  return new NextSSRApolloClient({
    cache: new NextSSRInMemoryCache(),
    link: typeof window === 'undefined'
      ? ApolloLink.from([
          new SSRMultipartLink({
            stripDefer: true,
          }),
          authLink.concat(httpLink),
        ])
      : authLink.concat(httpLink),
  });
}

export function ApolloProvider({ children }: React.PropsWithChildren) {
  return (
    <ApolloNextAppProvider makeClient={makeClient}>
      {children}
    </ApolloNextAppProvider>
  );
}