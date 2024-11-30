import { sign, verify } from 'jsonwebtoken';
import { logger } from './service-logger';
import { envConfig } from '../config/env.config';
import { errorMessages } from '../common/error.messages';
import { ITokenPayload } from '../common/interfaces/token.payload.interface';

/**
 *This function is used to generate token for user session
 * @param data object with user details
 * @returns access token and refresh token
 */
export function createToken(data: ITokenPayload, onlyAccessRequired?: boolean) {
  try {
    const accessExp = envConfig.app.accessExpTime;
    const secretKey = envConfig.app.secret;
    const accessToken = sign(data, secretKey, { expiresIn: accessExp });
    if (onlyAccessRequired) return { accessToken };
    const refreshExp = envConfig.app.refreshExpTime;
    const refreshToken = sign(data, secretKey, { expiresIn: refreshExp });
    return {
      accessToken,
      refreshToken,
    };
  } catch (error) {
    logger.error('Error in CreateToken', error);
  }
}

/**
 * this function is used to verify if user token is valid or expired
 * @param token token to verify
 * @returns returns a promise which says if token is valid or not
 */
export function verifyToken(token: string): Promise<any> {
  const secretKey = envConfig.app.secret;
  return new Promise((resolve) => {
    verify(token, secretKey, (error, verifiedJwt) => {
      if (error) {
        return resolve({ error: errorMessages.SESSION_EXPIRED, data: null });
      }
      return resolve({ error: null, data: verifiedJwt });
    });
  });
}
