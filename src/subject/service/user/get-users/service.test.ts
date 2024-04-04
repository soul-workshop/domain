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
import { SubjectModuleFixtures } from '../../../fixtures';
import { GetUsersRequestDod, GetUsersServiceParams } from './s-params';

describe('тесты для use-case getUsers', () => {
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

  const validRequestDod: GetUsersRequestDod = {
    meta: {
      name: 'getUsers',
      requestId,
      domainType: 'request',
    },
    attrs: {
      userIds: [
        'edc6bfdc-ae44-4e7d-a35e-f26a0e92ffdd',
        'f915eb6f-6b55-4204-92c4-d64935c33212',
      ],
    },
  };

  test('успех, запрос для пользователя нормально проходит', async () => {
    const result = await sut.executeService<GetUsersServiceParams>(
      validRequestDod,
      caller,
    );
    expect(result.isSuccess()).toBe(true);
    expect(result.value).toEqual([
      {
        userId: 'edc6bfdc-ae44-4e7d-a35e-f26a0e92ffdd',
        telegramId: 5298484021,
        type: 'client',
        userProfile: {
          firstName: 'Renat',
          lastName: 'Fully',
        },
      }, {
        userId: 'f915eb6f-6b55-4204-92c4-d64935c33212',
        telegramId: 111222333,
        type: 'employee',
        userProfile: {
          firstName: 'Bill',
          lastName: 'Smith',
        },
      },
    ]);
  });

  test('успех, запрос для пользователя нормально проходит, отдается данные пользователя который есть на базе', async () => {
    const notValidInputOpt = {
      ...validRequestDod,
      attrs: {
        userIds: [
          'f915eb6f-6b55-4204-92c4-d64935c33214', // not found.
          'f915eb6f-6b55-4204-92c4-d64935c33212',
        ],
      },
    };

    const result = await sut.executeService(
      notValidInputOpt,
      caller,
    );

    expect(result.isSuccess()).toBe(true);
    expect(result.value).toEqual([
      {
        userId: 'f915eb6f-6b55-4204-92c4-d64935c33212',
        telegramId: 111222333,
        type: 'employee',
        userProfile: {
          firstName: 'Bill',
          lastName: 'Smith',
        },
      },
    ]);
  });

  test('провал, не прошла валидация', async () => {
    const notValidInputOpt = {
      ...validRequestDod,
      attrs: {
        userIds: [
          'fa91a299-105b-4fb0-a056-9263429133c', // not valid
          '493f5cbc-f572-4469-9cf1-3702802e6a31',
        ],
      },
    };

    const result = await sut.executeService(
      notValidInputOpt,
      caller,
    );
    expect(result.isFailure()).toBe(true);
    expect(result.value).toEqual({
      name: 'Validation error',
      meta: {
        domainType: 'error',
        errorType: 'app-error',
      },
      errors: {
        getUsers: {
          0: {
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
    });
  });
});
