import { GeneralModuleResolver } from 'rilata/src/app/module/types';
import { DomainUser } from 'rilata/src/app/caller';
import { ServiceResult } from 'rilata/src/app/service/types';
import { Facadable } from 'rilata/src/app/resolves/facadable';
import { GetUserServiceParams } from './service/user/get-user/s-params';

export interface SubjectFacade {
    init(resolver: GeneralModuleResolver): void
    getUser(userId: string, caller: DomainUser):
    Promise<ServiceResult<GetUserServiceParams>>
}

export const SubjectFacade = {
  instance(resolver: Facadable): SubjectFacade {
    return resolver.resolveFacade(SubjectFacade) as SubjectFacade;
  },
};
