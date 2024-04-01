import { Result } from 'rilata/src/common/result/types';
import { Logger } from 'rilata/src/common/logger/logger';
import { FakeClassImplements } from 'rilata/tests/fixtures/fake-class-implements';
import { UuidType } from 'rilata/src/common/types';
import { failure } from 'rilata/src/common/result/failure';
import { dodUtility } from 'rilata/src/common/utils/domain-object/dod-utility';
import { dtoUtility } from 'rilata/src/common/utils/dto';
import { success } from 'rilata/src/common/result/success';
import { WorkshopAttrs } from './domain-data/params';
import { WorkshopForUserDoesntExistError } from './domain-data/repo-erros';
import { WorkshopRepository } from './domain-object/repo';
import { WorkshopModuleResolver } from './resolver';
import { WorkshopModuleResolves, workshopModuleResolves } from './resolves';
import { TestBatchRecords } from 'rilata/src/app/database/types';

export namespace WorkshopModuleFixtures {
  type WorkshopRecord = WorkshopAttrs & { version: number }

  export class WorkshopRepositoryTestImpl implements WorkshopRepository {
    testRepo: FakeClassImplements.TestMemoryRepository<
      'workshop_repo', WorkshopRecord, 'workshopId'
    >;

    protected logger!: Logger;

    protected resolver!: WorkshopModuleResolver;

    constructor(testDb: FakeClassImplements.TestMemoryDatabase) {
      this.testRepo = new FakeClassImplements.TestMemoryRepository('workshop_repo', 'workshopId', testDb);
    }

    init(resolver: WorkshopModuleResolver): void {
      this.logger = resolver.getLogger();
      this.resolver = resolver;
    }

    // eslint-disable-next-line max-len
    async getWorkshop(id: UuidType): Promise<Result<WorkshopForUserDoesntExistError, WorkshopAttrs>> {
      const workshop = await this.testRepo.find(id);
      if (!workshop) {
        return failure(dodUtility.getDomainError<WorkshopForUserDoesntExistError>(
          'WorkshopForUserDoesntExistError',
          'Мастерская не найдена',
          {},
        ));
      }
      return success(dtoUtility.excludeAttrs(workshop, 'version'));
    }
  }

  const testDb = new FakeClassImplements.TestMemoryDatabase();
  const eventRepo = new FakeClassImplements.TestEventRepository(testDb);

  export const workshopResolves: WorkshopModuleResolves = {
    ...workshopModuleResolves,
    db: testDb,
    busMessageRepo: eventRepo,
    workshopRepo: new WorkshopRepositoryTestImpl(testDb),
  };

  export const workshopRepoFixtures: TestBatchRecords<
    WorkshopRepositoryTestImpl['testRepo']
  > = ({
    workshop_repo: [
      {
        version: 0,
        workshopId: '6f91d305-3f4b-4a3d-9bef-72cf3757cc33',
        name: 'Nurbolat',
        city: 'Freital',
        address: 'Gerti-Bruns-Weg 4/7 70279 Freital',
        location: { latitude: 88.958285, longitude: 117.84182 },
        employeesRole: { userIds: ['fb8a83cf-25a3-2b4f-86e1-27f6de6d8374', '3312a8d6-67ab-4e87-8a21-9d17f508fd5c'] },
      },
      {
        version: 0,
        workshopId: 'a2c1e599-8a67-4c14-b95b-5f9c1ac37e12',
        name: 'Dmitriy',
        city: 'Paris',
        address: 'Rue de la République, 75001 Paris',
        location: { latitude: 48.8566, longitude: 2.3522 },
        employeesRole: { userIds: ['3f12a8d6-67ab-4e87-8a21-9d17f508fd5c'] },
      },
      {
        version: 0,
        workshopId: 'b7d5e210-19c8-43df-8cfd-9643b9f88275',
        name: 'Elena',
        city: 'Venecia',
        address: 'Via della Conciliazione, 00193 Roma',
        location: { latitude: 41.9028, longitude: 12.4534 },
        employeesRole: { userIds: ['6f7d9a45-82c3-4a1b-a7b8-1e55b209f421'] },
      },
    ],
  });
}
