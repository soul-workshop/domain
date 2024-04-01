import { JwtVerifyErrors } from 'rilata/src/app/jwt/jwt-errors';
import { ActionParams } from 'rilata/src/domain/domain-data/params-types';
import { RefreshTokenIsExpiredError } from '../aggregate-errors';

export type UserRefreshDomainQuery = {
  refreshToken: string,
};

export type UserRefreshDomainOut = string; // access token

export type UserRefreshActionParams = ActionParams<
  UserRefreshDomainQuery,
  UserRefreshDomainOut,
  RefreshTokenIsExpiredError | JwtVerifyErrors,
  never
>
