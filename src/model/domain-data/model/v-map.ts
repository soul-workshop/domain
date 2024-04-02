import { ValidatorMap } from 'rilata/src/domain/validator/field-validator/types';
import { UuidField } from 'rilata/src/domain/validator/field-validator/prepared-fields/string/uuid-field';
import { LiteralFieldValidator } from 'rilata/src/domain/validator/field-validator/literal-field-validator';
import { StringChoiceValidationRule } from 'rilata/src/domain/validator/rules/validate-rules/string/string-choice.v-rule';
import { MaxCharsCountValidationRule } from 'rilata/src/domain/validator/rules/validate-rules/string/max-chars-count.v-rule';
import { DtoFieldValidator } from 'rilata/src/domain/validator/field-validator/dto-field-validator';
import { ModelAttrs } from './params';

export const modelAttrsVMap: ValidatorMap<ModelAttrs> = {
  workshopId: new UuidField('workshopId'),
  modelId: new UuidField('modelId'),
  name: new LiteralFieldValidator('name', true, { isArray: false }, 'string', [
    new MaxCharsCountValidationRule(60),
  ]),
  category: new LiteralFieldValidator('category', true, { isArray: false }, 'string', [
    new StringChoiceValidationRule(['Мебель', 'Кухонная утварь', 'Игрушки']),
  ]),
  images: new LiteralFieldValidator('images', true, { isArray: true }, 'string', []),
};

export const modelAttrsDtoVMap = new DtoFieldValidator('ModelAR', true, { isArray: false }, 'dto', modelAttrsVMap);
