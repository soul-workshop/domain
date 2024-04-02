import { UuidType } from 'rilata/src/common/types';
import { CommandServiceParams } from 'rilata/src/app/service/types';
import { ModelParams } from '../../domain-data/model/params';
import { AddModelOut, AddedModelEvent } from '../../domain-data/model/add-model/a-params';
import { ModelNameAlreadyExistsError, UserMustBeModelerError } from '../../domain-object/model/repo-errors';

export type ModelRequestDOD = {
    meta: {
        name: 'addModel',
        requestId: UuidType,
        domainType: 'request',
      }
    attrs: {
        name: string,
        category: string,
        workshopId: UuidType,
    },
}

export type AddModelErrors = ModelNameAlreadyExistsError | UserMustBeModelerError;

export type AddModelServiceParams = CommandServiceParams<
    ModelParams,
    ModelRequestDOD,
    AddModelOut,
    AddModelErrors,
    AddedModelEvent[]
>;
