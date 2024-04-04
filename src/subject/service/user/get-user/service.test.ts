import {
  beforeEach,
  describe,
  expect,
  test,
} from 'bun:test';
import { TestDatabase } from 'rilata/src/app/database/test-database';
import { UuidType } from 'rilata/src/common/types';
import { DomainUser } from 'rilata/src/app/caller';
import { DomainServerFixtures } from '../../../../fixtures';
import { SubjectModule } from '../../../module';
import { GetUserRequestDod, GetUserServiceParams } from './s-params';
import { SubjectModuleFixtures } from '../../../fixtures';

describe('Тесты для use-case репозитория getUser', () => {
  const server = DomainServerFixtures.getTestServer(['SubjectModule']);
  const sut = server.getModule<SubjectModule>('SubjectModule');
  const resolver = sut.getModuleResolver();

  const caller: DomainUser = {
    type: 'DomainUser',
    userId: 'edc6bfdc-ae44-4e7d-a35e-f26a0e92ffdd',
  };

  beforeEach(() => {
    const testDb = resolver.getDatabase() as TestDatabase;
    testDb.addBatch(SubjectModuleFixtures.subjectRepoFixtures);
  });

  const requestId: UuidType = 'pb8a83cf-25a3-2b4f-86e1-2744de6d8374';

  const validRequestDod: GetUserRequestDod = {
    meta: {
      name: 'getUser',
      requestId,
      domainType: 'request',
    },
    attrs: {
      userId: '7f2c834e-6d63-49ca-ac0e-2b3c46218b04',
    },
  };

  test('успех, запрос для пользователя нормально проходит', async () => {
    const result = await sut.executeService<GetUserServiceParams>(
      validRequestDod,
      caller,
    );
    expect(result.isSuccess()).toBe(true);
    expect(result.value).toEqual({
      userId: '7f2c834e-6d63-49ca-ac0e-2b3c46218b04',
      telegramId: 111222333,
      type: 'client',
      userProfile: {
        firstName: 'Bill',
        lastName: 'Smith',
      },
    });
  });
  test('провал, данный пользователь не существует', async () => {
    const notValidInputOpt = {
      ...validRequestDod,
      attrs: { userId: 'dd91a299-105b-4fb0-a056-9263429433c4' }, // not valid
    };
    const result = await sut.executeService<GetUserServiceParams>(
      notValidInputOpt,
      caller,
    );
    expect(result.isFailure()).toBe(true);
    expect(result.value).toEqual({
      locale: {
        text: 'Такого пользователя не существует',
        hint: {
          userId: 'dd91a299-105b-4fb0-a056-9263429433c4',
        },
        name: 'UserDoesNotExistError',
      },
      name: 'UserDoesNotExistError',
      meta: {
        errorType: 'domain-error',
        domainType: 'error',
      },
    });
  });
});
