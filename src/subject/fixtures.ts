// eslint-disable-next-line max-classes-per-file
import { EventRepository } from 'rilata/src/app/database/event-repository';
import { DatabaseObjectSavingError } from 'rilata/src/common/exeptions';
import { Logger } from 'rilata/src/common/logger/logger';
import { failure } from 'rilata/src/common/result/failure';
import { success } from 'rilata/src/common/result/success';
import { Result } from 'rilata/src/common/result/types';
import { dodUtility } from 'rilata/src/common/utils/domain-object/dod-utility';
import { dtoUtility } from 'rilata/src/common/utils/dto';
import { FakeClassImplements } from 'rilata/tests/fixtures/fake-class-implements';
import { TestBatchRecords } from 'rilata/src/app/database/types';
import { UserRepository } from './domain-object/user/repo';
import { UserAttrs } from './domain-data/user/params';
import { SubjectModuleResolver } from './resolver';
import { UserAR } from './domain-object/user/a-root';
import { SubjectModuleResolves, subjectModuleResolves } from './resolves';
import { UserFactory } from './domain-object/user/factory';
import { UserDoesNotExistError } from './domain-data/user/repo-errors';

export namespace SubjectModuleFixtures {
  type UserRecord = UserAttrs & { version: number };

  export class UserRepositoryTestImpl implements UserRepository {
    testRepo: FakeClassImplements.TestMemoryRepository<
      'user_repo', UserRecord, 'userId'
    >;

    protected logger!: Logger;

    protected resolver!: SubjectModuleResolver;

    constructor(testDb: FakeClassImplements.TestMemoryDatabase) {
      this.testRepo = new FakeClassImplements.TestMemoryRepository('user_repo', 'userId', testDb);
    }

    async getCurrentUser(id: string): Promise<Result<UserDoesNotExistError, UserAR>> {
      const record = await this.testRepo.find(id);
      if (record === undefined) {
        return failure(dodUtility.getDomainError<UserDoesNotExistError>(
          'UserDoesNotExistError',
          'Пользователя с id:{{userId}} не существует, или эта запись уже удалена.',
          { userId: id },
        ));
      }
      return success(this.getUserAr(record));
    }

    init(resolver: SubjectModuleResolver): void {
      this.logger = resolver.getLogger();
      this.resolver = resolver;
    }

    async addUser(userAr: UserAR): Promise<void> {
      this.addEvent(userAr);

      const record: UserRecord = { ...userAr.getAttrs(), version: userAr.getHelper().getVersion() };
      const result = await this.testRepo.add({ ...record });
      if (result.isFailure()) {
        throw new DatabaseObjectSavingError(`user by id ${record.userId} is already exist`);
      }
    }

    async getUser(id: string): Promise<Result<UserDoesNotExistError, UserAR>> {
      const record = await this.testRepo.find(id);
      if (record === undefined) {
        return failure(dodUtility.getDomainError<UserDoesNotExistError>(
          'UserDoesNotExistError',
          'Пользователя с id:{{userId}} не существует, или эта запись уже удалена.',
          { userId: id },
        ));
      }
      return success(this.getUserAr(record));
    }

    async findByTelegramId(telegramId: number): Promise<UserAR[]> {
      const records = await this.testRepo.filterByAttrs({ telegramId });
      return records.map((rec) => this.getUserAr(rec));
    }

    async getUsers(userIds: string[]): Promise<UserAR[]> {
      const records = await Promise.all(userIds.map((userId) => (
        this.testRepo.find(userId)
      )));
      return records
        .filter((rec) => rec !== undefined)
        .map((rec) => this.getUserAr(rec as UserRecord));
    }

    protected getUserAr(record: UserRecord): UserAR {
      const factory = new UserFactory(this.logger);
      const userAr = factory.restore(dtoUtility.excludeAttrs(record, 'version'), record.version);
      return userAr;
    }

    protected async addEvent(userAr: UserAR): Promise<void> {
      const eventRepo = EventRepository.instance(this.resolver);
      await eventRepo.addEvents(userAr.getHelper().getEvents());
      userAr.getHelper().cleanEvents();
    }
  }

  const testDb = new FakeClassImplements.TestMemoryDatabase();
  const testEventRepo = new FakeClassImplements.TestEventRepository(testDb);

  export const subjectModuleTestResolves: SubjectModuleResolves = {
    ...subjectModuleResolves,
    db: testDb,
    busMessageRepo: testEventRepo,
    telegramAuthHashLifetimeLimitAsSeconds: 10, // default 10 seconds
    authentificateBotToken: '6698548206:AAHF49aVG7c-QkIbHQb-OBGwgkYdBRSmTCo',
    userRepo: new UserRepositoryTestImpl(testDb),
    workshopFacade: testWorkshopResolver,
  };

  export const subjectRepoFixtures: TestBatchRecords<
    UserRepositoryTestImpl['testRepo']
  > = ({
    user_repo: [
      {
        userId: 'edc6bfdc-ae44-4e7d-a35e-f26a0e92ffdd',
        version: 0,
        telegramId: 5298484021,
        type: 'client',
        userProfile: {
          firstName: 'Renat',
          lastName: 'Fully',
        },
      },
      {
        userId: 'f915eb6f-6b55-4204-92c4-d64935c33212',
        version: 0,
        telegramId: 111222333,
        type: 'employee',
        userProfile: {
          firstName: 'Bill',
          lastName: 'Smith',
        },
      },
      {
        userId: '7f2c834e-6d63-49ca-ac0e-2b3c46218b04',
        version: 0,
        telegramId: 111222333,
        type: 'client',
        userProfile: {
          firstName: 'Bill',
          lastName: 'Smith',
        },
      },
    ],
  });
}
