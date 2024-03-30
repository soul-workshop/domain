import { Repositoriable } from 'rilata/src/app/resolves/repositoriable';
import { UserId } from 'rilata/src/common/types';
import { Result } from 'rilata/src/common/result/types';
import { TelegramId } from '../../../types';
import { UserAR } from './a-root';
import { UserDoesNotExistError } from './repo-errors';
import { AuthModuleResolver } from '../../resolver';

export interface UserRepository {
  init(resolver: AuthModuleResolver): void
  findByTelegramId(telegramId: TelegramId): Promise<UserAR[]>
  addUser(user: UserAR): Promise<void>
  getUser(userId: UserId): Promise<Result<UserDoesNotExistError, UserAR>>
  getUsers(userIds: UserId[]): Promise<UserAR[]>
}

export const UserRepository = {
  instance(repoResolver: Repositoriable): UserRepository {
    return repoResolver.getRepository(UserRepository) as UserRepository;
  },
};
