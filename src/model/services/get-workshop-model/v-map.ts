/* eslint-disable function-paren-newline */
import { DtoFieldValidator } from 'rilata/src/domain/validator/field-validator/dto-field-validator';
import { ValidatorMap } from 'rilata/src/domain/validator/field-validator/types';
import { RequestDodValidator } from 'rilata/src/app/service/types';
import { GetWorkshopModelRequestDod, GettingWorkshopModelServiceParams } from './s-params';
import { modelAttrsVMap } from '../../domain-data/model/v-map';
import { workshopAttrsVMap } from '../../../workshop/domain-data/workshop/v-map';

const gettingWorkshopModelVMap: ValidatorMap<GetWorkshopModelRequestDod['attrs']> = {
  workshopId: workshopAttrsVMap.workshopId,
  modelId: modelAttrsVMap.modelId,
};

export const gettingWorkshopModelValidator: RequestDodValidator<
GettingWorkshopModelServiceParams
> = new DtoFieldValidator('getWorkshopModel', true, { isArray: false }, 'dto', gettingWorkshopModelVMap);
