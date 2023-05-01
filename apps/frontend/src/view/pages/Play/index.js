import m from 'mithril'
import { Canvas1, Canvas2, Main } from './components/Main'
import { Sidebar } from './components/Sidebar'
import { Game } from './models/index.js'
import { body } from './style.module.scss'


const Home = `.${body}`


export default () => {
  let game

  return {
    oncreate( vnode ) {
      // Get canvases.
      const
        canvas1 = vnode.dom.querySelector( Canvas1 ),
        canvas2 = vnode.dom.querySelector( Canvas2 )

      // Start new game.
      game = new Game( canvas1, canvas2 )
      game.start()

      m.redraw()
    },

    view() { return m( Home, [
      m( Main, { game }),
      m( Sidebar, { game }),
    ])}
  }
}
