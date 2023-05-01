import { state } from './state.js'


function Actions( state ) {
  return {
    decrement: () => state.counter( -1 ),
    increment: () => state.counter( 1 ),
  }
}


export const actions= Actions( state )
