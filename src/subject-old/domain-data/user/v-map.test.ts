import { describe, expect, test } from 'bun:test';
import { UserAttrs } from './params';
import { userAttrsVMap, userProfileVMap } from './v-map';

describe('тесты валидаторов для атрибутов User', () => {
  describe('тесты валидаторов для атрибутов UserProfile', () => {
    describe('тесты валидатора атрибута имени', () => {
      test('успех, все поля валидны', () => {
        const vResult = userProfileVMap.firstName.validate('Nurbolat');
        expect(vResult.isSuccess()).toEqual(true);
        expect(vResult.value).toBeUndefined();
      });
      test('провал, срабатывает правило на лимит символов', () => {
        const vResult = userProfileVMap.firstName.validate(`Nubolat${'-'.repeat(44)}`);
        expect(vResult.isFailure()).toEqual(true);
        expect(vResult.value).toEqual({
          firstName: [
            {
              name: 'MaxCharsCountValidationRule',
              text: 'Длина строки должна быть не больше {{maxCount}}',
              hint: { maxCount: 50 },
            },
          ],
        });
      });
      test('провал, срабатывает правило на проверку латиницы, кирилицы', () => {
        const vResult = userProfileVMap.firstName.validate('Nurbolat-Амангалиев');
        expect(vResult.isFailure()).toEqual(true);
        expect(vResult.value).toEqual({
          firstName: [
            {
              name: 'OnlyDashAndLitinicOrCyrillicCharsValidationRule',
              text: 'Строка не должна содержать символы кроме "-"(дефис) и может содержать слова только на латинице или на кирилице.',
              hint: {},
            },
          ],
        });
      });
    });
    describe('тесты валидатора атрибута фамилии', () => {
      test('провал, срабатывает правило на лимит символов для фамилии', () => {
        const vResult = userProfileVMap.lastName.validate(`Амангалиев${'-'.repeat(44)}`);
        expect(vResult.isFailure()).toEqual(true);
        expect(vResult.value).toEqual({
          lastName: [
            {
              name: 'MaxCharsCountValidationRule',
              text: 'Длина строки должна быть не больше {{maxCount}}',
              hint: { maxCount: 50 },
            },
          ],
        });
      });
      test('провал, срабатывает правило на проверку латиницы, кирилицы', () => {
        const vResult = userProfileVMap.lastName.validate('Amangaliyev!');
        expect(vResult.isFailure()).toEqual(true);
        expect(vResult.value).toEqual({
          lastName: [
            {
              name: 'OnlyDashAndLitinicOrCyrillicCharsValidationRule',
              text: 'Строка не должна содержать символы кроме "-"(дефис) и может содержать слова только на латинице или на кирилице.',
              hint: {},
            },
          ],
        });
      });
    });
  });

  describe('test userAttrs', () => {
    test('успех, все валидаторы атрибутов валидны', () => {
      const userAttrs: UserAttrs = {
        userId: '68ae48f2-5ae8-4191-8bc5-93c21a4a35b3',
        telegramId: 1234567891011212,
        type: 'client',
        userProfile: {
          firstName: 'Nurbolat',
          lastName: 'Amangaliyev',
        },
      };
      expect(userAttrsVMap.userId.validate(userAttrs.userId).isSuccess()).toBe(true);
      expect(userAttrsVMap.type.validate(userAttrs.type).isSuccess()).toBe(true);
      expect(userAttrsVMap.type.validate('employee').isSuccess()).toBe(true);
      expect(userAttrsVMap.telegramId.validate(userAttrs.telegramId).isSuccess()).toBe(true);
      expect(userAttrsVMap.userProfile.validate(userAttrs.userProfile).isSuccess()).toBe(true);
    });

    test('провал, идентификатор телеграм не может быть отрицательной', () => {
      expect(userAttrsVMap.telegramId.validate(-123456789).value).toEqual({
        telegramId: [{
          name: 'PositiveNumberValidationRule',
          text: 'Число должно быть положительным',
          hint: {},
        },
        ],
      });
    });

    test('провал, тип клиента не валидна', () => {
      expect(userAttrsVMap.type.validate('employeer').value).toEqual({
        type: [{
          name: 'StringChoiceValidationRule',
          text: 'Значение должно быть одним из значений списка',
          hint: { choices: ['employee', 'client'] },
        },
        ],
      });
    });
  });
});
