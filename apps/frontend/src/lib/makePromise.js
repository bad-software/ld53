

/** Make a promise that can be resolved at a later time. */
export function makePromise() {
  let reject, resolve

  //eslint-disable-next-line promise/param-names
  const promise = new Promise(( res, rej ) => {
    reject = rej
    resolve = res
  })

  //noinspection JSUnusedAssignment
  return { promise, reject, resolve }
}
