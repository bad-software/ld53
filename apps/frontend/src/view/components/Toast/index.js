import m from 'mithril'
import { createEventListeners, makePromise } from 'Lib'
import { body, card, item } from './style.module.scss'
import { Card } from 'Components/Cards'


const title = 'Clear notification'


// Preserve toasts between routes.
export const toastStore = { store: []}


/**
 * Toast component
 */
export function Toasts() {
  return {
    async oncreate({ dom }) {
      createEventListeners.call( toastStore, dom, 'toast', 'store' )
    },

    view() { return (
      m( '#toast', { class: body }, toastStore.store.map( t =>
        m( Card,
          {
            class: card,
            title,
            key: t,
            onclick: () => {
              console.log('click', t )
              Toast.remove( t )
            },
            role: 'alert',
          },
          m( '', { class: item, }, t.text )
        )
      ))
    )}
  }
}


/**
 *Toast manager
 */
export class Toast {
  constructor( str, duration = 6000 ) {
    this.text = str
    Object.assign( this, { duration }, makePromise())

    //noinspection JSIgnoredPromiseFromCall
    this._removeOnDone()
  }

  async _removeOnDone() {
    //noinspection JSUnresolvedVariable
    await this.promise
    Toast.remove( this )
    m.redraw.sync()
  }

  /** Dispatch an add event. */
  static add( str, duration ) {
    const toast = new Toast( str, duration )

    document
      .querySelector( '#toast' )
      .dispatchEvent( new CustomEvent( 'addToast', { detail: toast }))

    //noinspection JSUnresolvedVariable
    setTimeout( toast.resolve, toast.duration )

    m.redraw.sync()
    return toast
  }

  /** Dispatch a remove event. */
  static remove( toast ) {
    document
      .querySelector( '#toast' )
      ?.dispatchEvent( new CustomEvent( 'removeToast', { detail: toast }))
    return toast
  }

  /** Update a text's details. */
  static update( text, str ) {
    text.text = str
    return text
  }
}
