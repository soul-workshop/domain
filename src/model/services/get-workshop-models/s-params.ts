import { QueryServiceParams } from 'rilata/src/app/service/types';
import { UuidType } from 'rilata/src/common/types';
import { ModelParams, ModelAttrs } from '../../domain-data/model/params';

export type GetWorkshopModelsRequestDod = {
  meta: {
    name: 'getWorkshopModels',
    requestId: UuidType,
    domainType: 'request',
  }
  attrs:{
    workshopId: UuidType
  },
}
export type GetWorkshopModelsOut = ModelAttrs[];

export type GetingWorkshopModelsServiceParams = QueryServiceParams<
  ModelParams, GetWorkshopModelsRequestDod, GetWorkshopModelsOut, never
>
