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

  // Cache leaderboard.
  let leaderboard

  return {
    async oninit() {
      // Add listener.
      window.addEventListener( 'keydown', listener )

      // Fetch leaderboard.
      leaderboard = await client
        .service( 'leaderboards' )
        .get()

      m.redraw()
    },

    onremove() {
      // Remove listener.
      window.removeEventListener( 'keydown', listener )
    },

    view() {
      return m( Home, [
        m( 'h1.center-txt', 'Leaderboard' ),

        User.current() && m( HighScore ),

        leaderboard && m( TopScores, { scores: leaderboard.topScores }),

        // Start
        m( Button, { onclick: play }, 'Start' ),

        // Help
        m( Button, { onclick: help }, 'Help' ),

      ])
    }
  }
}


const HighScore = {
  view() {
    return m( 'h3.m-b-4.center-txt', [
      m( 'span', 'High Score: ' ),
      m( 'strong', `${User.current().highScore} points` ),
    ])
  }
}


const TopScores = {
  view({ attrs: { scores }}) {
    return m( '.center.m-b-4', [
      m( 'h2.center-txt', 'Top Scores' ),
      m( 'ol.center', scores.map( score => {
        return m( 'li', [
          m( 'span', `${score.username}: ` ),
          m( 'strong', `${score.highScore} points` ),
        ])
      })),
    ])
  }
}


async function logout() {
  await client.logout()
  User.current( null )
}


function help() {
  audioManager.play( sfx.CLICK, 0.5 )

  m.route.set( paths.help )
}


function play() {
  audioManager.play( sfx.CLICK, 0.5 )

  m.route.set( paths.play )
}
