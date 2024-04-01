import { Location } from 'cy-core/src/types';
import { UserId, UuidType } from 'rilata/src/common/types';
import { DomainMeta } from 'rilata/src/domain/domain-data/domain-types';
import { AggregateRootDataParams } from 'rilata/src/domain/domain-data/params-types';

export type WorkshopAttrs = {
  workshopId: UuidType,
  name: string,
  city: string,
  address: string,
  location: Location,
  employeesRole: UserId[]
}

export type WorkshopMeta = DomainMeta<'WorkshopAR', 'workshopId'>;

export type WorkshopParams = AggregateRootDataParams<
  WorkshopAttrs, WorkshopMeta, never, []
>;
