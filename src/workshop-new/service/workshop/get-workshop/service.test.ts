import {
  describe, test, expect, beforeEach,
} from 'bun:test';
import { DomainUser } from 'rilata/src/app/caller';
import { TestDatabase } from 'rilata/src/app/database/test-database';
import { UuidType } from 'rilata/src/common/types';
import { uuidUtility } from 'rilata/src/common/utils/uuid/uuid-utility';
import { DomainServerFixtures } from '../../../../fixtures';
import { WorkshopModule } from '../../../module';
import { WorkshopModuleFixtures } from '../../../fixture';
import { GettingWorkshopServiceParams, getWorkshopRequesttDod } from './s-params';

describe('тесты сервиса getWorkshop', () => {
  const server = DomainServerFixtures.getTestServer(['WorkshopModule']);
  const sut = server.getModule<WorkshopModule>('WorkshopModule');
  const resolver = sut.getModuleResolver();

  const caller: DomainUser = {
    type: 'DomainUser',
    userId: 'fb8a83cf-25a3-2b4f-86e1-27f6de6d8374',
  };

  beforeEach(() => {
    const testDb = resolver.getDatabase() as TestDatabase;
    testDb.addBatch(WorkshopModuleFixtures.workshopRepoFixtures);
  });

  test('Успех, получен обьект мастерской', async () => {
    const userWorkshopId:UuidType = '6f91d305-3f4b-4a3d-9bef-72cf3757cc33';

    const getWorkshopRequestDod:getWorkshopRequesttDod = {
      meta: {
        name: 'getWorkshop',
        requestId: uuidUtility.getNewUUID(),
        domainType: 'request',
      },
      attrs: {
        workshopId: userWorkshopId,
      },
    };
    const result = await sut.executeService<GettingWorkshopServiceParams>(
      getWorkshopRequestDod,
      caller,
    );
    expect(result.isSuccess()).toBe(true);
  });

  test('Провал, мастерская по такому пользователю не найден', async () => {
    const userWorkshopId:UuidType = '7f91d305-3f4b-4a3d-9bef-72cf3757cc33';

    const getWorkshopRequestDod:getWorkshopRequesttDod = {
      meta: {
        name: 'getWorkshop',
        requestId: uuidUtility.getNewUUID(),
        domainType: 'request',
      },
      attrs: {
        workshopId: userWorkshopId,
      },
    };
    const result = await sut.executeService<GettingWorkshopServiceParams>(
      getWorkshopRequestDod,
      caller,
    );
    expect(result.isFailure()).toBe(true);
    expect(result.value).toEqual({
      locale: {
        text: 'Мастерская не найдена',
        hint: {},
        name: 'WorkshopDoesntExistError',
      },
      name: 'WorkshopDoesntExistError',
      meta: {
        errorType: 'domain-error',
        domainType: 'error',
      },
    });
  });
});
