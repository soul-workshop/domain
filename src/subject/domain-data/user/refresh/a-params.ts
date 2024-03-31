import { ErrorDod } from 'rilata/src/domain/domain-data/domain-types';
import { ActionParams } from 'rilata/src/domain/domain-data/params-types';

export type UserRefreshDomainQuery = {
  refreshToken: string,
};

export type RefreshTokenIsExpiredError = ErrorDod<'RefreshTokenIsExpiredError', {
  name: 'RefreshTokenIsExpiredError',
  text: 'Время рефреш токена истекло',
  hint: Record<never, unknown>
}>

export type UserAuthentificationActionParams = ActionParams<
  UserRefreshDomainQuery,
  string,
  RefreshTokenIsExpiredError,
  never
>
