export const MAX_ITEMS_AUTOCOMPLETE = 10
export const getTermFromOption = (option: AutocompleteOption): string =>
  typeof option === 'string' ? option : option.label
