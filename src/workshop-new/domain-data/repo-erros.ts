import { ErrorDod } from 'rilata/src/domain/domain-data/domain-types';

export type WorkshopForUserDoesntExistError = ErrorDod<'WorkshopForUserDoesntExistError', {
    text: 'Мастерская не найдена',
    hint: Record<string, never>,
    name: 'WorkshopForUserDoesntExistError',
}>
