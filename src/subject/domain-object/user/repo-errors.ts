import { UserId } from 'rilata/src/common/types';
import { ErrorDod } from 'rilata/src/domain/domain-data/domain-types';

type UserDoesNotExistLocale = {
    text: 'Пользователя с id:{{userId}} не существует, или эта запись уже удалена.',
    hint: { userId: UserId },
    name: 'UserDoesNotExistError',
}

export type UserDoesNotExistError = ErrorDod<'UserDoesNotExistError', UserDoesNotExistLocale>
