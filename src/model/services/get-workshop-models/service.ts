import { QueryService } from 'rilata/src/app/service/query-service';
import { ServiceResult } from 'rilata/src/app/service/types';
import { success } from 'rilata/src/common/result/success';
import { GetWorkshopModelsRequestDod, GetingWorkshopModelsServiceParams } from './s-params';
import { getingWorkshopModelsValidator } from './v-map';
import { ModelRepository } from '../../domain-object/model/repo';

export class GettingWorkshopModelsService extends QueryService<GetingWorkshopModelsServiceParams> {
  serviceName = 'getWorkshopModels' as const;

  aRootName = 'ModelAR' as const;

  protected supportedCallers = ['DomainUser'] as const;

  protected validator = getingWorkshopModelsValidator;

  protected async runDomain(
    requestDod: GetWorkshopModelsRequestDod,
  ): Promise<ServiceResult<GetingWorkshopModelsServiceParams>> {
    const repo = ModelRepository.instance(this.moduleResolver);
    return success(await repo.getWorkshopModels(requestDod.attrs.workshopId));
  }
}
