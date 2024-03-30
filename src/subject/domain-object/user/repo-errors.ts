import { UserId } from 'rilata/src/common/types';
import { ErrorDod } from 'rilata/src/domain/domain-data/domain-types';

type UserDoesNotExistLocale = {
    text: 'Такого пользователя не существует',
    hint: { userId: UserId },
    name: 'UserDoesNotExistError',
}

export type UserDoesNotExistError = ErrorDod<'UserDoesNotExistError', UserDoesNotExistLocale>
