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
    return [null, e];
  }
}
const flattenJSON = (obj = {}, res = {}, extraKey = "") => {
  for (const key in obj) {
    if (typeof obj[key] !== "object") {
      res[extraKey + key] = obj[key];
    } else {
      flattenJSON(obj[key], res, `${extraKey}${key}.`);
    }
  }
  return res;
};
export { CallAndCatchAsync, flattenJSON };
