import mainMusic from 'Assets/music/main.mp3'
import menuMusic from 'Assets/music/menu.mp3'
import click from 'Assets/sfx/click.mp3'
import delivery from 'Assets/sfx/delivery.mp3'
import gameOver from 'Assets/sfx/game-over.mp3'
import garbage from 'Assets/sfx/garbage.mp3'
import move from 'Assets/sfx/move.mp3'
import restart from 'Assets/sfx/restart.mp3'
import rotate from 'Assets/sfx/rotate.mp3'
import win from 'Assets/sfx/win.mp3'


export class AudioManager {
  speechContext = new AudioContext()
  speechGain = this.speechContext.createGain()

  constructor() {
    this.sounds = {}
    this.soundIds = 0

    // Configure speech context and increase gain.
    this.speechGain.connect( this.speechContext.destination )
    this.speechGain.gain.value = 3.4
  }

  add( src, loop = false ) {
    const id = this.soundIds++
    const audio = new Audio( src )
    this.sounds[id] = audio

    // Loop audio if requested.
    if ( loop ) {
      audio.addEventListener( 'ended', () =>
        loopAudio( audio )
      )
    }

    return id
  }

  decode( src ) {
    return new Promise(( resolve, reject ) => {
      this.context.decodeAudioData( src, resolve, reject )
    })
  }

  destroy() {
    Object.values( this.sounds ).forEach(( audio ) => {
      audio.pause()
      audio.src = ''
      audio.onended = null
    })
  }

  get( id ) {
    return this.sounds[id]
  }

  isPlaying( id ) {
    const audio = this.sounds[id]
    return audio && !audio.paused
  }

  play( id, volume = 0.9 ) {
    const audio = this.sounds[id]

    if ( audio ) {
      audio.volume = volume
      audio.currentTime = 0
      audio.play()
    }
  }

  pause( id ) {
    const audio = this.sounds[id]

    if ( audio ) {
      audio.pause()
    }
  }

  remove( id ) {
    const audio = this.sounds[id]

    if ( audio ) {
      delete this.sounds[id]
      audio.pause()
    }
  }

  async speak( arrayBuffer ) {
    // Use speechContext.

    // Create a new source from the blob.
    const source = this.speechContext.createBufferSource()
    source.buffer = await this.speechContext.decodeAudioData( arrayBuffer )

    // Connect to gain and play.
    source.connect( this.speechGain )
    source.start()
  }

  setVolume( id, volume ) {
    const audio = this.sounds[id]

    if ( audio ) {
      audio.volume = volume
    }
  }

  stopAll() {
    Object.values( this.sounds ).forEach(( audio ) => {
      audio.pause()
      audio.currentTime = 0
    })
  }

  stop( id ) {
    const audio = this.sounds[id]

    if ( audio ) {
      audio.pause()
      audio.currentTime = 0
    }
  }
}


export const
  audioManager = new AudioManager(),

  music = {
    MAIN_MUSIC: audioManager.add( mainMusic, true ),
    MENU_MUSIC: audioManager.add( menuMusic, true )
  },

  sfx = {
    CLICK: audioManager.add( click ),
    DELIVERY: audioManager.add( delivery ),
    LOSE: audioManager.add( gameOver ),
    GARBAGE: audioManager.add( garbage ),
    MOVE: audioManager.add( move ),
    RESTART: audioManager.add( restart ),
    ROTATE: audioManager.add( rotate ),
    WIN: audioManager.add( win ),
  }

/**
 *
 * @param audio
 */
function loopAudio( audio ) {
  audio.currentTime = 0
  audio.play()
}
