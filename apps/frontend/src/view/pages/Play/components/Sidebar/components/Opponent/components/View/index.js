import m from 'mithril'
import { body, canvas } from './style.module.scss'
import { init } from './lib'

const
  _View = `.${body}`,
  Canvas = `canvas.${canvas}`


export const View = {
  async oncreate({ dom }) {
    await init( dom.querySelector( Canvas ))
  },
  view() { return m( _View, [
    m( Canvas ),
  ])}
}
