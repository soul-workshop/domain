import { QueryService } from 'rilata/src/app/service/query-service';
import { ServiceResult } from 'rilata/src/app/service/types';
import { failure } from 'rilata/src/common/result/failure';
import { storeDispatcher } from 'rilata/src/app/async-store/store-dispatcher';
import { DomainUser } from 'rilata/src/app/caller';
import { UserRepository } from '../../../domain-object/user/repo';
import { RefreshTokenRequestDod, RefreshTokenServiceParams } from './s-params';
import { refreshTokenValidator } from './v-map';
import { UserAR } from '../../../domain-object/user/a-root';
import { UserRefreshDomainQuery } from '../../../domain-data/user/refresh/a-params';
import { SubjectModuleResolver } from '../../../resolver';

export class RefreshingTokenService extends QueryService<RefreshTokenServiceParams> {
  serviceName = 'refreshToken' as const;

  aRootName = 'UserAR' as const;

  protected supportedCallers = ['DomainUser'] as const;

  protected validator = refreshTokenValidator;

  protected async runDomain(
    requestDod: RefreshTokenRequestDod,
  ): Promise<ServiceResult<RefreshTokenServiceParams>> {
    const userRepo = UserRepository.instance(this.moduleResolver);
    const { userId } = storeDispatcher.getStoreOrExepction().caller as DomainUser;
    const result = await userRepo.getUser(userId);

    if (result.isFailure()) {
      return failure(result.value);
    }

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore - result is never
    const userAr = result.value as UserAR;

    const refreshToken: UserRefreshDomainQuery = {
      refreshToken: requestDod.attrs.refreshToken,
    };
    const resolver = this.moduleResolver as SubjectModuleResolver;
    const jwtVerifier = resolver.getServerResolver().getJwtVerifier();
    const jwtCreator = resolver.getServerResolver().getJwtCreator();
    return userAr.refreshToken(refreshToken, jwtVerifier, jwtCreator);
  }
}
