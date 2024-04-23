import { GeneralModuleResolver } from 'rilata/src/app/module/types';
import { UuidType } from 'rilata/src/common/types';
import { DomainUser, ModuleCaller } from 'rilata/src/app/caller';
import { ServiceResult } from 'rilata/src/app/service/types';
import { dodUtility } from 'rilata/src/common/utils/domain-object/dod-utility';
import { GetUserRequestDod, GetUserServiceParams } from '../../service/user/get-user/s-params';
import { SubjectFacade } from '../../facade';
import { SubjectModule } from '../../module';

export class SubjectFacadeOneServerImpl implements SubjectFacade {
  protected moduleResolver!: GeneralModuleResolver;

  init(resolver: GeneralModuleResolver): void {
    this.moduleResolver = resolver;
  }

  getUser(userId: UuidType, caller: DomainUser): Promise<ServiceResult<GetUserServiceParams>> {
    const requestDod = dodUtility.getRequestDod<GetUserRequestDod>('getUser', { userId });
    const moduleCaller: ModuleCaller = {
      type: 'ModuleCaller',
      name: this.moduleResolver.getModuleName(),
      user: caller,
    };
    return this.moduleResolver
      .getServerResolver()
      .getServer()
      .getModule<SubjectModule>('SubjectModule')
      .executeService(requestDod, moduleCaller);
  }
}
