import { ValidatorMap } from 'rilata/src/domain/validator/field-validator/types';
import { RequestDodValidator } from 'rilata/src/app/service/types';
import { DtoFieldValidator } from 'rilata/src/domain/validator/field-validator/dto-field-validator';
import { GettingWorkshopServiceParams, getWorkshopRequesttDod } from './s-params';
import { workshopAttrsVMap } from '../../../domain-data/v-map';

const gettingWorkshopVMap: ValidatorMap<getWorkshopRequesttDod['attrs']> = {
  workshopId: workshopAttrsVMap.workshopId,
};
export const gettingWorkshopValidator: RequestDodValidator<
GettingWorkshopServiceParams
> = new DtoFieldValidator('getWorkshop', true, { isArray: false }, 'dto', gettingWorkshopVMap);
