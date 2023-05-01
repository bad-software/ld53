import m from 'mithril'


export const Exit = {
  view() { return m( '.options',
    { onclick: () => history.back(), title: 'Exit' },
    '✖'
  )}
}
