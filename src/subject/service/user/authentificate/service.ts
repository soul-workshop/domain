import { QueryService } from 'rilata/src/app/service/query-service';
import { ServiceResult } from 'rilata/src/app/service/types';
import { dodUtility } from 'rilata/src/common/utils/domain-object/dod-utility';
import { failure } from 'rilata/src/common/result/failure';
import { TelegramUserDoesNotExistError, UserAuthRequestDod, UserAuthentificationServiceParams } from './s-params';
import { userAuthentificationValidator } from './v-map';
import { UserRepository } from '../../../domain-object/user/repo';
import { UserAuthDomainQuery } from '../../../domain-data/user/authentificate/a-params';

export class UserAuthentificationService extends QueryService<UserAuthentificationServiceParams> {
  serviceName: 'userAuthentification' = 'userAuthentification' as const;

  aRootName = 'UserAR' as const;

  protected supportedCallers: readonly ('ModuleCaller' | 'AnonymousUser' | 'DomainUser')[] = ['AnonymousUser'];

  protected validator = userAuthentificationValidator;

  protected async runDomain(
    requestDod: UserAuthRequestDod,
  ): Promise<ServiceResult<UserAuthentificationServiceParams>> {
    const userRepo = UserRepository.instance(this.moduleResolver);
    const telegramId = requestDod.attrs.id;
    const users = await userRepo.findByTelegramId(telegramId);

    if (users.length > 1) {
      throw this.logger.error('Несколько аккаунтов с одним telegramId', { telegramId: requestDod.attrs.id });
    } if (users.length === 0) {
      const err = dodUtility.getDomainError<TelegramUserDoesNotExistError>(
        'TelegramUserDoesNotExistError',
        'У вас нет аккаунта.',
        { telegramId },
      );
      return failure(err);
    }

    const userAr = users[0];

    const resolver = this.moduleResolver;
    const userAuthQuery: UserAuthDomainQuery = {
      botToken: resolver.getRealisation('botToken') as string,
      telegramAuthDTO: requestDod.attrs,
      telegramAuthHashLifetimeLimitsAsSeconds: resolver.getRealisation('authHashLifeTime') as number,
    };
    const jwtCreator = resolver.getServerResolver().getJwtCreator();
    return userAr.userAuthentification(userAuthQuery, jwtCreator);
  }
}
