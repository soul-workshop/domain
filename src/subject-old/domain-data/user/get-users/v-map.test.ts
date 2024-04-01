import { describe, expect, test } from 'bun:test';
import { getUsersValidator } from './v-map';

describe('тесты для проверки запроса на получение списка пользователей', () => {
  const sut = getUsersValidator;
  test('успех, для одного пользователя', () => {
    const result = sut.validate({
      userIds: ['37417aa8-a171-4330-bad2-4b74473fce80'],
    });
    expect(result.isSuccess()).toBe(true);
  });

  test('успех, для нескольких пользователей', () => {
    const result = sut.validate({
      userIds: [
        '37417aa8-a171-4330-bad2-4b74473fce80',
        '493f5cbc-f572-4469-9cf1-3702802e6a31',
      ],
    });
    expect(result.isSuccess()).toBe(true);
  });

  test('провал, не uuid', () => {
    const result = sut.validate({
      userIds: [
        '493f5cbc-f572-4469-9cf1-3702802e6a31',
        '37417aa8-a171-4330-bad2-4b74473fce8O', // last not digit
      ],
    });
    expect(result.isFailure()).toBe(true);
    expect(result.value).toEqual(
      {
        getUsers: {
          1: {
            userIds: [
              {
                text: 'Значение должно соответствовать формату UUID',
                hint: {},
                name: 'UUIDFormatValidationRule',
              },
            ],
          },
        },
      },
    );
  });

  test('провал, пустой массив', () => {
    const result = sut.validate({ userIds: [] });
    expect(result.isFailure()).toBe(true);
    expect(result.value).toEqual({
      getUsers: {
        ___array_whole_value_validation_error___: [
          {
            text: 'Значение должно быть не пустым массивом данных',
            hint: {},
            name: 'CannotBeEmptyArrayAssertionRule',
          },
        ],
      },
    });
  });
});
