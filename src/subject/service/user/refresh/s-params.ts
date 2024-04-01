import { RequestDod } from 'rilata/src/domain/domain-data/domain-types';
import { QueryServiceParams } from 'rilata/src/app/service/types';
import { UserParams } from '../../../domain-data/user/params';
import { UserRefreshActionParams, UserRefreshDomainOut, UserRefreshDomainQuery } from '../../../domain-data/user/refresh/a-params';
import { UserDoesNotExistError } from '../../../domain-data/user/repo-errors';

export type RefreshTokenRequestDod = RequestDod<UserRefreshDomainQuery, 'refreshToken'>

export type RefreshTokenServiceOut = UserRefreshDomainOut;

export type RefreshTokenAppErrors =
  UserDoesNotExistError
  | UserRefreshActionParams['errors'];

export type RefreshTokenServiceParams = QueryServiceParams<
  UserParams, RefreshTokenRequestDod, RefreshTokenServiceOut, RefreshTokenAppErrors
>
