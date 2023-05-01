import m from 'mithril'
import { body } from './style.module.scss'


export function Button() {
  return {
    view({ attrs, children }) { return m( 'button',
      {
        // Pass through all attributes.
        ...attrs,

        // Apply styles.
        class: `${body} ${attrs.class || attrs.className || ''}`,
        className: undefined,

        // Clear parent attributes.
        type: undefined,
      },
      children
    )}
  }
}


export {
  disabled,
  primary,
  secondary,
  tertiary,
  quaternary,
} from './style.module.scss'
