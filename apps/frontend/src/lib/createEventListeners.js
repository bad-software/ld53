import { capitalize } from '@soulofmischief/strings'
import { pull } from '@soulofmischief/array.js'
import { get } from './get.js'


/**
 * Create add, remove and update listeners.
 */
export function createEventListeners(
  root,
  name,
  store,
  listeners = [ 'add', 'remove', 'update']
) {
  const n = capitalize( name )

  if ( !this[store]) this[store] = []

  if ( listeners.includes( 'add' )) root.addEventListener(
    `add${n}`, async e => this[store].push( e.detail ))

  if ( listeners.includes( 'remove' )) root.addEventListener(
    `remove${n}`, async e => this[store] && pull( this[store], e.detail ))

  if ( listeners.includes( 'update' )) root.addEventListener(
    `update${n}`, async e => update.call( this, e.detail ))

  function update({ data, item }) {
    Object.assign( get( this[store], item ), data )
  }
}
