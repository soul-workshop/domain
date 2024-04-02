/* eslint-disable function-paren-newline */
import { DtoFieldValidator } from 'rilata/src/domain/validator/field-validator/dto-field-validator';
import { ValidatorMap } from 'rilata/src/domain/validator/field-validator/types';
import { RequestDodValidator } from 'rilata/src/app/service/types';
import { workshopAttrsVMap } from '../../../workshop/domain-data/workshop/v-map';
import { GetWorkshopModelsRequestDod, GetingWorkshopModelsServiceParams } from './s-params';

const getingWorkshopModelsVMap: ValidatorMap<GetWorkshopModelsRequestDod['attrs']> = {
  workshopId: workshopAttrsVMap.workshopId,
};

export const getingWorkshopModelsValidator: RequestDodValidator<GetingWorkshopModelsServiceParams
> = new DtoFieldValidator('getWorkshopModels', true, { isArray: false }, 'dto', getingWorkshopModelsVMap);
