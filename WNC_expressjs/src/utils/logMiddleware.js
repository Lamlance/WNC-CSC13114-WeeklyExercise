import { WinstonLogger } from "../../logger.js";
import { flattenJSON } from "./utils.js";

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
function logMiddleware(req, res, next) {
  //request details
  //WinstonLogger.info(`Request Info: ${JSON.stringify(logObject)}`);

  const oldSend = res.send;
  res.send = function (data) {
    const logObject = {
      method: req.method,
      url: req.originalUrl,
      status_code: res.statusCode,
    };

    if (!res.locals.error) {
      WinstonLogger.info(logObject);
    } else {
      logObject.error = res.locals.error;
      WinstonLogger.error(logObject);
    }
    oldSend.apply(res, arguments);
  };

  next();
}

export default logMiddleware;
