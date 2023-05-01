import m from 'mithril'
import { Toasts } from 'Components/Toast'

import {
  defaultLayout_wrapper
} from './style.module.scss'


export function Default() {
  return {
    onupdate() {
      console.log( '%c m.redraw()', 'color: forestgreen;' )
    },
    view( v ) {
      return m( '', { class: defaultLayout_wrapper }, [
        v.children,
        m( Toasts ),
      ])
    }
  }
}
