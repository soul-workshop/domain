import {
  describe, test, expect, spyOn, beforeEach,
} from 'bun:test';
import { uuidUtility } from 'rilata/src/common/utils/uuid/uuid-utility';
import { TestDatabase } from 'rilata/src/app/database/test-database';
import { AnonymousUser } from 'rilata/src/app/caller';
import { UserAR } from '../../../domain-object/user/a-root';
import { DomainServerFixtures } from '../../../../fixtures';
import { SubjectModule } from '../../../module';
import { SubjectModuleFixtures } from '../../../fixtures';
import { TelegramAuthDTO } from '../../../domain-data/user/authentificate/a-params';
import { TelegramUserDoesNotExistError, UserAuthRequestDod } from './s-params';
import { UserRepository } from '../../../domain-object/user/repo';

describe('user authentification use case tests', () => {
  const server = DomainServerFixtures.getTestServer(['SubjectModule']);
  const resolver = server.getModule<SubjectModule>('SubjectModule').getModuleResolver();

  const anonymousCaller: AnonymousUser = { type: 'AnonymousUser' };
  const decoder = resolver.getJwtDecoder();
  const userRepo = resolver.resolveRepo(UserRepository) as UserRepository;

  beforeEach(() => {
    const testDb = resolver.getDatabase() as TestDatabase;
    testDb.addBatch(SubjectModuleFixtures.subjectRepoFixtures);
  });

  const sut = resolver.getModule();

  test('успех, возвращен сгенерированный токен для одного сотрудника', async () => {
    const oneUserFindedAuthQuery: TelegramAuthDTO = {
      auth_date: 1711625191,
      first_name: 'Renat',
      hash: '54070a1a643f8f87cf758bb345fcdec155330edf3e7f4202bcafc7cdb3f89ca2',
      id: 5298484021,
      photo_url: 'https://t.me/i/userpic/320/MvrRxdzTHTSKEeHmy_aQiVyV1nLDSAUhUHvHAb2s9itNmkIeNER9cMsDguAp0DxD.jpg',
      username: 'Renatt123',
    };
    const oneUserFindedRequestDod: UserAuthRequestDod = {
      meta: {
        name: 'userAuthentification',
        requestId: uuidUtility.getNewUUID(),
        domainType: 'request',
      },
      attrs: oneUserFindedAuthQuery,
    };
    const getNowTimeAsMs = oneUserFindedAuthQuery.auth_date * 1000 + 5000;
    const getNowMock = spyOn(UserAR.prototype, 'getNow').mockReturnValueOnce(getNowTimeAsMs);
    const decoderGetNowMock = spyOn(decoder, 'getNow').mockReturnValueOnce(getNowTimeAsMs);

    const result = await sut.executeService(oneUserFindedRequestDod, anonymousCaller);
    expect(result.isSuccess()).toBe(true);
    expect(getNowMock).toHaveBeenCalledTimes(1);
    expect(decoderGetNowMock).toHaveBeenCalledTimes(1);
    expect(result.value).toBe('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJlZGM2YmZkYy1hZTQ0LTRlN2QtYTM1ZS1mMjZhMGU5MmZmZGQiLCJ0ZWxlZ3JhbUlkIjo1Mjk4NDg0MDIxLCJleHAiOjE3MTE3MTE1OTYwMDAsInJFeHAiOjE3MTE4ODQzOTYwMDB9.8VIcURLBiPeo8spNfMr7FdF8GCFhuxIg6wkuHbbakaY');
  });

  test('провал, случаи когда один сотрудник и один клиент', async () => {
    const manyUserFindedRequestDod: UserAuthRequestDod = {
      meta: {
        name: 'userAuthentification',
        requestId: 'e47cf20b-ea78-4900-8071-4c804c393c02',
        domainType: 'request',
      },
      attrs: {
        id: 111222333,
        auth_date: 1111, // any time
        hash: '94e3a2220604b8494aa812f17159321958220291916aa78462c7cbc153d14056',
      },
    };

    try {
      await sut.executeService(manyUserFindedRequestDod, anonymousCaller);
      throw Error('not be call');
    } catch (e) {
      expect(String(e)).toBe('Error: Несколько аккаунтов с одним telegramId');
    }
  });

  test('провал, случай когда пользователь не найден', async () => {
    const userNotFoundRequestDod: UserAuthRequestDod = {
      meta: {
        name: 'userAuthentification',
        requestId: 'e47cf20b-ea78-4900-8071-4c804c393c02',
        domainType: 'request',
      },
      attrs: {
        id: 111222334,
        auth_date: 1111, // any time
        hash: '94e3a2220604b8494aa812f17159321958220291916aa78462c7cbc153d14056',
      },
    };

    const result = await sut.executeService(userNotFoundRequestDod, anonymousCaller);
    expect(result.isFailure()).toBe(true);
    expect(result.value as TelegramUserDoesNotExistError).toEqual({
      locale: {
        text: 'У вас нет аккаунта.',
        hint: {
          telegramId: 111222334,
        },
        name: 'TelegramUserDoesNotExistError',
      },
      name: 'TelegramUserDoesNotExistError',
      meta: {
        errorType: 'domain-error',
        domainType: 'error',
      },
    });
  });

  test('провал, не прошла валидация', async () => {
    const notValid = {
      meta: {
        name: 'userAuthentification',
        requestId: 'e47cf20b-ea78-4900-8071-4c804c393c02',
        domainType: 'request',
      },
      attrs: {
        id: 111222334,
        hash: '94e3a2220604b8494aa812f17159321958220291916aa78462c7cbc153d14056',
      },
    } as UserAuthRequestDod;

    const result = await sut.executeService(notValid, anonymousCaller);
    expect(result.isFailure()).toBe(true);
    expect(result.value).toEqual({
      name: 'Validation error',
      meta: {
        domainType: 'error',
        errorType: 'app-error',
      },
      errors: {
        userAuthentification: {
          auth_date: [
            {
              text: 'Значение не должно быть undefined или null',
              hint: {},
              name: 'CannotBeNullableAssertionRule',
            },
          ],
        },
      },
    });
  });
});
