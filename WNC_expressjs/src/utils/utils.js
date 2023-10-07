/**
 * @template R
 * @template P
 * @param {function(P):Promise<R>} func
 * @param {P} params
 * @returns {Promise<[R|null,Error|null]>}
 */
async function CallAndCatchAsync(func, params) {
  try {
    const data = await func(params);
    return [data, null];
  } catch (e) {
    console.warn(e);
    return [null, e];
  }
}

export { CallAndCatchAsync };
