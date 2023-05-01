import m from 'mithril'
import { body } from './style.module.scss'
import { Status } from './components/Status'
import { View } from './components/View'


const _Opponent = `.${body}`


export const Opponent = {
  view( vnode ) { return m( _Opponent, [
    m( Status, { game: vnode.attrs.game }),
    m( View, { game: vnode.attrs.game }),
  ])}
}
