import { ValidatorMap } from 'rilata/src/domain/validator/field-validator/types';
import { LiteralFieldValidator } from 'rilata/src/domain/validator/field-validator/literal-field-validator';
import { RequestDodValidator } from 'rilata/src/app/service/types';
import { PositiveNumberValidationRule } from 'rilata/src/domain/validator/rules/validate-rules/number/positive-number.v-rule';
import { IsTimeStampValidationRule } from 'rilata/src/domain/validator/rules/validate-rules/timestamp/is-timestamp.v-rule';
import { DtoFieldValidator } from 'rilata/src/domain/validator/field-validator/dto-field-validator';
import { TelegramAuthDTO } from '../../../domain-data/user/authentificate/a-params';
import { UserAuthentificationServiceParams } from './s-params';

const userAuthentificationVMap: ValidatorMap<TelegramAuthDTO> = {
  id: new LiteralFieldValidator('id', true, { isArray: false }, 'number', [
    new PositiveNumberValidationRule(),
  ]),
  first_name: new LiteralFieldValidator('first_name', false, { isArray: false }, 'string', []),
  last_name: new LiteralFieldValidator('last_name', false, { isArray: false }, 'string', []),
  username: new LiteralFieldValidator('username', false, { isArray: false }, 'string', []),
  photo_url: new LiteralFieldValidator('photo_url', false, { isArray: false }, 'string', []),
  auth_date: new LiteralFieldValidator('auth_date', true, { isArray: false }, 'number', [
    new IsTimeStampValidationRule(),
  ]),
  hash: new LiteralFieldValidator('hash', true, { isArray: false }, 'string', []),
};

// eslint-disable-next-line operator-linebreak
export const userAuthentificationValidator: RequestDodValidator<UserAuthentificationServiceParams> =
  new DtoFieldValidator('userAuthentification', true, { isArray: false }, 'dto', userAuthentificationVMap);
