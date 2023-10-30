import { createLogger, format, transports } from "winston";
import RabbitMQLogger from "./src/logger/RabbitMQLogger.js";
import UDPSocketLogger from "./src/logger/UDPSocketLogger.js";

const logger = createLogger({
  level: "debug",
  format: format.combine(
    format(function (info, opts) {
      info.create_date = new Date().toUTCString();
      return info;
    })(),
    format.json()
  ),
  transports: [
    //new transports.Console({ consoleWarnLevels: ["error"], level: "error" }),
    new transports.File({ filename: "./logs/error.log", level: "error" }),
    new UDPSocketLogger(),
    // new RabbitMQLogger({ level: "error" }),
  ],
});

export { logger as WinstonLogger };
