import { WinstonLogger } from "../../logger.js";

const logMiddleware = (req, res, next) => {
  const logObject = {
    method: req.method,
    url: req.originalUrl,
    query: req.query,
    body: req.body,
    headers: req.headers,
    timestamp: new Date().toISOString(),
  };

  //request details 
  WinstonLogger.debug(`Request Debug: ${JSON.stringify(logObject)}`);
  WinstonLogger.info(`Request Info: ${JSON.stringify(logObject)}`);
  WinstonLogger.warn(`Request Warning: ${JSON.stringify(logObject)}`);
  WinstonLogger.error(`Request Error: ${JSON.stringify(logObject)}`);

  const oldSend = res.send;
  res.send = function (data) {
    logObject.response = data;
    logObject.statusCode = res.statusCode;

    // Log the response details 
    WinstonLogger.debug(`Response Debug: ${JSON.stringify(logObject)}`);
    WinstonLogger.info(`Response Info: ${JSON.stringify(logObject)}`);
    WinstonLogger.warn(`Response Warning: ${JSON.stringify(logObject)}`);
    WinstonLogger.error(`Response Error: ${JSON.stringify(logObject)}`);

    oldSend.apply(res, arguments);
  };

  next();
};

export default logMiddleware;
