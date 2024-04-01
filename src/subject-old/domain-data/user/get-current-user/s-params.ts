import { QueryServiceParams } from 'rilata/src/app/service/types';
import { UuidType } from 'rilata/src/common/types';
import { UserAttrs, UserParams } from '../params';
import { WorkshopAttrs } from '../../../../workshop/domain-data/workshop/params';

export type GetCurrentUserActionDod = {
  meta: {
    name: 'getCurrentUser',
    actionId: UuidType,
    domainType: 'action',
  },
attrs: Record<string, never>,
}
export type CurrentUser = UserAttrs & {
  workshopName: WorkshopAttrs['name'];
  workshopId: WorkshopAttrs['workshopId'];
};
export type GettingCurrentUserOut = CurrentUser;
export type GettingCurrentUserServiceParams = QueryServiceParams<
  UserParams, GetCurrentUserActionDod, GettingCurrentUserOut, never
>
