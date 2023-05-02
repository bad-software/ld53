import m from 'mithril'
import { body } from './style.module.scss'


const _Status = `.${body}`


export const Status = {
  view( vnode ) { return m( _Status, [
    m( 'h2.m-b-2', 'Sam' ),

    // Score
    m( 'span.m-b-1', [
      'Score: ',
      m( 'strong', vnode.attrs.game?.opponent.score ),
    ]),

    // Deliveries
    m( 'span', [
      'Packages delivered: ',
      m( 'strong',
        `${vnode.attrs.game?.opponent.deliveries}` +
        `/${vnode.attrs.game?.deliveryTarget}`
      )
    ]),
  ])}
}
