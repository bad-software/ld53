import m from 'mithril'
import { client } from 'Client'
// import { Toast } from 'Components/Toast'
// import { User } from 'Models/User'
import { paths } from 'Router'


export async function logout() {
  await client.logout()
  // Clear user.
  // User.update( null )

  // Redirect to home.
  m.route.set( paths.home )

  // Notify user.
  // Toast.add( 'Logged out' )
}
