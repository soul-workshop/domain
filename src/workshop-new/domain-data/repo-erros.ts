import { ErrorDod } from 'rilata/src/domain/domain-data/domain-types';

export type WorkshopDoesntExistError = ErrorDod<'WorkshopDoesntExistError', {
    text: 'Мастерская не найдена',
    hint: Record<string, never>,
    name: 'WorkshopDoesntExistError',
}>
