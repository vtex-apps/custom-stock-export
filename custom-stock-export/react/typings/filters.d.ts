interface SelectOption<T = string | Specification> {
  value: T
  label: string
}

interface Specification {
  category: SelectOption
  specificationField: SelectOption
  specification: string
}

interface Statement {
  error?: ApolloError
  object: SelectOption
  subject: string
  verb: string
}

interface StatementOption {
  value: string
  label: string
}

interface FilterProps {
  statements: Statement[]
  setStatements: (s: Statement[]) => void
  filteredByIsInCollection: boolean
  filterByIsInCollection: (id?: string) => void
}
