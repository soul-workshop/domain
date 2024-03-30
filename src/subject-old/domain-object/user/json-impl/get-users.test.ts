import { describe, expect, test } from 'bun:test';
import { ConsoleLogger } from 'rilata/src/common/logger/console-logger';
import { UserJsonRepository } from './repo';
import { testUsersRecordsAsJson } from './fixture';

describe('тесты для получения списка пользователей по id', () => {
  const logger = new ConsoleLogger();

  const sut = new UserJsonRepository(testUsersRecordsAsJson, logger);
  test('успех, получить массив с одним пользователем', async () => {
    const users = await sut.getUsers(['bc9166cb-ba37-43cb-93d3-ce6da27471df']);
    expect(users).toEqual([
      {
        userId: 'bc9166cb-ba37-43cb-93d3-ce6da27471df',
        telegramId: 5436134100,
        type: 'client',
        userProfile: {
          firstName: 'Jack',
          lastName: 'Smith',
        },
      },
    ]);
  });

  test('успех, получить массив с одним пользователем, второй не найден', async () => {
    const users = await sut.getUsers([
      '37417aa8-a171-4330-bad2-4b74473fce80',
      'bc9166cb-ba37-43cb-93d3-ce6da27471df',
    ]);
    expect(users).toEqual([
      {
        userId: 'bc9166cb-ba37-43cb-93d3-ce6da27471df',
        telegramId: 5436134100,
        type: 'client',
        userProfile: {
          firstName: 'Jack',
          lastName: 'Smith',
        },
      },
    ]);
  });

  test('успех, пользователь не найден возращается пустой массив', async () => {
    const users = await sut.getUsers([
      '37417aa8-a171-4330-bad2-4b74473fce80',
    ]);
    expect(users).toEqual([]);
  });

  test('успех, получить массив с двумя пользователями, третий не найден', async () => {
    const users = await sut.getUsers([
      'fa91a299-105b-4fb0-a056-92634249130c',
      '37417aa8-a171-4330-bad2-4b74473fce80',
      '493f5cbc-f572-4469-9cf1-3702802e6a31',
    ]);
    expect(users).toEqual([
      {
        userId: 'fa91a299-105b-4fb0-a056-92634249130c',
        telegramId: 5436134100,
        type: 'employee',
        userProfile: {
          firstName: 'Jack',
          lastName: 'Smith',
        },
      },
      {
        userId: '493f5cbc-f572-4469-9cf1-3702802e6a31',
        telegramId: 3290593910,
        type: 'employee',
        userProfile: {
          firstName: 'Bill',
          lastName: 'Oruell',
        },
      },
    ]);
  });
});
