import { Repositoriable } from 'rilata/src/app/resolves/repositoriable';
import { UserId } from 'rilata/src/common/types';
import { Result } from 'rilata/src/common/result/types';
import { UserAttrs } from '../../domain-data/user/params';
import { UserDoesNotExistError } from '../../domain-data/user/get-user/s-params';
import { UserAR } from './a-root';
import { TelegramId } from '../../../types';

export interface UserReadRepository {
  getUsers(userIds: UserId[]): Promise<UserAttrs[]>
  getUser(userId: UserId): Promise<Result<UserDoesNotExistError, UserAttrs>>
  findByTelegramId(telegramId: TelegramId): Promise<UserAR[]>
}

export const UserReadRepository = {
  instance(repoResolver: Repositoriable): UserReadRepository {
    return repoResolver.resolveRepo(UserReadRepository) as UserReadRepository;
  },
};
