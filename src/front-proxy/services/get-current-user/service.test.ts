import {
  beforeEach,
  describe,
  expect,
  test,
} from 'bun:test';
import { TestDatabase } from 'rilata/src/app/database/test-database';
import { UuidType } from 'rilata/src/common/types';
import { DomainUser } from 'rilata/src/app/caller';
import { DomainServerFixtures } from '../../../fixtures';
import { SubjectModule } from '../../../subject/module';
import { CurrentUser, GetCurrentUserRequestDod, GettingCurrentUserServiceParams } from './s-params';
import { SubjectModuleFixtures } from '../../../subject/fixtures';

describe('Тесты для use-case репозитория getCurrentUser', () => {
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

  const currentUser: CurrentUser = {
    userId: 'fa91a299-105b-4fb0-a056-92634249130c',
    telegramId: 5436134100,
    type: 'employee',
    userProfile: {
      firstName: 'Jack',
      lastName: 'Smith',
    },
    workshopId: '6f91d305-3f4b-4a3d-9bef-72cf3757cc33',
    workshopName: 'TheBestWorkshop',
  };

  const requestId: UuidType = 'pb8a83cf-25a3-2b4f-86e1-2744de6d8374';

  const validRequestDod: GetCurrentUserRequestDod = {
    meta: {
      name: 'getCurrentUser',
      requestId,
      domainType: 'request',
    },
    attrs: {
    },
  };

  test('успех, возвращен текущий пользователь', async () => {
    const result = await sut.executeService<GettingCurrentUserServiceParams>(
      validRequestDod,
      caller,
    );
    expect(result.isSuccess()).toBe(false);
    const currentUserResult = result.value;
    expect(currentUserResult).toEqual(currentUser);
  });
});
