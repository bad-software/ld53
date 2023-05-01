import { MD5 } from 'crypto-js'

// Gravatar URL prefix
const gravatarUrl = 'https://s.gravatar.com/avatar'

/**
 * Construct URL for avatar using gravatar API.
 */
export function getDefaultAvatar( str, {
  size = 100,
  type = 'retro'
} = {}) {
  const
    // Build an MD5 hash from the provide string.
    hash = MD5( str.trim().toLowerCase()),

    // Build query from options
    query = `s=${ size }?&d=${ type }`

  // Return url
  return `${ gravatarUrl }/${ hash }?${ query }`
}
