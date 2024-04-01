import { UuidType } from 'rilata/src/common/types';
import { QueryServiceParams } from 'rilata/src/app/service/types';
import { OutputAggregateDataTransfer } from 'rilata/src/domain/domain-data/domain-types';
import { WorkshopAttrs, WorkshopParams } from '../../../domain-data/params';
import { WorkshopForUserDoesntExistError } from '../../../domain-data/repo-erros';

export type getWorkshopRequesttDod = {
    meta: {
        name: 'getWorkshop',
        requestId: UuidType,
        domainType: 'request',
      }
    attrs: {
        workshopId: UuidType,
    },
}

export type GetWorkshopModelOut = WorkshopAttrs;

export type GettingWorkshopServiceParams = QueryServiceParams<
  WorkshopParams,
  getWorkshopRequesttDod,
  GetWorkshopModelOut,
  WorkshopForUserDoesntExistError
>

export type WorkshopRDT = OutputAggregateDataTransfer<WorkshopParams>;
