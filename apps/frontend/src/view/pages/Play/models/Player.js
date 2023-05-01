import { audioManager, sfx } from 'Models'


const keymap = {
  // Move
  ArrowLeft: 'left',
  ArrowRight: 'right',
  ArrowDown: 'down',
  KeyA: 'left',
  KeyD: 'right',
  KeyS: 'down',

  // Hard drop
  Space: 'hardDrop',

  // Rotate
  KeyQ: 'rotateLeft',
  // KeyW: 'rotateRight',
}

const DROP_INTERVAL = 50 // Set the desired interval between drops in milliseconds
const FIRST_DROP_DELAY = 200 // Set the desired delay for the first drop in milliseconds

export class Player {
  deliveries = 0
  dropTimeout = null
  grid = null
  score = 0

  constructor( grid ) {
    this.grid = grid

    document.addEventListener( 'keydown', this._handleKeyDown )
    document.addEventListener( 'keyup', this._handleKeyUp )
  }

  _handleKeyDown = e => {
    // Prevent default browser behavior
    // e.preventDefault()

    if ( this.grid.game.isRunning ) {
      const command = keymap[ e.code ]

      if ( command ) {
        this.dispatch( command )

        // Start dropping tetromino when 'down' key is pressed
        if ( command === 'down' && !this.dropTimeout ) {
          this.dropTimeout = setTimeout(
            this._handleDrop,
            FIRST_DROP_DELAY,
            DROP_INTERVAL
          )
        }
      }
    }
  }

  _handleKeyUp = e => {
    const command = keymap[ e.code ]

    // Stop dropping tetromino when 'down' key is released
    if ( command === 'down' && this.dropTimeout ) {
      clearTimeout( this.dropTimeout )
      this.dropTimeout = null
    }
  }

  _handleDrop = ( interval ) => {
    this.dispatch( 'down' )
    this.dropTimeout = setTimeout( this._handleDrop, interval, DROP_INTERVAL )
  }

  dispatch( command ) {
    updateTetromino( command, this.grid )
  }

  // Called in game logic, currently unnecessary.
  update() {}
}


/**
 *
 * @param command
 * @param grid
 */
function updateTetromino( command, grid ) {
  // Directional movement.
  if ( command === 'left' ) {
    audioManager.play( sfx.MOVE, 0.15 )
    grid.safelyMoveTetromino( -1, 0 )
  } else if ( command === 'right' ) {
    audioManager.play( sfx.MOVE, 0.15 )
    grid.safelyMoveTetromino( 1, 0 )
  } else if ( command === 'down' ) {
    audioManager.play( sfx.MOVE, 0.15 )
    grid.safelyMoveTetromino( 0, 1 )
  } else if ( command === 'hardDrop' ) {
    audioManager.play( sfx.CLICK, 0.15 )
    grid.hardDropTetromino()
  }

  // Rotation.
  else if ( command === 'rotateLeft' ) {
    audioManager.play( sfx.ROTATE, 0.15 )
    grid.tetromino.rotateLeft( grid )

  } /*else if ( command === 'rotateRight' ) {
    // Right now, we don't allow the player to rotate right.
    // audioManager.play( sfx.ROTATE, 0.15 )
    // grid.tetromino.rotateRight( grid )
  }*/
}
