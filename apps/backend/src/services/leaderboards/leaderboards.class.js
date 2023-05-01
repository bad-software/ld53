import { app } from '#App'


export class LeaderboardsService {
  constructor( options ) {
    this.options = options
  }

  async find( _params ) {
    return []
  }

  async get( id, _params ) {
    // Find top ten users by high scores,
    // and return their names + high scores.
    const topScores = await app
      .service( 'users' )
      .find({
        query: {
          $limit: 10,
          $sort: {
            highScore: -1,
          },
        }
      })
      .then(({ data }) => data.map( record => {
        const { username, highScore } = record
        return { username, highScore }
      }))

    return {
      id: 0,
      topScores,
    }
  }
  async create( data, params ) {
    if ( Array.isArray( data )) {
      return Promise.all( data.map(( current ) => this.create( current, params )))
    }

    return {
      id: 0,
      ...data
    }
  }

  // This method has to be added to the 'methods' option to make it available to clients
  async update( id, data, _params ) {
    return {
      id: 0,
      ...data
    }
  }

  async patch( id, data, _params ) {
    return {
      id: 0,
      text: `Fallback for ${id}`,
      ...data
    }
  }

  async remove( id, _params ) {
    return {
      id: 0,
      text: 'removed'
    }
  }
}

export const getOptions = ( app ) => {
  return { app }
}
