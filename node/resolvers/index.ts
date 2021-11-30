import { queries as catalogSystemQueries } from './catalogSystem'
import { queries as searchQueries } from './search'

export const resolvers = {
  Query: {
    ...catalogSystemQueries,
    ...searchQueries,
  },
}
