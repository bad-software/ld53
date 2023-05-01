

export function get( arg1, arg2 ) {
  if ( arg2 ) return arg1[ arg1.indexOf( arg2 )]
  else return this[ this.indexOf( arg1 )]
}
