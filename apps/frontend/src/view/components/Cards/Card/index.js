import m from 'mithril'

import {
  body,
  card,
  content,
  footer,
  header,
} from './style.module.scss'


export const Card = {
  view({ attrs, children }) { return m(
    'article',
    {
      ...attrs,
      class: `${body} ${attrs.class || ''} ${
        attrs.type === 'flat'
          ? ''
          : card
      }`,
      style: 'overflow: hidden;' + attrs.style,
      contentClass: undefined,
      footer: undefined,
      footerClass: undefined,
      header: undefined,
      headerClass: undefined,
    },
    [
      // Header
      attrs.header && m( 'header',
        { class: `${header} ${attrs.headerClass || ''}` },
        attrs.header || ''
      ),

      // Content
      m( 'section',
        { class: `${content} ${attrs.contentClass || ''}` },
        children
      ),

      // Footer
      attrs.footer && m( 'footer',
        { class: `${footer} ${attrs.footerClass || ''}` },
        attrs.footer || ''
      ),
    ]
  )}
}
