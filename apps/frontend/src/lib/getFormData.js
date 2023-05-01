import { toObject } from '@soulofmischief/array.js/reduce'


/** Reduce form data to an easily parsed object. */
export function getFormData( target ) {
  //noinspection JSCheckFunctionSignatures
  return [ ...new FormData( target )].reduce( ...toObject())
}
