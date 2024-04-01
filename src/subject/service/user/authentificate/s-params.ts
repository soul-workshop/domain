import { RequestDod } from 'rilata/src/domain/domain-data/domain-types';
import { QueryServiceParams } from 'rilata/src/app/service/types';
import { TelegramAuthDTO, UserAuthDomainOut, UserAuthentificationActionParams } from '../../../domain-data/user/authentificate/a-params';
import { UserParams } from '../../../domain-data/user/params';
import { UserByTelegramIdDoesNotExistError } from '../../../domain-data/user/repo-errors';

export type UserAuthRequestDod = RequestDod<TelegramAuthDTO, 'userAuthentification'>

export type UserAuthServiceOut = UserAuthDomainOut;

export type UserAuthentificationErrors =
  | UserByTelegramIdDoesNotExistError
  | UserAuthentificationActionParams['errors'];

export type UserAuthentificationServiceParams = QueryServiceParams<
  UserParams, UserAuthRequestDod, UserAuthServiceOut, UserAuthentificationErrors
>
