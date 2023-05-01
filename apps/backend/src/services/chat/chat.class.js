import fs from 'fs'


export class ChatService {
  endpoint = 'https://api.openai.com/v1/chat/completions'

  constructor( options ) {
    this.options = options
  }

  async find( _params ) {
    return []
  }

  async get( id, _params ) {
    return {
      id: 0,
      text: 'hi',
    }
  }

  async create( data, params ) {
    if ( Array.isArray( data )) {
      return Promise.all( data.map(( current ) => this.create( current, params )))
    }

    const
      { messages } = data,
      systemMessage = {
        role: 'system',
        content: ``,
      },

      // Create an abort controller to cancel the request if the client
      // disconnects.
      abortController = new AbortController(),

      // Query GPT for a response.
      response = await fetch( `${this.endpoint}`, {
        method: 'POST',

        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },

        body: JSON.stringify({
          // TODO: Prune messages to fit within the token limit without
          //  dropping the system message.
          messages: [
            systemMessage,
            ...messages.map(( message ) => ({
              role: message.role,
              content: message.content,
            })),
          ],
          model: 'gpt-4',
          stream: true,
        }),

        signal: abortController.signal,
      })

    // Return errors.
    if ( !response.ok ) {
      const error = await response.json()
      throw new Error( error.error )
    }

    // Ensure there is a response body.
    if ( !response.body )
      throw new Error( 'No response body' )


    console.log( 'response', response.body )

    // Get reader and writer.
    const readStream = response.body

      /*transformStream = new TransformStream({
        transform( chunk, controller ) {
          console.log( 'chunk', chunk )
          const delta = decodeResponse( chunk )

          if ( delta ) {
            console.log( 'delta', delta )
            controller.enqueue( delta )
          }
        }
      }),*/

      // stream = transformStream.readable

    // Pipe the response to the transform stream.
    // readStream.pipeTo( transformStream.writable )

    /*async function read() {
      const { done, value } = await reader.read()

      if ( done )
        return stream.end()

      const delta = decodeResponse( value )

      if ( delta ) {
        stream.write( delta )
      }

      await read()
    }*/

    // await read()
    // stream.end()

    return readStream
  }

  // This method has to be added to the 'methods' option to make it available to clients
  async update( id, data, _params ) {
    return {
      id: 0,
      ...data,
    }
  }

  async patch( id, data, _params ) {
    return {
      id: 0,
      text: `Fallback for ${id}`,
      ...data,
    }
  }

  async remove( id, _params ) {
    return {
      id: 0,
      text: 'removed',
    }
  }
}

export const getOptions = app => {
  return { app }
}


const utf8Decoder = new TextDecoder( 'utf-8' )


/**
 * Decode the response from the OpenAI API.
 *
 * @param {Uint8Array} response The response from the OpenAI API.
 * @returns {string} The decoded response.
 */
function decodeResponse( response ) {
  if ( !response ) {
    return ''
  }

  const pattern = /"delta":\s*({.*?"content":\s*".*?"})/g
  const decodedText = utf8Decoder.decode( response )
  const matches = []

  let match
  while (( match = pattern.exec( decodedText )) !== null ) {
    matches.push( JSON.parse( match[1]).content )
  }

  return matches.join( '' )
}
