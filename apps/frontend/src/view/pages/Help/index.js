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

  return {
    oncreate() {
      window.addEventListener( 'keydown', listener )
    },

    onremove() {
      window.removeEventListener( 'keydown', listener )
    },

    view() {
      return m( Home, [
        m( 'h1', 'How to play' ),

        m( 'p',
          'In this game, you must successfully deliver packages by moving ' +
          'and rotating groups of packages to create rows of ten.'
        ),

        m( 'p',
          'Each row represents a delivery truck, and the color next to the ' +
          'row represents the color of the package that must be ' +
          'delivered. When a row is filled and 5 or more packages of the ' +
          'same color are in the row, you score!'
        ),

        m( 'p.b',
          'Complete the number of deliveries required to win each level.'
        ),

        User.current() && m( CurrentUser ),

        m( Button, {
          onclick: leaderboard,
        }, 'Cool' ),
      ])
    }
  }
}


const CurrentUser = {
  view() {
    return m( 'h2.m-b-4', [
      m( 'span', 'High Score: ' ),
      m( 'strong', `${User.current().highScore} points` ),
    ])
  }
}


async function logout() {
  await client.logout()
  User.current( null )
}


function leaderboard() {
  audioManager.play( sfx.CLICK, 0.5 )

  m.route.set( paths.leaderboard )
}
