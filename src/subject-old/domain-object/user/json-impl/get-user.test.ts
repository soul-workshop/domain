import { describe, expect, test } from 'bun:test';
import { ConsoleLogger } from 'rilata/src/common/logger/console-logger';
import { UserJsonRepository } from './repo';
import { testUsersRecordsAsJson } from './fixture';

describe('Тесты для получения user-a по userId', () => {
  const logger = new ConsoleLogger();

  const sut = new UserJsonRepository(testUsersRecordsAsJson, logger);
  test('Успех, получен обьект пользователя', async () => {
    const user = await sut.getUser('fa91a299-105b-4fb0-a056-92634249130c');
    expect(user.value).toEqual({
      userId: 'fa91a299-105b-4fb0-a056-92634249130c',
      telegramId: 5436134100,
      type: 'employee',
      userProfile: {
        firstName: 'Jack',
        lastName: 'Smith',
      },
    });
  });
  test('Провал, пользователь по такому id не найден', async () => {
    const userId = '3332a8d6-67ab-4e87-8a21-9d17f508fd5c';
    const user = await sut.getUser(userId);
    expect(user.value).toEqual({
      locale: {
        text: 'Такого пользователя не существует',
        hint: {
          userId: '3332a8d6-67ab-4e87-8a21-9d17f508fd5c',
        },
      },
      name: 'UserDoesNotExistError',
      meta: {
        errorType: 'domain-error',
        domainType: 'error',
      },
    });
  });
});
