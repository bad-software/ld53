import m from 'mithril'
import { body } from './style.module.scss'
import { Player } from './components/Player'
import { Opponent } from './components/Opponent'

const _Sidebar = `.${body}`


export const Sidebar = {
  view( vnode ) { return m( _Sidebar, [
    m( Player, { game: vnode.attrs.game }),
    m( Opponent, { game: vnode.attrs.game }),
  ])}
}
