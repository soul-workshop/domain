import { dtoUtility } from 'rilata/src/common/utils/dto/';
import { Logger } from 'rilata/src/common/logger/logger';
import { DtoFieldValidator } from 'rilata/src/domain/validator/field-validator/dto-field-validator';
import { AssertionException } from 'rilata/src/common/exeptions';
import { UserId } from 'rilata/src/common/types';
import { Result } from 'rilata/src/common/result/types';
import { dodUtility } from 'rilata/src/common/utils/domain-object/dod-utility';
import { failure } from 'rilata/src/common/result/failure';
import { success } from 'rilata/src/common/result/success';
import { UserAttrs } from '../../../domain-data/user/params';
import { userAttrsVMap } from '../../../domain-data/user/v-map';
import { UserReadRepository } from '../read-repository';
import { UserCmdRepository } from '../cmd-repository';
import { UserAR } from '../a-root';
import { UserFactory } from '../factory';
import { UserDoesNotExistError } from '../../../domain-data/user/get-user/s-params';

type UserRecord = UserAttrs & { version: number };

export class UserJsonRepository implements UserReadRepository, UserCmdRepository {
  private usersRecords: UserRecord[];

  constructor(jsonUsers: string, protected logger: Logger) {
    this.usersRecords = JSON.parse(jsonUsers);
    const userVMap = new DtoFieldValidator('userMap', true, { isArray: true }, 'dto', userAttrsVMap);
    const result = userVMap.validate(this.usersRecords);
    if (result.isFailure()) {
      const errStr = 'Входящие данные не валидны';
      logger.error(errStr, result.value);
      throw new AssertionException(errStr);
    }
  }

  async getUsers(userIds: string[]): Promise<UserAttrs[]> {
    return this.usersRecords
      .filter((records) => userIds.includes(records.userId))
      .map((records) => dtoUtility.excludeAttrs(records, 'version'));
  }

  async getUser(userId: UserId): Promise <Result<UserDoesNotExistError, UserAttrs>> {
    const foundUser = this.usersRecords
      .find((user) => user.userId.includes(userId));
    if (foundUser) {
      const user: UserAttrs = dtoUtility.excludeAttrs(foundUser, 'version');
      return success(user);
    }
    return failure(dodUtility.getDomainErrorByType<UserDoesNotExistError>(
      'UserDoesNotExistError',
      'Такого пользователя не существует',
      { userId },
    ));
  }

  async findByTelegramId(telegramId: number): Promise<UserAR[]> {
    const usersRecords = this.usersRecords.filter((userRcd) => userRcd.telegramId === telegramId);
    const factory = new UserFactory(this.logger);
    return usersRecords.map((rcd) => factory.restore(dtoUtility.excludeAttrs(rcd, 'version'), rcd.version));
  }
}
