import { createLogger, format, transports } from "winston";
import UDPSocketLogger from "./src/logger/UDPSocketLogger.js";
import DailyRotateFile from "winston-daily-rotate-file";
import pkg from "winston-mongodb";
import { Syslog as WinstonSyslog } from "winston-syslog";

import os from "os";
const { MongoDB } = pkg;
import "winston-syslog";
import os from "os";

// const papertrail = new transports.Syslog({
//   host: 'logs4.papertrailapp.com',
//   port: 16512,
//   protocol: 'tls4',
//   localhost: os.hostname(),
//   eol: '\n',
// });
// const minuteTransport = new DailyRotateFile({
//   filename: "./logs/%DATE%/application-%DATE%.log",
//   frequency: "m",
//   datePattern: "YYYY-MM-DD-HH-mm",
// });

// const dailyTransport = new DailyRotateFile({
//   filename: "./logs/%DATE%/application-%DATE%.log",
//   frequency: "d",
//   datePattern: "YYYY-MM-DD",
// });

// const sizeTransport = new DailyRotateFile({
//   filename: "./logs/%DATE%/application-%DATE%.log",
//   datePattern: "YYYY-MM-DD",
//   maxSize: "2k",
//   maxFiles: 4,
// });

// const mongoTrasport = new MongoDB({
//   db: "mongodb://root:root@localhost:7017/?authMechanism=DEFAULT", // mongodb uri
//   level: "info",
//   collection: "logs",
//   options: { useUnifiedTopology: true },
//   format: format.json(),
// });
const logger = createLogger({
  format: format.combine(format.json()),
  transports: [
    new transports.Console({ consoleWarnLevels: ["error"], level: "error" }),
    // new transports.File({ filename: "./logs/error.log", level: "error" }),
    // new transports.File({ filename: "./logs/combined.log" }),
    // new DailyRotateFile({
    //   filename: "./logs/%DATE%/application-%DATE%.log",
    //   datePattern: "YYYY-MM-DD",
    //   zippedArchive: true,
    //   maxSize: "2m",
    //   maxFiles: "14d",
    // }),
    // new MongoDB({
    //   db: "mongodb+srv://", // mongodb uri
    //   level: "info",
    //   collection: "logs",
    //   options: { useUnifiedTopology: true },
    // }),
    // minuteTransport,
    // dailyTransport,
    // papertrail,
  ],
});
export { logger as WinstonLogger };
