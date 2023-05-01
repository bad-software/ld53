import { flip } from '@soulofmischief/js-utils'
import { audioManager, sfx } from 'Models'


export class AI {
  lastMoveTime = 0
  movePeriod = 2000
  deliveries = 0
  grid = null
  nextCommands = []

  constructor( grid ) {
    this.grid = grid
  }

  dispatch( command ) {
    updateTetromino( command, this.grid )
  }

  getNextCommand() {
    if ( this.nextCommands.length === 0 ) {
      const bestMove = this.findBestMove()
      if ( bestMove ) {
        this.nextCommands = bestMove.commandSequence
      } else {
        // If there are no possible moves, hard drop the tetromino.
        this.nextCommands = ['hardDrop']
      }
    }

    return this.nextCommands.shift()
  }

  findBestMove() {
    let bestMove = null
    let bestScore = -Infinity

    const possibleMoves = this.generatePossibleMoves()

    for ( const move of possibleMoves ) {
      const score = this.calculateScore( move )

      if ( score > bestScore ) {
        bestScore = score
        bestMove = move
      }
    }

    return bestMove
  }

  generatePossibleMoves() {
    const moves = []

    const tetromino = this.grid.tetromino.clone()

    for ( let rotation = 0; rotation < 4; rotation++ ) {
      const width = this.grid.width
      const height = this.grid.height

      for ( let x = -2; x <= width - tetromino.width + 2; x++ ) {
        let y = 0

        while ( this.grid.isValidMove( tetromino, x, y, rotation )) {
          y++
        }

        y--

        const commandSequence = []

        for ( let r = 0; r < rotation; r++ ) {
          commandSequence.push( 'rotateLeft' )
        }

        if ( x < 0 ) {
          for ( let m = 0; m < -x; m++ ) {
            commandSequence.push( 'left' )
          }
        } else if ( x > 0 ) {
          for ( let m = 0; m < x; m++ ) {
            commandSequence.push( 'right' )
          }
        }

        commandSequence.push( 'hardDrop' )

        moves.push({
          rotation,
          move: x,
          commandSequence,
        })
      }

      tetromino.rotateLeft()
    }

    return moves
  }


  calculateScore( move ) {
    const { rotation, move: translation } = move
    const gridCopy = this.grid.clone()
    const tetromino = gridCopy.tetromino.clone()

    tetromino.rotate( rotation )
    tetromino.move( translation, 0 )

    const dropResult = gridCopy.hardDropTetromino( tetromino )
    const linesCleared = dropResult.clearedLines
    const holesCreated = gridCopy.getNumberOfHoles()
    const maxHeight = gridCopy.getMaxHeight()
    const finalPosition = tetromino.getPosition()

    // Calculate the distance from the final position to the center of the grid.
    const distanceFromCenter = Math.abs( finalPosition.x - gridCopy.width / 2 )

    return linesCleared * 10 - holesCreated * 5 - maxHeight - distanceFromCenter
  }

  update( delta ) {
    this.lastMoveTime += delta

    if ( this.lastMoveTime > this.movePeriod ) {
      const nextCommand = this.getNextCommand()
      this.dispatch( nextCommand )

      // Tiny chance to say something.
      if ( flip( 0.05 )) {
        console.log( 'taunt' )
        // Dispatch custom event, 'speak', with the detail { type: 'taunt'}.
        dispatchEvent( new CustomEvent( 'opponentSpeak', {
          detail: { type: 'taunt' },
        }))
      }

      this.lastMoveTime = 0
    }
  }
}

/**
 *
 * @param command
 * @param grid
 */
function updateTetromino( command, grid ) {
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

  } else if ( command === 'rotateLeft' ) {
    audioManager.play( sfx.ROTATE, 0.15 )
    grid.tetromino.rotateLeft()

  }
}
