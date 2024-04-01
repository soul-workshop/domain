import { ErrorDod } from 'rilata/src/domain/domain-data/domain-types';
import { UserId } from 'rilata/src/common/types';

export type UserDoesNotExistError = ErrorDod<'UserDoesNotExistError', {
    text: 'Пользователя с id:{{userId}} не существует, или эта запись уже удалена.',
    hint: { userId: UserId },
    name: 'UserDoesNotExistError',
}>

export type UserByTelegramIdDoesNotExistError = ErrorDod<'UserByTelegramIdDoesNotExistError', {
  text: 'У вас нет аккаунта.',
  hint: { telegramId: number },
  name: 'UserByTelegramIdDoesNotExistError',
}>
