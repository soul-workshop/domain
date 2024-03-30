import { JWTTokens } from 'rilata/src/app/jwt/types';
import { UuidType } from 'rilata/src/common/types';
import { ErrorDod } from 'rilata/src/domain/domain-data/domain-types';
import { QueryServiceParams } from 'rilata/src/app/service/types';
import { UserAuthentificationActionParams, TelegramAuthDTO } from './a-params';
import { UserParams } from '../params';

export type UserAuthentificationActionDod = {
  meta: {
    name: 'userAuthentification',
    actionId: UuidType,
    domainType: 'action',
  }
  attrs: TelegramAuthDTO,
}

export type UserAuthentificationOut = JWTTokens;

type ManyAccountNotSupportedLocale = {
  text: 'У вас с одним аккаунтом telegram имеется много аккаунтов, к сожалению сейчас это не поддерживается. Обратитесь в техподдержку, чтобы вам помогли решить эту проблему.',
  hint: { telegramId: number },
}

export type ManyAccountNotSupportedError = ErrorDod<ManyAccountNotSupportedLocale, 'ManyAccountNotSupportedError'>

type TelegramUserDoesNotExistLocale = {
  text: 'У вас нет аккаунта.',
  hint: { telegramId: number },
}

export type TelegramUserDoesNotExistError = ErrorDod<
  TelegramUserDoesNotExistLocale, 'TelegramUserDoesNotExistError'
>

export type UserAuthentificationErrors = ManyAccountNotSupportedError
  | TelegramUserDoesNotExistError
  | UserAuthentificationActionParams['errors'];

export type UserAuthentificationServiceParams = QueryServiceParams<
  UserParams, UserAuthentificationActionDod, UserAuthentificationOut, UserAuthentificationErrors
>
