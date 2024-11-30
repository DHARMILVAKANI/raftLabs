import * as winston from 'winston';
import * as dailyRotateFile from 'winston-daily-rotate-file';
const { combine, timestamp, json } = winston.format;

/**
 * It creates a logger used for information & error tracking
 */
export const logger = winston.createLogger({
  level: 'info',
  format: combine(timestamp(), json()),
  exitOnError: false,
  transports: [
    new winston.transports.Console(),
    new dailyRotateFile({ filename: 'app-name', level: 'info' }),
  ],
  // to log unhandled errors
  exceptionHandlers: [
    new winston.transports.Console(),
    new dailyRotateFile({
      filename: 'app-name-backend-error',
      level: 'error',
      format: winston.format.errors({ stack: true }),
    }),
  ],
});

/**
 * This function is used to log and track the third party API calls
 * @param message
 * @param data
 * @param thirdPartyPlatformName
 * @param isError
 */
export const thirdPartyLogger = (
  message: string,
  data: object,
  thirdPartyPlatformName: string,
  isError?: boolean,
) => {
  data = { ...data, thirdParty: thirdPartyPlatformName };
  const logLevel = isError ? 'error' : 'info';
  logger.log(logLevel, message, data);
};
