import { Repositoriable } from 'rilata/src/app/resolves/repositoriable';
import { TelegramId } from '../../../types';
import { UserAR } from './a-root';

export interface UserCmdRepository {
  findByTelegramId(telegramId: TelegramId): Promise<UserAR[]>
}

export const UserCmdRepository = {
  instance(repoResolver: Repositoriable): UserCmdRepository {
    return repoResolver.resolveRepo(UserCmdRepository) as UserCmdRepository;
  },
};
