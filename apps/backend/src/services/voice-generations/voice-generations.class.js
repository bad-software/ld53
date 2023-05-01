// This is a skeleton for a custom service class. Remove or add the methods you need here
import {arrayBuffer} from "stream/consumers";

export class VoiceGenerationsService {
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
      return Promise.all( data.map( current =>
        this.create( current, params ))
      )
    }

    const voiceIDResponse = await fetch( 'https://api.elevenlabs.io/v1/voices', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'xi-api-key': process.env.ELEVENLABS_API_KEY,
      }
    }).then( res => res.json())

    const voiceId = voiceIDResponse.voices[ 0 ].voice_id

    // request the audio stream

    const baseUrl = 'https://api.elevenlabs.io/v1/text-to-speech'
    const options = {
      text: data.text,
      voice_settings: {
        stability: 0,
        similarity_boost: 0,
      },
    }
    // read fetch stream
    const res = await fetch( `${baseUrl}/${voiceId}`, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': process.env.ELEVENLABS_API_KEY,
      },
      body: JSON.stringify( options ),
    })

    // Get the audio.
    const musicData = await res.arrayBuffer()

    return {
      data: musicData,
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
