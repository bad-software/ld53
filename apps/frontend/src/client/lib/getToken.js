import { client } from 'Client'


export function getToken(
  store = client.authentication.options.storage
) { return store[ 'feathers-jwt' ]}
