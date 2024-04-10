import { RequestDodValidator } from 'rilata/src/app/service/types';
import { DtoFieldValidator } from 'rilata/src/domain/validator/field-validator/dto-field-validator';
import { GettingCurrentUserServiceParams } from './s-params';

export const getCurrentUserValidator:
RequestDodValidator<GettingCurrentUserServiceParams> = new DtoFieldValidator('getCurrentUser', true, { isArray: false }, 'dto', {});
