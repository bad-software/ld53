const
  shapes = [
    [[1, 1, 1], [0, 1, 0]], // T
    [[1, 1], [1, 1]], // O
    [[1, 1, 0], [0, 1, 1]], // Z
    [[0, 1, 1], [1, 1, 0]], // S
    [[1, 1, 1, 1]], // I
    [[1, 1, 1], [1, 0, 0]], // L
    [[1, 1, 1], [0, 0, 1]], // J
  ],

  colors = [
    'cyan',
    'yellow',
    'red',
    'green',
    'blue',
    'orange',
    'purple',
  ]

export class Tetromino {
  constructor( grid ) {
    const typeId = Math.floor( Math.random() * shapes.length )
    this.grid = grid
    this.shape = shapes[typeId]
    this.color = colors[ Math.floor( Math.random() * colors.length )]
    this.x = Math.floor( Math.random() * ( 10 - this.shape[0].length ))
    this.y = -this.shape.length + 1

    const rotationCount = Math.floor( Math.random() * 4 )

    // Randomly rotate the tetromino.
    for ( let i = 0; i < rotationCount; i++ ) {
      this.rotateLeft()
    }
  }

  rotateLeft() {
    const prevShape = this.shape
    this.shape = this.shape[0].map(( _, i ) =>
      this.shape.map(( row ) => row[i])
    ).reverse()

    if ( this.grid.collide( this )) {
      this.shape = prevShape
    }
  }

  move( x, y ) {
    this.x += x
    this.y += y
  }

  // Check if the tetromino can move to the specified position
  canMove( x, y, rotation = null ) {
    const newX = this.x + x
    const newY = this.y + y

    let newShape = this.shape

    if ( rotation !== null ) {
      const originalShape = this.shape
      for ( let r = 0; r < rotation; r++ ) {
        this.rotateLeft()
      }
      newShape = this.shape
      this.shape = originalShape
    }

    return !this.grid.collide({
      shape: newShape,
      x: newX,
      y: newY,
    })
  }

  // Rotate the tetromino by a specified number of times
  rotate( times ) {
    for ( let i = 0; i < times; i++ ) {
      this.rotateLeft()
    }
  }

  // Clone the tetromino
  clone() {
    const cloned = new Tetromino( this.grid )
    cloned.shape = this.shape.map( row => row.slice())
    cloned.color = this.color
    cloned.x = this.x
    cloned.y = this.y
    return cloned
  }
}

