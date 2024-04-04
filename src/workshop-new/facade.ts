import { GeneralModuleResolver } from 'rilata/src/app/module/types';
import { ServiceResult } from 'rilata/src/app/service/types';
import { DomainUser } from 'rilata/src/app/caller';
import { Facadable } from 'rilata/src/app/resolves/facadable';
import { GettingWorkshopServiceParams } from './service/workshop/get-workshop/s-params';

export interface WorkshopFacade {
  init(resolver: GeneralModuleResolver): void
  getWorkshop(workshopId: string, caller: DomainUser):
  Promise<ServiceResult<GettingWorkshopServiceParams>>
}

export const WorkshopFacade = {
  instance(resolver: Facadable): WorkshopFacade {
    return resolver.resolveFacade(WorkshopFacade) as WorkshopFacade;
  },
};
