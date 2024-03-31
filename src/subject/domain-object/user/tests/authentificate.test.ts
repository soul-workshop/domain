import {
  describe, expect, spyOn, test,
} from 'bun:test';
import { ConsoleLogger } from 'rilata/src/common/logger/console-logger';
import { UserAR } from '../a-root';
import { UserAuthDomainQuery } from '../../../domain-data/user/authentificate/a-params';
import { DomainServerFixtures } from '../../../../fixtures';
import { SubjectModule } from '../../../module';

const server = DomainServerFixtures.getTestServer(['SubjectModule']);
const serverResolver = server.getServerResolver();
const decoder = serverResolver.getJwtDecoder();
const moduleResolver = server.getModule<SubjectModule>('SubjectModule').getModuleResolver();
const telegramToken = moduleResolver.resolve('botToken') as string;

const authQuery = {
  id: 694528239,
  auth_date: 1698656796,
  first_name: 'Дамир',
  username: 'xhetso',
  photo_url: 'https://t.me/i/userpic/320/GM3EKjh6x82Lo7cU3aGhVnmBC0BbE5uqOUIR5Ze_8bk.jpg',
  hash: '24b95fcfe1b294643cdfdae068c2e5d643172a2b18ad9823812617187f3d68e4',
};
const userAr = new UserAR({
  userId: 'd462f0c6-25c4-45a3-bcf5-7d25d2a9a8df',
  telegramId: 694528239,
  type: 'employee',
  userProfile: {
    firstName: 'Damir',
    lastName: 'SuperPro',
  },
}, 0, new ConsoleLogger());

describe('тесты аутентификации пользователя', () => {
  const telegramAuthHashLifetimeLimitsAsSeconds = 10;
  const validAuthQuery: UserAuthDomainQuery = {
    telegramAuthDTO: authQuery,
    botToken: telegramToken,
    telegramAuthHashLifetimeLimitsAsSeconds,
  };

  test('успех, созданный токен авторизации успешно возвращается', () => {
    // запрос пришел после 3 сек, после генерации в телеграм сервере
    const nowDate = validAuthQuery.telegramAuthDTO.auth_date * 1000 + 3000;
    const userArDateMock = spyOn(userAr, 'getNow').mockReturnValueOnce(nowDate);
    userArDateMock.mockClear();
    const decoderDateMock = spyOn(decoder, 'getNow').mockReturnValue(nowDate);
    decoderDateMock.mockClear();
    const tokenCreator = serverResolver.getJwtCreator();

    const result = userAr.userAuthentification(validAuthQuery, tokenCreator);
    expect(userArDateMock).toHaveBeenCalledTimes(1);
    expect(decoderDateMock).toHaveBeenCalledTimes(1);
    expect(result.isSuccess()).toBe(true);
    expect(result.value).toBe('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJkNDYyZjBjNi0yNWM0LTQ1YTMtYmNmNS03ZDI1ZDJhOWE4ZGYiLCJ0ZWxlZ3JhbUlkIjo2OTQ1MjgyMzksImV4cCI6MTY5ODc0MzE5OTAwMCwidHlwIjoiYWNjZXNzIn0.eVm3IKi3S-1LtbldvJQyEu7DLVhwY3OfikqH5ORvm-c');
  });

  test('провал, время авторизации по данному токену прошло', () => {
    // запрос пришел после 10.001 сек, после генерации в телеграм сервере
    const nowDate = validAuthQuery.telegramAuthDTO.auth_date * 1000 + 10001;
    const userArDateMock = spyOn(userAr, 'getNow').mockReturnValueOnce(nowDate);
    userArDateMock.mockClear();
    const tokenCreator = serverResolver.getJwtCreator();

    const result = userAr.userAuthentification(validAuthQuery, tokenCreator);
    expect(result.isFailure()).toBe(true);
    expect(result.value).toEqual({
      locale: {
        text: 'Прошло больше {{authHashLifetimeAsSeconds}} секунд после получения кода авторизации в телеграм. Повторите процедуру авторизации еще раз.',
        hint: {
          authHashLifetimeAsSeconds: 10,
        },
        name: 'TelegramAuthDateNotValidError',
      },
      name: 'TelegramAuthDateNotValidError',
      meta: {
        errorType: 'domain-error',
        domainType: 'error',
      },
    });
    expect(userArDateMock).toHaveBeenCalledTimes(1);
  });

  test('провал, хеш авторизации не валиден', () => {
    const notValidAuthQuery = {
      id: 694528239,
      auth_date: 1698656796,
      first_name: 'Дамир',
      username: 'xhetso',
      photo_url: 'https://t.me/i/userpic/320/GM3EKjh6x82Lo7cU3aGhVnmBC0BbE5uqOUIR5Ze_8bk.jpg',
      hash: '24b95fcfe1b294643cdfdae068c2e5d643172a2b18ad9823812617187f3d68e4H',
    };
    const userQuery2: UserAuthDomainQuery = {
      telegramAuthDTO: notValidAuthQuery,
      botToken: telegramToken,
      telegramAuthHashLifetimeLimitsAsSeconds: 0,
    };
    const tokenCreator = serverResolver.getJwtCreator();
    const result = userAr.userAuthentification(userQuery2, tokenCreator);
    expect(result.isFailure()).toBe(true);
    expect(result.value).toStrictEqual({
      locale: {
        text: 'Хэш телеграмма некорректный',
        hint: {
          hash: '24b95fcfe1b294643cdfdae068c2e5d643172a2b18ad9823812617187f3d68e4H',
        },
        name: 'TelegramHashNotValidError',
      },
      name: 'TelegramHashNotValidError',
      meta: {
        errorType: 'domain-error',
        domainType: 'error',
      },
    });
  });
});
