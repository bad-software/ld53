import m from 'mithril'
import { flip } from '@soulofmischief/js-utils'
import mainMusic from 'Assets/music/main.mp3'
import { client } from 'Client'
import { Toast } from 'Components/Toast'
import { User, audioManager, music, sfx } from 'Models'
import { paths } from 'Router'
import { AI } from './AI'
import { Grid } from './Grid'
import { Player } from './Player'


export class Game {
  audioManager = null
  // Update every second by default.
  period = 1000
  opponentDeliveries = 0
  time = 0
  player = null
  opponent = null
  isRunning = false

  sounds = {
    // EXPLOSION: audioManager.add( 'Assets/sounds/explosion.mp3' ),
    // POWERUP: audioManager.add( 'Assets/sounds/powerup.mp3' ),
    MAIN_MUSIC: audioManager.add( mainMusic, true ),
  }

  constructor(
    canvas1,
    canvas2,
    {
      deliveryTarget = 5,
    } = {}
  ) {
    this.deliveryTarget = deliveryTarget

    // Configure grids.
    this.grid1 = createGrid( this, canvas1, 'player' )
    this.grid2 = createGrid( this, canvas2, 'opponent' )
    this.player = new Player( this.grid1 )
    this.opponent = new AI( this.grid2 )
  }

  init() {
    this.player.deliveries = 0
    this.opponentDeliveries = 0

    // Listen for opponent speech.
    this.opponentSpeakListener = addEventListener( 'opponentSpeak', async e => {
      const textResponse = await client
        .service( 'text-generations' )
        .create({
          type: e.detail.type,
          opponent: {
            score: this.opponent?.score || 0,
          },
          player: {
            name: User.current().username,
            score: this.player?.score || 0,
          }
        })

      console.log( 'speak', textResponse )

      const voiceResponse = await client
        .service( 'voice-generations' )
        .create({
          text: textResponse,
        })

      // Play using audiomanager speech method.
      const buffer = voiceResponse.data

      const blob = new Blob( [ buffer ], { type: 'audio/mp3' })
      const url = URL.createObjectURL( blob )

      audioManager.speak( buffer )

      Toast.add( textResponse )
    })

    // Listen for line clear events.
    this.linesClearedListener = addEventListener( 'linesCleared', e => {
      audioManager.play( sfx.CLICK, 0.7 )

      // Notify player.
      Toast.add(
        `${User.current().username} cleared ${e.detail.count} lines!`
      )

      // Handle player line clears.
      if ( e.detail.player === 'player' ) {
        this.player.score += e.detail.count * 100
      } else {
        this.opponent.score += e.detail.count * 100
      }
    })

    // Listen for delivery events.
    this.deliveryCompleteListener = addEventListener( 'deliveryComplete', e => {
      // Play sound.
      audioManager.play( sfx.DELIVERY, 0.5 )

      // Handle player deliveries.
      if ( e.detail.player === 'player' ) {
        // Notify player.
        Toast.add(
          `${User.current().username} delivered ${e.detail.count} packages!`
        )

        // Increase stats.
        this.player.deliveries++
        this.player.score += e.detail.count * 100

        // Check for win condition.
        if ( this.player.deliveries >= this.deliveryTarget ) {
          this.win( 'player' ).catch( console.error )
        }

        // Add garbage to opponent.
        this.opponent.grid.addGarbage( e.detail.count )
        this.opponent.speak( 'receivedGarbageBlock' )

      } else {
        // Notify player.
        Toast.add(
          `Your opponent delivered ${e.detail.count} packages!`
        )

        // Increase stats.
        this.opponentDeliveries++
        this.opponent.score += e.detail.count * 100

        // Add garbage to player.
        this.player.grid.addGarbage( e.detail.count )
      }
    })
  }

  draw() {
    this.grid1.draw()
    this.grid2.draw()
  }

  end() {
    this.pause()

    // Remove event listeners.
    if ( this.opponentSpeakListener ) {
      removeEventListener( 'linesCleared', this.linesClearedListener )
      this.opponentSpeakListener = null
    }

    if ( this.linesClearedListener ) {
      removeEventListener( 'deliveryComplete', this.deliveryCompleteListener )
      this.linesClearedListener = null
    }

    if ( this.deliveryCompleteListener ) {
      removeEventListener( 'opponentSpeak', this.opponentSpeakListener )
      this.deliveryCompleteListener = null
    }
  }

  play() {
    this.isRunning = true
    this.loop()
  }

  pause() {
    this.isRunning = false
  }

  loop() {
    let lastTime = 0

    const _loop = time => {
      if ( !this.isRunning ) return

      const deltaTime = time - lastTime
      lastTime = time

      this.update( deltaTime )
      this.draw()

      requestAnimationFrame( _loop )
    }

    requestAnimationFrame( _loop )
  }

  async lose( player ) {
    this.end()

    if ( player === 'player' ) {
      this.opponent.speak( 'win' )
      audioManager.play( sfx.LOSE, 0.8 )
      Toast.add( 'Sam wins!' )

      const { id } = User.current()

      // Get current high score.
      const highScore = await client
        .service( 'users' )
        .get( id )
        .then( user => user.highScore )

      console.log( 'highScore', highScore )

      client
        .service( 'users' )
        .patch( id, {
          highScore: Math.max( highScore, this.player.score ),
        })

      setTimeout(() => this.showLoseModal(), 6000 )

    } else {
      this.opponent.speak( 'lose' )
      audioManager.play( sfx.WIN, 0.8 )
      Toast.add( `${User.current().username} wins!` )

      setTimeout(() => this.showWinModal(), 6000 )
    }
  }

  showLoseModal() {
    alert(
      `You lose! Final score: ${this.player.score}! Play again?`
    )

    location.reload()
  }

  showWinModal() {
    alert(
      `You win! Final score: ${this.player.score}! Play again?`
    )

    location.reload()
  }

  start() {
    audioManager.stopAll()
    audioManager.play( music.MAIN_MUSIC, 0.7 )

    this.init()
    this.play()
  }

  update( deltaTime ) {
    // Advance time.
    this.time += deltaTime

    // Update players.
    this.player.update( deltaTime )
    this.opponent.update( deltaTime )

    // Update grids if period has elapsed.
    if ( this.time > this.period ) {
      this.grid1.update( deltaTime )
      this.grid2.update( deltaTime )
      this.time = this.time % this.period
    }
  }

  async win( player ) {
    this.end()

    if ( player === 'player' ) {
      this.opponent.speak( 'lose' )
      audioManager.play( sfx.WIN, 0.8 )
      Toast.add( `${User.current().username} wins!` )

      const { id } = User.current()


      // Get current high score.
      const highScore = await client
        .service( 'users' )
        .get( id )
        .then( user => user.highScore )

      console.log( 'highScore', highScore )

      client
        .service( 'users' )
        .patch( id, {
          highScore: Math.max( highScore, this.player.score ),
        })

      setTimeout(() => this.showWinModal(), 6000 )
    } else {
      this.opponent.speak( 'win' )
      audioManager.play( sfx.LOSE, 0.8 )
      Toast.add( 'Sam wins!' )
      setTimeout(() => this.showLoseModal(), 6000 )
    }
  }
}


/**
 *
 * @param canvas
 * @param game
 * @param player
 */
function createGrid( game, canvas, player ) {
  const grid = new Grid( game, player )
  grid.setCanvas( canvas )

  return grid
}


function restart() {
  m.route.set( paths.home )
  setTimeout(() => m.route.set( paths.play ), 100 )
}
