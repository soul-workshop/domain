import { describe, expect, test } from 'bun:test';
import { ModelAttrs, ModelCategory } from './params';
import { modelAttrsVMap } from './v-map';

describe('test modelAttrs', () => {
  test('success, all values are valid', () => {
    const modelAttrs: ModelAttrs = {
      workshopId: '6f91d305-3f4b-4a3d-9bef-72cf3757cc33',
      modelId: '6f91d305-3f4b-4a3d-9bef-72cf3757c553',
      name: 'Компьютерный стол Hope 1',
      category: 'Мебель',
      images: [],
    };
    expect(modelAttrsVMap.workshopId.validate(modelAttrs.workshopId).value).toBeUndefined();
    expect(modelAttrsVMap.modelId.validate(modelAttrs.modelId).value).toBeUndefined();
    expect(modelAttrsVMap.name.validate(modelAttrs.name).value).toBeUndefined();
    expect(modelAttrsVMap.category.validate(modelAttrs.category).value).toBeUndefined();
  });
  test('failure, workshopId value does not match UUID format', () => {
    const modelAttrs: ModelAttrs = {
      workshopId: '6f91d305-3f4b-4a3d-9bef-72cf3757cc334',
      modelId: '6f91d305-3f4b-4a3d-9bef-72cf3757c553',
      name: 'Компьютерный стол Hope 1',
      category: 'Мебель',
      images: [],
    };
    expect(modelAttrsVMap.workshopId.validate(modelAttrs.workshopId).value).toEqual({
      workshopId: [
        {
          text: 'Значение должно соответствовать формату UUID',
          hint: {},
          name: 'UUIDFormatValidationRule',
        },
      ],
    });
    expect(modelAttrsVMap.modelId.validate(modelAttrs.modelId).value).toBeUndefined();
    expect(modelAttrsVMap.name.validate(modelAttrs.name).value).toBeUndefined();
    expect(modelAttrsVMap.category.validate(modelAttrs.category).value).toBeUndefined();
  });
  test('failure, name not valid', () => {
    const modelAttrs: ModelAttrs = {
      workshopId: '6f91d305-3f4b-4a3d-9bef-72cf3757cc33',
      modelId: '6f91d305-3f4b-4a3d-9bef-72cf3757c553',
      name: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard',
      category: 'Мебель',
      images: [],
    };
    expect(modelAttrsVMap.workshopId.validate(modelAttrs.workshopId).value).toBeUndefined();
    expect(modelAttrsVMap.modelId.validate(modelAttrs.modelId).value).toBeUndefined();
    expect(modelAttrsVMap.name.validate(modelAttrs.name).value).toEqual({
      name: [
        {
          text: 'Длина строки должна быть не больше {{maxCount}}',
          hint: {
            maxCount: 50,
          },
          name: 'MaxCharsCountValidationRule',
        },
      ],
    });
    expect(modelAttrsVMap.category.validate(modelAttrs.category).value).toBeUndefined();
  });
  test('failure, incorrect category indicated', () => {
    const modelAttrs: ModelAttrs = {
      workshopId: '6f91d305-3f4b-4a3d-9bef-72cf3757cc33',
      modelId: '6f91d305-3f4b-4a3d-9bef-72cf3757c553',
      name: 'Компьютерный стол Hope 1',
      category: 'Периферия' as ModelCategory,
      images: [],
    };
    expect(modelAttrsVMap.workshopId.validate(modelAttrs.workshopId).value).toBeUndefined();
    expect(modelAttrsVMap.modelId.validate(modelAttrs.modelId).value).toBeUndefined();
    expect(modelAttrsVMap.name.validate(modelAttrs.name).value).toBeUndefined();
    expect(modelAttrsVMap.category.validate(modelAttrs.category).value).toEqual({
      category: [
        {
          text: 'Значение должно быть одним из значений списка',
          hint: {
            choices: ['Мебель', 'Кухонная утварь', 'Игрушки',
            ],
          },
          name: 'StringChoiceValidationRule',
        },
      ],
    });
  });
});
