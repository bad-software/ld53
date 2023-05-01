import stream from 'mithril/stream'


const counter = stream()


export const state = {
  counter: counter.map( ( v ) => v + 1, 0 ),
}
