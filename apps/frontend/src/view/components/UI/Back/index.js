import m from 'mithril'
import { body } from './style.module.scss'


const _Back = `.${body}`


export const Back = {
  view( v ) { return m( _Back,
    { onclick: () => history.back(), title: 'Back', ...v.attrs },
    '🡰'
  )}
}
