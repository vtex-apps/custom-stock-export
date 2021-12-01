import { queries as catalogQueries } from './catalog'

export const resolvers = {
  Query: {
    ...catalogQueries,
  },
}
