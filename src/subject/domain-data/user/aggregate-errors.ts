import { ErrorDod } from 'rilata/src/domain/domain-data/domain-types';

export type TelegramHashNotValidError = ErrorDod<'TelegramHashNotValidError', {
    text: 'Хэш телеграмма некорректный',
    hint:{ hash: string },
    name: 'TelegramHashNotValidError'
}>

export type TelegramAuthDateNotValidError = ErrorDod<'TelegramAuthDateNotValidError', {
    text: 'Прошло больше {{authHashLifetimeAsSeconds}} секунд после получения кода авторизации в телеграм. Повторите процедуру авторизации еще раз.',
    hint:{ authHashLifetimeAsSeconds: number },
    name: 'TelegramAuthDateNotValidError'
}>

export type RefreshTokenIsExpiredError = ErrorDod<'RefreshTokenIsExpiredError', {
  name: 'RefreshTokenIsExpiredError',
  text: 'Время рефреш токена истекло',
  hint: Record<never, unknown>
}>
