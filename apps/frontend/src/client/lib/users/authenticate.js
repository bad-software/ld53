import { client } from 'Client'
import { User } from 'Models/User'


/**
 * Await authentication, either with
 * credentials or a token in localStorage
 * @return {Boolean} Allows for chaining.
 */
export async function authenticate(
  { username, password } = {},
  throwError = false,
) {

  try {
    // If we provided credentials, authenticate with those
    // Otherwise try default auth strategy.
    if ( username && password )
      await client.authenticate({ username, password, strategy: 'local' })
    else
      await client.reAuthenticate()

    // Update user.
    await User.update()

    // Return boolean to allow function composition.
    return true
  }

  catch ( e ) {
    // Don't display missing access token error.
    if ( e.message === 'No accessToken found in storage' ) return false
    // Throw error if specified, else return false.
    else if ( throwError ) throw e
    // Log error if nothing else.
    else console.error( e )
  }

  return false
}
