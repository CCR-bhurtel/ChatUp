import winston from "winston";

const levels = {
  error: 0,
  warn: 1,
  http: 2,
  info: 3,
  debug: 4,
};

const colors = {
  error: "red",
  warn: "yellow",
  http: "blue",
  info: "magenta",
  debug: "blue",
};

winston.addColors(colors);

const level = () => {
  return process.env.NODE_ENV === "production" ? "warn" : "debug";
};

const consoleFormat = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss:ms" }),
  winston.format.colorize({ all: true }),
  winston.format.printf(
    (info) => `${info.timestamp} ${info.level}: ${info.message}`
  )
);

const fileFormat = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss:ms" }),
  winston.format.json()
);

const transports = [
  new winston.transports.Console({
    level: level(),
    format: consoleFormat,
  }),
  new winston.transports.File({
    filename: "logs/error.log",
    level: "error",
    format: fileFormat,
  }),
  new winston.transports.File({
    filename: "logs/http.log",
    level: "http",
    format: fileFormat,
  }),
  new winston.transports.File({
    filename: "logs/info.log",
    level: "info",
    format: fileFormat,
  }),
];

const logger = winston.createLogger({
  level: level(),
  levels,
  transports,
});

export default logger;
