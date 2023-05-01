import m from 'mithril'
import stream from 'mithril/stream'
import { body, input, slider, slider_knob } from './style.module.scss'


// TODO: Accessibility pass
export function Toggle({ attrs }) {
  // Toggle state.
  const state = stream( attrs.store[ attrs.field ])

  // Update store.
  state.map( value => {
    attrs.store[ attrs.field ] = value
  })

  return {
    view() { return m( 'div', { class: body }, [
      m( 'input', {
        class: input,
        type: 'checkbox',
        checked: state(),
        oninput( e ) { state( e.target.checked )}
      }),
      m( 'div', { class: slider }, m( '', { class: slider_knob }))
    ])}
  }
}
