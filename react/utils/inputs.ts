/**
 * Useful to avoid having to having to create another state for the input string,
 * because using type="number" gives an empty ChangeEvent value when the
 * number is invalid, and it would clear the quantity variable as a consequence.
 */
export function isInteger(value: string) {
  return value.match(/^-?[0-9]*$/) != null
}

/**
 * Converts NaN to null, to make checks for invalid values easier.
 */
export function convertInteger(value: string) {
  return value === '' || Number.isNaN(+value) ? null : +value
}
