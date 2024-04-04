import { QueryServiceParams } from 'rilata/src/app/service/types';
import { UuidType } from 'rilata/src/common/types';
import { UserAttrs, UserParams } from '../../../domain-data/user/params';
import { WorkshopAttrs } from '../../../../workshop/domain-data/workshop/params';

export type GetCurrentUserRequestDod = {
    meta: {
        name: 'getCurrentUser',
        requestId: UuidType,
    domainType: 'request',
  },
  attrs: Record<string, never>,
}
export type CurrentUser = UserAttrs & {
  workshopName: WorkshopAttrs['name'];
  workshopId: WorkshopAttrs['workshopId'];
};
export type GettingCurrentUserOut = CurrentUser;
export type GettingCurrentUserServiceParams = QueryServiceParams<
UserParams, GetCurrentUserRequestDod, GettingCurrentUserOut, never
>
