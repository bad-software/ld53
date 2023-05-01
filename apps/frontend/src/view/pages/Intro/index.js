import m from 'mithril'
import { client } from 'Client'
import { Button } from 'Components/UI/Button'
import { User, audioManager, music, sfx } from 'Models'
import { paths } from 'Router'
import { body, link } from './style.module.scss'


const
  Home = `.${body}`,
  Logout = `span.${link}`


export default () => {
  // Play on space.
  const listener = ( e ) => {
    if ( e.code === 'Space' ) play()
  }


  // Handle music.
  audioManager.stop( music.MAIN_MUSIC )

  if ( !audioManager.isPlaying( music.MENU_MUSIC )) {
    audioManager.play( music.MENU_MUSIC, 0.7 )
  }

  return {
    oncreate() {
      window.addEventListener( 'keydown', listener )
    },

    onremove() {
      window.removeEventListener( 'keydown', listener )
    },

    view() {
      return m( Home, [
        m( 'h1', 'Parcel Panic' ),

        User.current() && m( CurrentUser ),

        m( Button, {
          onclick: play,
        }, 'Play' ),
      ])
    }
  }
}


const CurrentUser = {
  view() {
    return m( '.m-b-2', [
      m( 'span', 'Welcome back, ' ),
      m( 'strong', `${User.current().username}! ` ),
      m( Logout, { onclick: logout }, 'Logout' ),
    ])
  }
}


async function logout() {
  await client.logout()
  User.current( null )
}


function play() {
  audioManager.play( sfx.CLICK, 0.5 )

  m.route.set( paths.leaderboard )

  if ( !audioManager.isPlaying( music.MENU_MUSIC )) {
    audioManager.play( music.MENU_MUSIC, 0.7 )
  }
}
