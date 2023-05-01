import { audioManager, sfx } from 'Models'
import { Tetromino } from './Tetromino'


// Adjust to fit canvas size.
const BLOCK_SIZE = 30
const ROW_COLORS = ['red', 'blue', 'green', 'yellow', 'orange', 'purple', 'cyan']


export class Grid {
  game = null
  nextTetromino = null
  player = ''
  tetromino = null
  height = 0
  width = 0

  constructor( game, player, width = 10, height = 20 ) {
    this.game = game
    this.player = player
    this.width = width
    this.height = height
    this.rowColors = createRowColors( this.height )
    this.init()
  }

  get isGameOver() {
    // Check if any cell in the top row is filled
    return this.matrix[0].some(( cell ) => cell !== 0 )
  }

  addGarbage( rowCount ) {
    // Create a garbage row for each requested row
    for ( let i = 0; i < rowCount; i++ ) {
      const garbageRow = new Array( this.width ).fill( 0 )

      // Generate a random hole index in the garbage row
      const holeIndex = Math.floor( Math.random() * this.width )

      // Fill the garbage row with random colors, leaving one hole
      for ( let j = 0; j < this.width; j++ ) {
        if ( j !== holeIndex ) {
          garbageRow[j] = ROW_COLORS[
            Math.floor( Math.random() * ROW_COLORS.length )
          ]
        }
      }

      // Remove the top row and push the garbage row to the bottom
      this.matrix.shift()
      this.matrix.push( garbageRow )

      // Shift row colors
      this.rowColors.shift()
      this.rowColors.push(
        ROW_COLORS[
          Math.floor( Math.random() * ROW_COLORS.length )
        ]
      )
    }
  }

  clearLines() {
    let linesCleared = 0

    for ( let y = this.height - 1; y >= 0; y-- ) {
      const isLineFull = this.matrix[y].every(( cell ) => cell !== 0 )

      if ( isLineFull ) {
        const sameColorCount = this.matrix[y]
          .filter( cell => cell === this.rowColors[y])
          .length

        if ( sameColorCount >= 5 ) {
          const deliveryEvent = new CustomEvent(
            'deliveryComplete',
            {
              detail: {
                color: this.rowColors[y],
                count: sameColorCount,
                player: this.player,
                row: y,
              }
            }
          )

          dispatchEvent( deliveryEvent )

          // Reset the row color.
          this.rowColors[y] = ROW_COLORS[
            Math.floor( Math.random() * ROW_COLORS.length )
          ]
        }
        this.matrix.splice( y, 1 )
        this.matrix.unshift( new Array( this.width ).fill( 0 ))
        linesCleared++
        y++ // Recheck the same row index since the lines shifted down
      }
    }

    if ( linesCleared > 0 ) {
      const linesClearedEvent = new CustomEvent(
        'linesCleared',
        {
          detail: {
            count: linesCleared,
            player: this.player,
          }
        }
      )

      dispatchEvent( linesClearedEvent )

      console.log( `Cleared ${linesCleared} line${
        linesCleared > 1 ? 's' : ''
      }` )
    }

    return linesCleared
  }

  clone() {
    const cloned = new Grid( this.game, this.player, this.width, this.height )
    cloned.matrix = this.matrix.map( row => [...row])
    cloned.tetromino = this.tetromino.clone()
    cloned.nextTetromino = this.nextTetromino.clone()
    return cloned
  }


  collide( tetromino ) {
    for ( let y = 0; y < tetromino.shape.length; y++ ) {
      for ( let x = 0; x < tetromino.shape[y].length; x++ ) {
        if ( tetromino.shape[y][x]) {
          const
            newY = tetromino.y + y,
            newX = tetromino.x + x

          // If we're outside the grid, we're colliding.
          if (
            newY < 0 ||
            newY >= this.height ||
            newX < 0 ||
            newX >= this.width
          ) {
            return 'wall'
          }

          // If the cell we're moving to isn't empty, we're colliding.
          if ( this.matrix[newY] && this.matrix[newY][newX] !== 0 ) {
            return 'block'
          }
        }
      }
    }
    return false // Move this line outside the loops
  }

  draw() {
    this.drawBackground()
    this.drawRowColors()
    this.drawMatrix()
    this.drawTetromino( this.tetromino )
    this.drawNextTetromino( this.nextTetromino )

    // Draw the 8-pixel column gap between the tetromino and the grid
    this.ctx.fillStyle = 'white'
    this.ctx.fillRect(
      ( this.width + 1 ) * BLOCK_SIZE,
      0,
      8,
      this.height * BLOCK_SIZE
    )

    // Draw the wall between the row colors and the grid
    this.ctx.fillStyle = 'black'
    this.ctx.fillRect(
      BLOCK_SIZE - 2,
      0,
      2,
      this.height * BLOCK_SIZE
    )
  }

  drawBackground() {
    this.ctx.fillStyle = 'black'
    this.ctx.fillRect(
      0,
      0,
      ( this.width + 1 ) * BLOCK_SIZE,
      this.height * BLOCK_SIZE
    )
  }

  drawMatrix() {
    for ( let y = 0; y < this.height; y++ ) {
      for ( let x = 0; x < this.width; x++ ) {
        const color = this.matrix[y][x]
        if ( color ) {
          this.ctx.fillStyle = color
          this.ctx.fillRect(
            ( x + 1 ) * BLOCK_SIZE + 2,
            y * BLOCK_SIZE + 2,
            BLOCK_SIZE - 4,
            BLOCK_SIZE - 4
          )
        }
      }
    }
  }

  drawNextTetromino() {
    // Clear the next tetromino area
    this.ctx.fillStyle = 'black'
    this.ctx.fillRect(
      ( this.width + 1 ) * BLOCK_SIZE + 8,
      0,
      6 * BLOCK_SIZE,
      4 * BLOCK_SIZE
    )

    this.ctx.fillStyle = this.nextTetromino.color
    for ( let y = 0; y < this.nextTetromino.shape.length; y++ ) {
      for ( let x = 0; x < this.nextTetromino.shape[y].length; x++ ) {
        if ( this.nextTetromino.shape[y][x]) {
          this.ctx.fillRect(
            ( this.width + 1 ) * BLOCK_SIZE + 8 + x * BLOCK_SIZE + 2,
            y * BLOCK_SIZE + 2,
            BLOCK_SIZE - 4,
            BLOCK_SIZE - 4
          )
        }
      }
    }
  }

  drawRowColors() {
    for ( let y = 0; y < this.height; y++ ) {
      // this.ctx.fillStyle = '#000'
      // this.ctx.fillRect( 0, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE )
      this.ctx.fillStyle = this.rowColors[y]
      this.ctx.fillRect(
        4,
        y * BLOCK_SIZE + 2,
        BLOCK_SIZE - 4,
        BLOCK_SIZE - 4 ,
      )
    }
  }

  drawTetromino( tetromino ) {
    this.ctx.fillStyle = tetromino.color
    for ( let y = 0; y < tetromino.shape.length; y++ ) {
      for ( let x = 0; x < tetromino.shape[y].length; x++ ) {
        if ( tetromino.shape[y][x]) {
          this.ctx.fillRect(( tetromino.x + x + 1 ) * BLOCK_SIZE + 2, ( tetromino.y + y ) * BLOCK_SIZE + 2, BLOCK_SIZE - 4, BLOCK_SIZE - 4 )
        }
      }
    }
  }


  getMaxHeight() {
    // Find the highest row with a block in it
    for (let y = this.height - 1; y >= 0; y--) {
      for (let x = 0; x < this.width; x++) {
        if (this.matrix[y][x] !== 0) {
          return this.height - y - 1
        }
      }
    }
    return 0 // if grid is empty, return 0
  }

  getNumberOfHoles() {
    let holes = 0
    // Count the number of empty cells below a filled cell in each column
    for ( let x = 0; x < this.width; x++ ) {
      let blockFound = false
      for ( let y = this.height - 1; y >= 0; y-- ) {
        if ( this.matrix[y][x] !== 0 ) {
          blockFound = true
        } else if ( blockFound ) {
          holes++
        }
      }
    }
    return holes
  }

  hardDropTetromino() {
    // Move down.
    while ( !this.collide( this.tetromino, 0, 1 )) {
      this.tetromino.move( 0, 1 )
    }

    // Ensure the tetromino is in the right place.
    this.tetromino.move( 0, -1 )

    // Merge.
    return this.merge( this.tetromino )
  }


  init() {
    this.matrix = createMatrix( this.width, this.height )
    this.rowColors = createRowColors( this.height )
    this.tetromino = new Tetromino( this )
    this.nextTetromino = new Tetromino( this )
  }

  merge( tetromino ) {
    audioManager.play( sfx.CLICK, 0.6 )

    tetromino.shape.forEach(( row, y ) => {
      row.forEach(( value, x ) => {
        if ( value ) {
          if ( this.matrix[tetromino.y + y]) {
            this.matrix[tetromino.y + y][tetromino.x + x] = tetromino.color
          } else {
            if ( this.isGameOver ) {
              console.warn( 'Game over!' )
              this.game.lose( this.player )
            }
          }
        }
      })
    })

    const clearedLines = this.clearLines()

    this.tetromino = this.nextTetromino
    this.nextTetromino = new Tetromino( this )

    return { clearedLines }
  }

  safelyMoveTetromino( x, y ) {
    // HACK!
    // This is a hack to prevent the tetromino from moving when the game
    // is over.
    if ( this.game.isRunning === false ) return
    if ( !this.tetromino ) return

    // Store the previous position of the tetromino.
    const prevX = this.tetromino.x
    const prevY = this.tetromino.y

    // Move tetromino.
    this.tetromino.move( x, y )

    // Check for collisions.
    const collisionType = this.collide( this.tetromino )

    if ( collisionType ) {
      // If the collision is with a wall, move tetromino back horizontally.
      if ( collisionType === 'wall' ) {
        this.tetromino.move( prevX - this.tetromino.x, 0 )
      }
      // If the collision is with a block while moving horizontally,
      // move tetromino back horizontally.
      else if ( collisionType === 'block' && x !== 0 ) {
        this.tetromino.move( prevX - this.tetromino.x, 0 )
      }
    }

    // Handle bottom and block collisions when moving down.
    if ( y > 0 ) {
      // Check if tetromino is colliding with the bottom.
      const isCollidingWithBottom =
        this.tetromino.y + this.tetromino.shape.length > this.height

      // Check if tetromino is colliding with a block or the bottom.
      if ( collisionType === 'block' || isCollidingWithBottom ) {
        // Move tetromino back up and merge it into the grid.
        this.tetromino.move( 0, prevY - this.tetromino.y )
        this.merge( this.tetromino )
        this.tetromino = new Tetromino( this )

        if ( this.isGameOver ) {
          console.warn( 'Game over!' )
          this.game.lose( this.player )
          // this.init()
        }
      }
    }
  }

  setCanvas( canvas ) {
    this.ctx = canvas.getContext( '2d' )
  }

  update() {
    if ( this.tetromino ) {
      // Move tetromino down.
      try {
        this.tetromino.move( 0, 1 )

        // Did we collide?
        if ( this.collide( this.tetromino )) {
          // Move tetromino back up.
          this.tetromino.move( 0, -1 )

          // Merge tetromino into grid.
          this.merge( this.tetromino )
          this.tetromino = new Tetromino( this )
        }
      } catch ( e ) {
        // If moving fails, it's game over.
        console.warn( 'Game over!' )

        // this.tetromino = null
        // Reset grid.
        this.init()
      }
    }
  }
}


/**
 *
 * @param width
 * @param height
 */
function createMatrix( width, height ) {
  return new Array( height )
    .fill( 0 )
    .map(() =>
      new Array( width ).fill( 0 )
    )
}

/**
 *
 * @param height
 */
function createRowColors( height ) {
  return new Array( height )
    .fill( 0 )
    .map(() =>
      // ROW_COLORS[0]
      ROW_COLORS[Math.floor( Math.random() * ROW_COLORS.length )]
    )
}
