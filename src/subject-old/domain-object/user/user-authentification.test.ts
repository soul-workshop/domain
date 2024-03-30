import {
  describe, expect, spyOn, test,
} from 'bun:test';
import { JWTTokens } from 'rilata/src/app/jwt/types';
import { ConsoleLogger } from 'rilata/src/common/logger/console-logger';
import { TokenCreator } from 'rilata/src/app/jwt/token-creator.interface';
import { UserAR } from './a-root';
import { JWTPayload } from '../../domain-data/user/user-authentification/a-params';

const TOKEN = '6698548206:AAHF49aVG7c-QkIbHQb-OBGwgkYdBRSmTCo';

const authQuery = {
  id: 694528239,
  auth_date: 1698656796,
  first_name: 'Дамир',
  username: 'xhetso',
  photo_url: 'https://t.me/i/userpic/320/GM3EKjh6x82Lo7cU3aGhVnmBC0BbE5uqOUIR5Ze_8bk.jpg',
  hash: '24b95fcfe1b294643cdfdae068c2e5d643172a2b18ad9823812617187f3d68e4',
};
const authQueryNotValid = {
  id: 694528239,
  auth_date: 1698656796,
  first_name: 'Дамир',
  username: 'xhetso',
  photo_url: 'https://t.me/i/userpic/320/GM3EKjh6x82Lo7cU3aGhVnmBC0BbE5uqOUIR5Ze_8bk.jpg',
  hash: '24b95fcfe1b294643cdfdae068c2e5d643172a2b18ad9823812617187f3d68e4H',
};
const user = new UserAR({
  userId: 'd462f0c6-25c4-45a3-bcf5-7d25d2a9a8df',
  telegramId: 694528239,
  type: 'employee',
  userProfile: {
    firstName: 'Damir',
    lastName: 'SuperPro',
  },
}, 0, new ConsoleLogger());

const userQuery = {
  telegramAuthDTO: authQuery,
  botToken: TOKEN,
};
const userQuery2 = {
  telegramAuthDTO: authQueryNotValid,
  botToken: TOKEN,
};

class TokenCreatorMock implements TokenCreator<JWTPayload> {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  createToken(payload: JWTPayload): JWTTokens {
    throw new Error('Method not implemented.');
  }
}

describe('тесты аутентификации пользователя', () => {
  test('успех, созданный токен авторизации успешно возвращается', () => {
    const dateMock = spyOn(user, 'getNowDate').mockReturnValueOnce(
      new Date(Number(userQuery.telegramAuthDTO.auth_date) * 1000 + 5000),
    );
    dateMock.mockClear();

    const tokenCreatorMock = new TokenCreatorMock();
    const createTokenMock = spyOn(tokenCreatorMock, 'createToken').mockReturnValueOnce({
      accessToken: 'anklehfkahlgrhaiyr7ihfkjashrlgk',
      refreshToken: 'afauhslfuhalskdfhauefglkasdfg',
    });

    const result = user.userAuthentification(userQuery, tokenCreatorMock);
    expect(dateMock).toHaveBeenCalledTimes(1);
    expect(createTokenMock).toHaveBeenCalledTimes(1);
    expect(result.isSuccess()).toBe(true);
    expect(result.value).toEqual({
      accessToken: 'anklehfkahlgrhaiyr7ihfkjashrlgk',
      refreshToken: 'afauhslfuhalskdfhauefglkasdfg',
    });
  });

  test('провал, время авторизации по данному токену прошло', () => {
    const dateMock = spyOn(user, 'getNowDate').mockReturnValueOnce(
      new Date(Number(userQuery.telegramAuthDTO.auth_date) * 1000 + 11000),
    );
    dateMock.mockClear();

    const tokenCreatorMock = new TokenCreatorMock();
    const result = user.userAuthentification(userQuery, tokenCreatorMock);
    expect(result.isFailure()).toBe(true);
    expect(result.value).toEqual({
      locale: {
        text: 'Прошло больше {{authHashLifetimeAsSeconds}} секунд после получения кода авторизации в телеграм. Повторите процедуру авторизации еще раз.',
        hint: {
          authHashLifetimeAsSeconds: 10,
        },
      },
      name: 'TelegramAuthDateNotValidError',
      meta: {
        errorType: 'domain-error',
        domainType: 'error',
      },
    });
    expect(dateMock).toHaveBeenCalledTimes(1);
  });

  test('провал, хеш авторизации не валиден', () => {
    const tokenCreatorMock = new TokenCreatorMock();
    const result = user.userAuthentification(userQuery2, tokenCreatorMock);
    expect(result.isFailure()).toBe(true);
    expect(result.value).toStrictEqual({
      locale: {
        text: 'Хэш телеграмма некорректный',
        hint: {
          hash: '24b95fcfe1b294643cdfdae068c2e5d643172a2b18ad9823812617187f3d68e4H',
        },
      },
      name: 'TelegramHashNotValidError',
      meta: {
        errorType: 'domain-error',
        domainType: 'error',
      },
    });
  });
});
