const endpoint = 'https://api.openai.com/v1/chat/completions'


export class TextGenerationsService {
  constructor( options ) {
    this.options = options
  }

  async find( _params ) {
    return []
  }

  async get( id, _params ) {
    return {
      id: 0,
      text: `A new message with ID: ${id}!`
    }
  }
  async create( data, params ) {
    if ( Array.isArray( data )) {
      return Promise.all( data.map(( current ) => this.create( current, params )))
    }

    const response = await getResponse( data )

    return response
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


/**
 *
 */
async function getResponse( data ) {
  const
    systemMessage = {
      role: 'system',
      content: prompts[ data.type ]( data ),
    },

    // Create an abort controller to cancel the request if the client
    // disconnects.
    abortController = new AbortController(),

    // Query GPT for a response.
    response = await fetch( `${endpoint}`, {
      method: 'POST',

      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },

      body: JSON.stringify({
        // TODO: Prune messages to fit within the token limit without
        //  dropping the system message.
        messages: [ systemMessage ],
        model: 'gpt-3.5-turbo',
        // stream: true,
      }),

      signal: abortController.signal,
    })

  // Return errors.
  if ( !response.ok ) {
    const error = await response.json()
    throw new Error( JSON.stringify( error.error ))
  }

  // Ensure there is a response body.
  if ( !response.body )
    throw new Error( 'No response body' )

  const result = await response.json()

  console.log( 'Text generation:', result.choices[ 0 ].message.content )

  return result.choices[ 0 ].message.content
}


const taunt = data => `${prefix} Your
next message taunts the player in a friendly and competitive manner. You may
or may not use the provided context to help guide your message.

The player's name is "${data.player.name}"

The current score is:
Player: ${data.player.score}
You: ${data.opponent.score}
`

const lose = data => `${prefix} Your next message is a response to the player
winning the game. You may or may not use the provided context to help guide
your message.

The player's name is "${data.player.name}"

The current score is:
Player: ${data.player.score}
You: ${data.opponent.score}
`


const win = data => `${prefix} Your next message is a response to the player
losing the game. You may or may not use the provided context to help guide
your message.

The player's name is "${data.player.name}"

The current score is:
Player: ${data.player.score}
You: ${data.opponent.score}
`


const receivedGarbageBlock = data => `${prefix} Your next message is a
response to the player sending you a garbage block. You may or may not use the
provided context to help guide your message.

The player's name is "${data.player.name}"

The current score is:
Player: ${data.player.score}
You: ${data.opponent.score}
`


const prompts = {
  taunt,
  lose,
  win,
  receivedGarbageBlock,
}

const prefix = 'You are an AI playing Tetris. You love tetris. ' +
  'You are playing against a human. You are trying to win. ' +
  'You keep your responses very short but signify excitement using ' +
  'capitalized words and exclamation points. You address the human by their ' +
  'name if it is easy to pronounce, but don\'t just call them "human" or ' +
  '"player". Never, ever, ever use the word "Tetris". This game is Parcel Panic.'
