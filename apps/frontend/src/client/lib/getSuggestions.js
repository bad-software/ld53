import api from 'Api'
import { client } from 'Client'


export async function getSuggestions( query ) {
  //let results

  const
    // TODO: Whitelist/populate fields on server instead of client.

    // Message suggestions.
    /*messageSuggest = {
      text: query,
      guild: {
        completion: {
          field: 'guildName.suggest',
          fuzzy: { fuzziness: 2 },
          skip_duplicates: true,
        },
      },

      channel: {
        completion: {
          field: 'channelName.suggest',
          fuzzy: { fuzziness: 2 },
          skip_duplicates: true,
        },
      },

      user: {
        completion: {
          field: 'authorName.suggest',
          fuzzy: { fuzziness: 2 },
          skip_duplicates: true,
        },
      },
    },*/

    tagSuggestions = query
      ? await client
        .service( api.tags )
        .find({ query: { $search: query }})
      : { data: []}

  // Get message suggestions.
  // TODO: Cache requests.
  // TODO: Use guilds store instead of polling messages.
  /*results = await client
    .service( api.messages )
    .find({ query: { $suggest: messageSuggest, q: '' } })
    || { data: {}, total: {}}*/

  return {
    data: {
      /*channel: results.data.channel[0].options
        .map( x => ({
          id: x._source.channelID,
          name: x._source.channelName,
        })),*/

      /*guild: results.data.guild[0].options
        .map( x => ({
          id: x._source.guildID,
          name: x._source.guildName,
          avatar: x._source.guildIconURL,
        })),*/

      tag: tagSuggestions.data
        .map( x => ({
          id: x.id,
          name: x.name,
        })),

      /*user: results.data.user[0].options
        .map( x => ({
          id: x._source.authorID,
          name: x._source.authorName,
          avatar: x._source.authorAvatarURL,
        })),*/
    },

    //total: results.total,
    total: tagSuggestions.total,
  }
}
