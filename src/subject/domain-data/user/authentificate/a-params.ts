import { TelegramId } from 'cy-core/src/types';
import { ErrorDod } from 'rilata/src/domain/domain-data/domain-types';
import { ActionParams, DomainResult } from 'rilata/src/domain/domain-data/params-types';

export type TelegramAuthDTO = {
  id: TelegramId,
  first_name?: string,
  last_name?: string,
  username?: string,
  photo_url?: string,
  auth_date: number,
  hash: string,
}

export type UserAuthDomainQuery = {
  telegramAuthDTO: TelegramAuthDTO,
  botToken: string,
  telegramAuthHashLifetimeLimitsAsSeconds: number,
}

export type UserAuthDomainOut = {
  access: string,
  refresh: string,
}

type TelegramHashNotValidLocale = {
    text: 'Хэш телеграмма некорректный',
    hint:{ hash: string },
    name: 'TelegramHashNotValidError'
}

export type TelegramHashNotValidError = ErrorDod<'TelegramHashNotValidError', TelegramHashNotValidLocale>

type TelegramAuthDateNotValidLocale = {
    text: 'Прошло больше {{authHashLifetimeAsSeconds}} секунд после получения кода авторизации в телеграм. Повторите процедуру авторизации еще раз.',
    hint:{ authHashLifetimeAsSeconds: number },
    name: 'TelegramAuthDateNotValidError'
}

export type TelegramAuthDateNotValidError = ErrorDod<'TelegramAuthDateNotValidError', TelegramAuthDateNotValidLocale>

export type UserAuthentificationActionParams = ActionParams<
  UserAuthDomainQuery,
  UserAuthDomainOut,
  TelegramAuthDateNotValidError | TelegramHashNotValidError,
  never
>

export type UserAuthentificationResult = DomainResult<UserAuthentificationActionParams>;
