import { describe, test, expect } from 'bun:test';
import { ConsoleLogger } from 'rilata/src/common/logger/console-logger';
import { getUserRecords } from './fixture';
import { UserJsonRepository } from './repo';

describe('userAr, тесты инвариантов', () => {
  const logger = new ConsoleLogger();
  test('провал, валидатор работает и ловит невалидные значения', () => {
    try {
      const userAttrsWithUndefinedUserId = getUserRecords({ userId: undefined });
      (() => new UserJsonRepository(userAttrsWithUndefinedUserId, logger))();
      expect(true).toBe(false);
    } catch (error) {
      expect(String(error)).toContain('Входящие данные не валидны');
    }

    try {
      const userAttrsWithInvalidUserId = getUserRecords(
        { userId: 'bc9166cb-ba37-43cb-93d3-ce6da27471dU' }, // last char not valid;
      );
      (() => new UserJsonRepository(userAttrsWithInvalidUserId, logger))();
      expect(true).toBe(false);
    } catch (error) {
      expect(String(error)).toContain('Входящие данные не валидны');
    }
  });
});
