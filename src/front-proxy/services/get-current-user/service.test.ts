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
import { CurrentUser, GetCurrentUserRequestDod, GettingCurrentUserServiceParams } from './s-params';
import { SubjectModuleFixtures } from '../../../subject/fixtures';
import { FrontProxyModule } from '../../module';
import { WorkshopModule } from '../../../workshop-new/module';
import { WorkshopModuleFixtures } from '../../../workshop-new/fixture';
import { SubjectModule } from '../../../subject/module';

describe('Тесты для use-case репозитория getCurrentUser', () => {
  const server = DomainServerFixtures.getTestServer(['WorkshopModule', 'SubjectModule', 'FrontProxyModule']);
  const sutFrontProxy = server.getModule<FrontProxyModule>('FrontProxyModule');
  const sutWorkshop = server.getModule<WorkshopModule>('WorkshopModule');
  const workshopResolver = sutWorkshop.getModuleResolver();
  const sutSubject = server.getModule<SubjectModule>('SubjectModule');
  const subjectResolver = sutSubject.getModuleResolver();

  const caller: DomainUser = {
    type: 'DomainUser',
    userId: 'edc6bfdc-ae44-4e7d-a35e-f26a0e92ffdd',
  };

  beforeEach(() => {
    const workshopTestDb = workshopResolver.getDatabase() as TestDatabase;
    const subjectTestDb = subjectResolver.getDatabase() as TestDatabase;
    workshopTestDb.addBatch(WorkshopModuleFixtures.workshopRepoFixtures);
    subjectTestDb.addBatch(SubjectModuleFixtures.subjectRepoFixtures);
  });

  const currentUser: CurrentUser = {
    userId: 'edc6bfdc-ae44-4e7d-a35e-f26a0e92ffdd',
    telegramId: 5298484021,
    type: 'client',
    userProfile: {
      firstName: 'Renat',
      lastName: 'Fully',
    },
    workshopName: 'Nurbolat',
    workshopId: '6f91d305-3f4b-4a3d-9bef-72cf3757cc33',
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
    const result = await sutFrontProxy.executeService<GettingCurrentUserServiceParams>(
      validRequestDod,
      caller,
    );
    expect(result.isSuccess()).toBe(true);
    const currentUserResult = result.value;
    expect(currentUserResult).toEqual(currentUser);
  });
});
