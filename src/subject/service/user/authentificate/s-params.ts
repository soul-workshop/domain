import { ErrorDod, RequestDod } from 'rilata/src/domain/domain-data/domain-types';
import { QueryServiceParams } from 'rilata/src/app/service/types';
import { TelegramAuthDTO, UserAuthentificationActionParams } from '../../../domain-data/user/authentificate/a-params';
import { UserParams } from '../../../domain-data/user/params';

export type UserAuthRequestDod = RequestDod<TelegramAuthDTO, 'userAuthentification'>

export type UserAuthentificationOut = string;

type TelegramUserDoesNotExistLocale = {
  text: 'У вас нет аккаунта.',
  hint: { telegramId: number },
  name: 'TelegramUserDoesNotExistError',
}

export type TelegramUserDoesNotExistError = ErrorDod<
  'TelegramUserDoesNotExistError', TelegramUserDoesNotExistLocale
>

export type UserAuthentificationErrors =
  | TelegramUserDoesNotExistError
  | UserAuthentificationActionParams['errors'];

export type UserAuthentificationServiceParams = QueryServiceParams<
  UserParams, UserAuthRequestDod, UserAuthentificationOut, UserAuthentificationErrors
>
