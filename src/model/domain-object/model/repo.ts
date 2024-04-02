import { Repositoriable } from 'rilata/src/app/resolves/repositoriable';
import { Result } from 'rilata/src/common/result/types';
import { ServiceResult } from 'rilata/src/app/service/types';
import { UuidType } from 'rilata/src/common/types';
import { ModelAR } from './a-root';
import { GettingWorkshopModelServiceParams } from '../../services/get-workshop-model/s-params';
import { ModelAttrs } from '../../domain-data/model/params';
import { ModelModuleResolver } from '../../resolver';
import { ModelNameAlreadyExistsError } from './repo-errors';

export interface ModelRepository {
  init(resolver: ModelModuleResolver): void
  addModel(model: ModelAR): Promise<Result<ModelNameAlreadyExistsError, undefined>>
  // eslint-disable-next-line max-len
  getWorkshopModel(workshopId: UuidType, modelId: UuidType): Promise<ServiceResult<GettingWorkshopModelServiceParams>>;
  getWorkshopModels(workshopId:UuidType): Promise<ModelAttrs[]>;
}

export const ModelRepository = {
  instance(resolver: Repositoriable): ModelRepository {
    return resolver.getRepository(ModelRepository) as ModelRepository;
  },
};
