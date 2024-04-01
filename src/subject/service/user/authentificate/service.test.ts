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
import { TelegramAuthDTO, UserAuthDomainOut } from '../../../domain-data/user/authentificate/a-params';
import { UserAuthRequestDod, UserAuthentificationServiceParams } from './s-params';
import { UserByTelegramIdDoesNotExistError } from '../../../domain-data/user/repo-errors';

describe('user authentification use case tests', () => {
  const server = DomainServerFixtures.getTestServer(['SubjectModule']);
  const resolver = server.getModule<SubjectModule>('SubjectModule').getModuleResolver();

  const anonymousCaller: AnonymousUser = { type: 'AnonymousUser' };
  const decoder = resolver.getJwtDecoder();

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
    const decoderGetNowMock = spyOn(decoder, 'getNow').mockReturnValue(getNowTimeAsMs);

    const result = await sut.executeService<UserAuthentificationServiceParams>(
      oneUserFindedRequestDod,
      anonymousCaller,
    );
    expect(result.isSuccess()).toBe(true);
    expect(getNowMock).toHaveBeenCalledTimes(1);
    expect(decoderGetNowMock).toHaveBeenCalledTimes(2);
    expect(result.isSuccess()).toBe(true);
    const jwtToken = result.value as UserAuthDomainOut;
    expect(Object.keys(jwtToken)).toEqual(['access', 'refresh']);

    expect(jwtToken.access).toEqual('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJlZGM2YmZkYy1hZTQ0LTRlN2QtYTM1ZS1mMjZhMGU5MmZmZGQiLCJ0ZWxlZ3JhbUlkIjo1Mjk4NDg0MDIxLCJleHAiOjE3MTE3MTE1OTYwMDAsInR5cCI6ImFjY2VzcyJ9.6Mhx46Is5EYtBojPCxsFCjJkvGU9Ke8KdR-mGvzSEZ8');
    expect(jwtToken.refresh).toEqual('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJlZGM2YmZkYy1hZTQ0LTRlN2QtYTM1ZS1mMjZhMGU5MmZmZGQiLCJ0ZWxlZ3JhbUlkIjo1Mjk4NDg0MDIxLCJleHAiOjE3MTE4ODQzOTYwMDAsInR5cCI6InJlZnJlc2gifQ.s2KplF_k7dylUfGXlJp6NagAxWYaAT-PS12l-JlrpTU');
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
    expect(result.value as UserByTelegramIdDoesNotExistError).toEqual({
      locale: {
        text: 'У вас нет аккаунта.',
        hint: {
          telegramId: 111222334,
        },
        name: 'UserByTelegramIdDoesNotExistError',
      },
      name: 'UserByTelegramIdDoesNotExistError',
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
