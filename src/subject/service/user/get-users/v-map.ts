import { DtoFieldValidator } from 'rilata/src/domain/validator/field-validator/dto-field-validator';
import { ValidatorMap } from 'rilata/src/domain/validator/field-validator/types';
import { LiteralFieldValidator } from 'rilata/src/domain/validator/field-validator/literal-field-validator';
import { UUIDFormatValidationRule } from 'rilata/src/domain/validator/rules/validate-rules/string/uuid-format.v-rule';
import { RequestDodValidator } from 'rilata/src/app/service/types';
import { GetUsersRequestDodAttrs, GetUsersServiceParams } from './s-params';

const getUsersVMap: ValidatorMap<GetUsersRequestDodAttrs> = {
  userIds: new LiteralFieldValidator('userIds', true, { isArray: true }, 'string', [
    new UUIDFormatValidationRule(),
  ]),
};
export const getUsersValidator: RequestDodValidator<GetUsersServiceParams> = new DtoFieldValidator('getUsers', true, { isArray: false }, 'dto', getUsersVMap);
