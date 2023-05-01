import m from 'mithril'
import { User } from 'Models'
import { body } from './style.module.scss'


const _Player = `.${body}`


export const Player = {
  view( vnode ) { return m( _Player, [
    // Player
    m( 'h2', User.current().username ),

    // High score
    m( 'span.m-b-1', [
      'High score: ',
      m( 'strong', User.current().highScore ),
    ]),

    // Score
    m( 'span.m-b-1', [
      'Score: ',
      m( 'strong', vnode.attrs.game?.player.score ),
    ]),

    // Deliveries
    m( 'span', [
      'Packages delivered: ',
      m( 'strong',
        `${vnode.attrs.game?.player.deliveries}` +
        `/${vnode.attrs.game?.deliveryTarget}`
      )
    ]),
  ])}
}
