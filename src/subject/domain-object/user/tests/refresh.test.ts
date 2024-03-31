import {
  describe, expect, spyOn, test,
} from 'bun:test';
import { ConsoleLogger } from 'rilata/src/common/logger/console-logger';
import { TokenExpiredError } from 'rilata/src/app/jwt/jwt-errors';
import { UserAR } from '../a-root';
import { DomainServerFixtures } from '../../../../fixtures';
import { UserRefreshDomainQuery } from '../../../domain-data/user/refresh/a-params';

const server = DomainServerFixtures.getTestServer(['SubjectModule']);
const serverResolver = server.getServerResolver();
const decoder = serverResolver.getJwtDecoder();

const tokenExpiredDate = new Date('2020-01-01').getTime(); // 1577836800000
const userAr = new UserAR({
  userId: 'd462f0c6-25c4-45a3-bcf5-7d25d2a9a8df',
  telegramId: 694528239,
  type: 'employee',
  userProfile: {
    firstName: 'Damir',
    lastName: 'SuperPro',
  },
}, 0, new ConsoleLogger());

describe('тесты обновления (refresh) токена пользователя', () => {
  const validRefreshQuery: UserRefreshDomainQuery = {
    refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJkNDYyZjBjNi0yNWM0LTQ1YTMtYmNmNS03ZDI1ZDJhOWE4ZGYiLCJ0ZWxlZ3JhbUlkIjo2OTQ1MjgyMzksImV4cCI6MTU3NzgzNjgwMDAwMCwidHlwIjoicmVmcmVzaCJ9.U6kUZiCX5SO7rU1pDF0VCWeB-iUDrno1AOIaDErxp1Q',
  };

  test('успех, созданный токен авторизации успешно возвращается', () => {
    const nowDate = tokenExpiredDate - 3000;
    const decoderDateMock = spyOn(decoder, 'getNow').mockReturnValue(nowDate);
    decoderDateMock.mockClear();
    const tokenVerifier = serverResolver.getJwtVerifier();
    const tokenCreator = serverResolver.getJwtCreator();

    const result = userAr.refreshToken(validRefreshQuery, tokenVerifier, tokenCreator);
    expect(decoderDateMock).toHaveBeenCalledTimes(2);
    expect(result.isSuccess()).toBe(true);
    expect(result.value).toBe('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJkNDYyZjBjNi0yNWM0LTQ1YTMtYmNmNS03ZDI1ZDJhOWE4ZGYiLCJ0ZWxlZ3JhbUlkIjo2OTQ1MjgyMzksImV4cCI6MTU3NzkyMzE5NzAwMCwidHlwIjoiYWNjZXNzIn0.4brZcscEczsUQ1eRvaY1aziuHjCXKTBiBVkSG4P-vpo');
  });

  test('провал, время рефреш токена истекло', () => {
    const nowDate = tokenExpiredDate + 10;
    const decoderDateMock = spyOn(decoder, 'getNow').mockReturnValue(nowDate);
    decoderDateMock.mockClear();
    const tokenVerifier = serverResolver.getJwtVerifier();
    const tokenCreator = serverResolver.getJwtCreator();

    const result = userAr.refreshToken(validRefreshQuery, tokenVerifier, tokenCreator);
    expect(decoderDateMock).toHaveBeenCalledTimes(1);
    expect(result.isFailure()).toBe(true);
    expect(result.value as TokenExpiredError).toEqual({
      locale: {
        text: 'Токен просрочен.',
        hint: {},
        name: 'TokenExpiredError',
      },
      name: 'TokenExpiredError',
      meta: {
        domainType: 'error',
        errorType: 'domain-error',
      },
    });
  });
});
