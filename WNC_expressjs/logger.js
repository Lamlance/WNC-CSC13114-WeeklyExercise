import { createLogger, format, transports } from "winston";
import UDPSocketLogger from "./src/logger/UDPSocketLogger.js";
import DailyRotateFile from "winston-daily-rotate-file";
import pkg from "winston-mongodb";
import { Syslog as WinstonSyslog } from "winston-syslog";

import os from "os";
const { MongoDB } = pkg;
/**
 * const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  verbose: 4,
  debug: 5,
  silly: 6
  };
*/
const papertrail = new WinstonSyslog({
  host: "logs.papertrailapp.com",
  port: 29212,
  protocol: "tls4",
  localhost: os.hostname(),
  eol: "\n",
});

const minuteTransport = new DailyRotateFile({
  filename: "./logs/%DATE%/application-%DATE%.log",
  frequency: "1m",
  datePattern: "YYYY-MM-DD-HHmm",
});

const dailyTransport = new DailyRotateFile({
  filename: "./logs/%DATE%/application-%DATE%.log",
  frequency: "d",
  datePattern: "YYYY-MM-DD",
});

const sizeTransport = new DailyRotateFile({
  filename: "./logs/%DATE%/application-%DATE%.log",
  datePattern: "YYYY-MM-DD",
  maxSize: "2k",
  maxFiles: 4,
});

const mongoTrasport = new MongoDB({
  db: "mongodb://root:root@localhost:7017/?authMechanism=DEFAULT", // mongodb uri
  level: "info",
  collection: "logs",
  options: { useUnifiedTopology: true },
  format: format.json(),
});

const logger = createLogger({
  format: format.combine(
    format(function (info, opts) {
      info["@timestamp"] = new Date().toISOString();
      return info;
    })(),
    format.json({})
    // format.metadata()
  ),
  transports: [
    //new transports.Console({ consoleWarnLevels: ["error"], level: "error" }),
    new UDPSocketLogger(),
    new transports.File({ filename: "./logs/combined.log" }),
    new transports.File({ filename: "./logs/info.log" }),
    new transports.File({ filename: "./logs/error.log", level: "error" }),
    mongoTrasport,
    sizeTransport,
    minuteTransport,
    //dailyTransport,
    papertrail,
  ],
});

export { logger as WinstonLogger };
