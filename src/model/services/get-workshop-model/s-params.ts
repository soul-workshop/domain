import { QueryServiceParams } from 'rilata/src/app/service/types';
import { UuidType } from 'rilata/src/common/types';
import { ModelParams, ModelAttrs } from '../../domain-data/model/params';
import { ModelIsNotExistError, WorkshopIsNotExistError } from '../../domain-object/model/repo-errors';

export type GetWorkshopModelRequestDod = {
  meta: {
    name: 'getWorkshopModel',
    requestId: UuidType,
    domainType: 'request',
  }
 attrs:{
  workshopId: UuidType,
  modelId: UuidType,
 },
}

export type GetWorkshopModelOut = ModelAttrs;

export type GettingWorkshopModelServiceParams = QueryServiceParams<
  ModelParams,
  GetWorkshopModelRequestDod,
  GetWorkshopModelOut,
  ModelIsNotExistError | WorkshopIsNotExistError
>
