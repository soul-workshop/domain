import { TelegramId } from 'cy-core/src/types';
import { ActionParams, DomainResult } from 'rilata/src/domain/domain-data/params-types';
import { TelegramAuthDateNotValidError, TelegramHashNotValidError } from '../aggregate-errors';

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

export type UserAuthentificationActionParams = ActionParams<
  UserAuthDomainQuery,
  UserAuthDomainOut,
  TelegramAuthDateNotValidError | TelegramHashNotValidError,
  never
>

export type UserAuthentificationResult = DomainResult<UserAuthentificationActionParams>;
