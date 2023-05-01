import { appConfig } from '@bad-software/ld53-config'


/**
 * Return the REST endpoint for a service.
 *
 * @param {string} service The service name.
 * @returns {string} The REST endpoint.
 */
export function getServiceRoute( service ) {
  return `${appConfig.apiRoute}/${service}`
}
