import { flip } from '@soulofmischief/js-utils'


export class AI {
  lastSpeakTime = 0
  speakPeriod = 15000
  deliveries = 0
  score = 0
  grid = null

  constructor( grid ) {
    this.grid = grid
  }

  dispatch( command ) {
    if ( flip( 0.2 )) {
      updateTetromino( command, this.grid )
    }
  }

  getNextCommand() {
    // Move left.
    return flip()
      ? flip()
        ? flip( 0.67 )
          ? 'left'
          : 'right'
        : 'down'
      : flip()
        ? 'rotateLeft'
        : 'rotateRight'
  }

  update( delta ) {
    // Get next command.
    const nextCommand = this.getNextCommand()

    this.lastSpeakTime += delta

    // Tiny chance to say something.
    if ( flip( 0.05 )) {
      this.speak( 'taunt' )
    }

    // Dispatch command.
    this.dispatch( nextCommand )
  }

  speak( type = 'taunt' ) {
    if ( this.lastSpeakTime > this.speakPeriod ) {
      dispatchEvent( new CustomEvent( 'opponentSpeak', {
        detail: { type },
      }))

      this.lastSpeakTime = 0
    }
  }
}


/**
 *
 * @param command
 * @param grid
 */
function updateTetromino( command, grid ) {
  // Directional movement.
  if ( command === 'left' ) {
    grid.safelyMoveTetromino( -1, 0 )
  } else if ( command === 'right' ) {
    grid.safelyMoveTetromino( 1, 0 )
  } else if ( command === 'down' ) {
    grid.safelyMoveTetromino( 0, 1 )
  }

  // Rotation.
  else if ( command === 'rotateLeft' ) {
    grid.tetromino.rotateLeft( grid )
  } else if ( command === 'rotateRight' ) {
    // grid.tetromino.rotateRight( grid )
  }
}
