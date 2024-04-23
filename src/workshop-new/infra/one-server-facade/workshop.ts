import { GeneralModuleResolver } from 'rilata/src/app/module/types';
import { DomainUser, ModuleCaller } from 'rilata/src/app/caller';
import { UuidType } from 'rilata/src/common/types';
import { ServiceResult } from 'rilata/src/app/service/types';
import { dodUtility } from 'rilata/src/common/utils/domain-object/dod-utility';
import { WorkshopFacade } from '../../facade';
import { GettingWorkshopServiceParams, GetWorkshopRequestDod } from '../../service/workshop/get-workshop/s-params';
import { WorkshopModule } from '../../module';

export class WorkshopFacadeOneServerImpl implements WorkshopFacade {
  protected moduleResolver!: GeneralModuleResolver;

  init(resolver: GeneralModuleResolver): void {
    this.moduleResolver = resolver;
  }

  getWorkshop(workshopId: UuidType, caller: DomainUser):
  Promise<ServiceResult<GettingWorkshopServiceParams>> {
    const requestDod = dodUtility.getRequestDod<GetWorkshopRequestDod>('getWorkshop', { workshopId });
    const moduleCaller: ModuleCaller = {
      type: 'ModuleCaller',
      name: this.moduleResolver.getModuleName(),
      user: caller,
    };
    return this.moduleResolver
      .getServerResolver()
      .getServer()
      .getModule<WorkshopModule>('WorkshopModule')
      .executeService(requestDod, moduleCaller);
  }
}
