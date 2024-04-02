import { UuidType } from 'rilata/src/common/types';
import { ErrorDod } from 'rilata/src/domain/domain-data/domain-types';

export type ModelIsNotExistError = ErrorDod<'ModelIsNotExistError', {
  text: 'Модель под идентификатором {{modelId}} не существует',
  hint: { modelId: UuidType },
  name: 'ModelIsNotExistError',
}>;

export type WorkshopIsNotExistError = ErrorDod<'WorkshopIsNotExistError', {
  text: 'Мастерская под идентификатором {{workshopId}} не существует',
  hint: { workshopId: UuidType },
  name: 'WorkshopIsNotExistError',
}>;

export type UserMustBeModelerError = ErrorDod<'UserMustBeModelerError', {
  text: 'Пользователь должен быть моделистом мастерской',
  hint: Record<string, never>,
  name: 'UserMustBeModelerError',
}>;

export type ModelNameAlreadyExistsError = ErrorDod<'ModelNameAlreadyExistsError', {
  text: 'Имя модели {{modelName}} уже существует в вашей мастерской',
  hint: { modelName: string },
  name: 'ModelNameAlreadyExistsError',
}>;
