import { Location } from 'cy-core/src/types';
import { LiteralFieldValidator } from 'rilata/src/domain/validator/field-validator/literal-field-validator';
import { ValidatorMap } from 'rilata/src/domain/validator/field-validator/types';
import { RangeNumberValidationRule } from 'rilata/src/domain/validator/rules/validate-rules/number/range-number.v-rule';
import { UUIDFormatValidationRule } from 'rilata/src/domain/validator/rules/validate-rules/string/uuid-format.v-rule';
import { UuidField } from 'rilata/src/domain/validator/field-validator/prepared-fields/string/uuid-field';
import { MaxCharsCountValidationRule } from 'rilata/src/domain/validator/rules/validate-rules/string/max-chars-count.v-rule';
import { OnlyDashAndLitinicOrCyrillicCharsValidationRule } from 'rilata/src/domain/validator/rules/validate-rules/string/only-dash-and-latinic-or-cyrillic-chars.v-rule';
import { DtoFieldValidator } from 'rilata/src/domain/validator/field-validator/dto-field-validator';
import { WorkshopAttrs } from './params';

const locationAttrsValidatorMap: ValidatorMap<Location> = {
  latitude: new LiteralFieldValidator(
    'latitude',
    true,
    { isArray: false },
    'number',
    [new RangeNumberValidationRule(-90, 90)],
  ),
  longitude: new LiteralFieldValidator(
    'longitude',
    true,
    {
      isArray: false,
    },
    'number',
    [new RangeNumberValidationRule(-180, 180)],
  ),
};

export const workshopAttrsVMap: ValidatorMap<WorkshopAttrs> = {
  workshopId: new UuidField('workshopId'),
  name: new LiteralFieldValidator('name', true, { isArray: false }, 'string', [
    new MaxCharsCountValidationRule(50),
    new OnlyDashAndLitinicOrCyrillicCharsValidationRule(),
  ]),
  city: new LiteralFieldValidator('city', true, { isArray: false }, 'string', [
    new MaxCharsCountValidationRule(50),
    new OnlyDashAndLitinicOrCyrillicCharsValidationRule(),
  ]),
  address: new LiteralFieldValidator('address', true, { isArray: false }, 'string', [new MaxCharsCountValidationRule(250)]),
  location: new DtoFieldValidator('location', true, { isArray: false }, 'dto', locationAttrsValidatorMap),
  employeesRole: new LiteralFieldValidator('employeesRole', true, { isArray: true, mustBeFilled: true }, 'string', [new UUIDFormatValidationRule()]),
};
export const workshopARValidator = new DtoFieldValidator('workshopAr', true, { isArray: false }, 'dto', workshopAttrsVMap);
