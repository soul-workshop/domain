import { QueryServiceParams } from 'rilata/src/app/service/types';
import { UserId, UuidType } from 'rilata/src/common/types';
import { UserAttrs, UserParams } from '../params';

export type GetUsersActionDod = {
  meta: {
    name: 'getUsers',
    actionId: UuidType,
    domainType: 'action',
  }
  attrs: {
    userIds: UserId[]
  },
}

export type GetingUsersOut = UserAttrs[];

export type GetingUsersServiceParams = QueryServiceParams<
  UserParams, GetUsersActionDod, GetingUsersOut, never
>
