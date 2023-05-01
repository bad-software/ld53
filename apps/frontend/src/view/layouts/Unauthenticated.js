import m from 'mithril'
import { Toasts } from 'Components/Toast'
import {
  defaultLayout,
  defaultLayout_wrapper,
  unauthenticated,
} from './style.module.scss'


export function Unauthenticated() {
  return {
    view({ children }) { return m( '',
      { class: defaultLayout_wrapper },
      m( '', { class: unauthenticated, }, [
        children,
        m( Toasts )
      ])
    )}
  }
}
