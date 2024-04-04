import { LiteralFieldValidator } from 'rilata/src/domain/validator/field-validator/literal-field-validator';
import { ValidatorMap } from 'rilata/src/domain/validator/field-validator/types';
import { UUIDFormatValidationRule } from 'rilata/src/domain/validator/rules/validate-rules/string/uuid-format.v-rule';
import { RequestDodValidator } from 'rilata/src/app/service/types';
import { DtoFieldValidator } from 'rilata/src/domain/validator/field-validator/dto-field-validator';
import { GetUserRequestDodAttrs, GetUserServiceParams } from './s-params';

const getUserVMap: ValidatorMap<GetUserRequestDodAttrs> = {
  userId: new LiteralFieldValidator('userId', true, { isArray: false }, 'string', [
    new UUIDFormatValidationRule(),
  ]),
};

export const getUserValidator: RequestDodValidator<GetUserServiceParams> = new DtoFieldValidator('getUser', true, { isArray: false }, 'dto', getUserVMap);
