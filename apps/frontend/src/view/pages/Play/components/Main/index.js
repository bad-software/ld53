import m from 'mithril'
import { body, canvas, canvas_container } from './style.module.scss'

const
  _Main = `.${body}`,
  Canvas1 = `canvas.${canvas}#canvas1`,
  Canvas2 = `canvas.${canvas}#canvas2`,
  CanvasContainer = `.${canvas_container}`

export const Main = {
  view() {
    return m( _Main, [
      m( 'h1.center-txt.m-b-4.u', 'Parcel Panic' ),
      m( CanvasContainer, [
        m( Canvas1, { width: 510, height: 600 }),
        m( Canvas2, { width: 510, height: 600 }),
      ]),
    ])
  },
}

export { Canvas1, Canvas2 }
