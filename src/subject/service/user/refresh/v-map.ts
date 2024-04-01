import { ValidatorMap } from 'rilata/src/domain/validator/field-validator/types';
import { LiteralFieldValidator } from 'rilata/src/domain/validator/field-validator/literal-field-validator';
import { RequestDodValidator } from 'rilata/src/app/service/types';
import { DtoFieldValidator } from 'rilata/src/domain/validator/field-validator/dto-field-validator';
import { RefreshTokenRequestDod, RefreshTokenServiceParams } from './s-params';

const refreshTokenVmap: ValidatorMap<RefreshTokenRequestDod['attrs']> = {
  refreshToken: new LiteralFieldValidator('refreshToken', true, { isArray: false }, 'string', []),
};

// eslint-disable-next-line operator-linebreak
export const refreshTokenValidator: RequestDodValidator<RefreshTokenServiceParams> =
  new DtoFieldValidator('refreshToken', true, { isArray: false }, 'dto', refreshTokenVmap);
