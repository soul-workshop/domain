import { QueryService } from 'rilata/src/app/service/query-service';
import { ServiceResult } from 'rilata/src/app/service/types';
import { success } from 'rilata/src/common/result/success';
import { failure } from 'rilata/src/common/result/failure';
import { GettingWorkshopServiceParams, getWorkshopRequesttDod } from './s-params';
import { gettingWorkshopValidator } from './v-map';
import { WorkshopRepository } from '../../../domain-object/repo';

export class GettingWorkshopService extends QueryService<GettingWorkshopServiceParams> {
  serviceName = 'getWorkshop' as const;

  aRootName = 'WorkshopAR' as const;

  protected supportedCallers = ['DomainUser'] as const;

  protected validator = gettingWorkshopValidator;

  protected async runDomain(
    requestDod: getWorkshopRequesttDod,
  ): Promise<ServiceResult<GettingWorkshopServiceParams>> {
    const repo = WorkshopRepository.instance(this.moduleResolver);
    const repoResult = await repo
      .getWorkshop(requestDod.attrs.workshopId);
    if (repoResult.isFailure()) return failure(repoResult.value);
    return success(repoResult.value);
  }
}
