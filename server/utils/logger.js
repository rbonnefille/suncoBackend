import winston from "winston";
import path from "path";
import morgan from "morgan";

const serverDir = path.join(process.cwd());

const { combine, timestamp, json } = winston.format;

const logger = winston.createLogger({
  level: "http",
  format: combine(
    timestamp({
      format: "YYYY-MM-DD hh:mm:ss.SSS A",
    }),
    json(),
  ),
  transports: [
    new winston.transports.File({
      filename: path.join(serverDir, "./logs/events.log"),
      level: "http",
    }),
    // new winston.transports.Console({
    //   level: "http",
    // }),
  ],
});

const loggerMiddleware = morgan(
  function (tokens, req, res) {
    return JSON.stringify({
      url: tokens.url(req, res),
      method: tokens.method(req, res),
      status: Number.parseFloat(tokens.status(req, res)),
      response_time: Number.parseFloat(tokens["response-time"](req, res)),
      body: req.body,
    });
  },
  {
    stream: {
      write: (message) => {
        const data = JSON.parse(message);
        logger.http(`incoming-req`, data);
      },
    },
  },
);

export default loggerMiddleware;
