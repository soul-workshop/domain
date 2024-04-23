import { UuidType } from 'rilata/src/common/types';
import { RequestDod } from 'rilata/src/domain/domain-data/domain-types';
import { QueryServiceParams } from 'rilata/src/app/service/types';
import { UserAttrs, UserParams } from '../../../domain-data/user/params';

export type GetUsersRequestDodAttrs = {
  userIds: UuidType[],
}

export type GetUsersRequestDod = RequestDod<GetUsersRequestDodAttrs, 'getUsers'>

export type GetUsersOut = UserAttrs[]

export type GetUsersServiceParams = QueryServiceParams<
  UserParams,
  GetUsersRequestDod,
  GetUsersOut,
  never
>
