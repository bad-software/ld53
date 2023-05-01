import { client } from 'Client'
import stream from 'mithril/stream'
import { getDefaultAvatar } from 'Lib'


const
  current = stream( null ),
  // TODO: Share role definitions between projects.
  isAdmin = current.map(
    user => user?.roles?.includes( 'Admin', 'Super Admin' ) || false
  )


/**
 * Current user & related state.
 */
export const User = {
  current,
  isAdmin,
  defaultAvatar: getDefaultAvatar( 'LD User' ),

  isCurrent( user ) {
    return user.id === this.current().id
  },

  async update( user ) {
    return this.current(
      user ||
      ( await client.get( 'authentication' ))?.user
    )
  },

  getToken: async () => client.get( 'authentication' ).accessToken,
}
