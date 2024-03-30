import { UuidField } from 'rilata/src/domain/validator/field-validator/prepared-fields/string/uuid-field';
import { ValidatorMap } from 'rilata/src/domain/validator/field-validator/types';
import { LiteralFieldValidator } from 'rilata/src/domain/validator/field-validator/literal-field-validator';
import { DtoFieldValidator } from 'rilata/src/domain/validator/field-validator/dto-field-validator';
import { MaxCharsCountValidationRule } from 'rilata/src/domain/validator/rules/validate-rules/string/max-chars-count.v-rule';
import { PositiveNumberValidationRule } from 'rilata/src/domain/validator/rules/validate-rules/number/positive-number.v-rule';
import { StringChoiceValidationRule } from 'rilata/src/domain/validator/rules/validate-rules/string/string-choice.v-rule';
import { OnlyDashAndLitinicOrCyrillicCharsValidationRule } from 'rilata/src/domain/validator/rules/validate-rules/string/only-dash-and-latinic-or-cyrillic-chars.v-rule';
import { UserProfile, UserAttrs } from './params';

export const userProfileVMap: ValidatorMap<UserProfile> = {
  firstName: new LiteralFieldValidator('firstName', true, { isArray: false }, 'string', [
    new MaxCharsCountValidationRule(50),
    new OnlyDashAndLitinicOrCyrillicCharsValidationRule(),
  ]),
  lastName: new LiteralFieldValidator('lastName', true, { isArray: false }, 'string', [
    new MaxCharsCountValidationRule(50),
    new OnlyDashAndLitinicOrCyrillicCharsValidationRule(),
  ]),
};

export const userAttrsVMap: ValidatorMap<UserAttrs> = {
  userId: new UuidField('userId'),
  telegramId: new LiteralFieldValidator('telegramId', true, { isArray: false }, 'number', [
    new PositiveNumberValidationRule(),
  ]),
  type: new LiteralFieldValidator('type', true, { isArray: false }, 'string', [
    new StringChoiceValidationRule(['employee', 'client']),
  ]),
  userProfile: new DtoFieldValidator('userProfile', true, { isArray: false }, 'dto', userProfileVMap),
};

export const userARValidator = new DtoFieldValidator('UserAR', true, { isArray: false }, 'dto', userAttrsVMap);
