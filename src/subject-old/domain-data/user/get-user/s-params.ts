import { QueryServiceParams } from 'rilata/src/app/service/types';
import { UserId, UuidType } from 'rilata/src/common/types';
import { ErrorDod } from 'rilata/src/domain/domain-data/domain-types';
import { UserAttrs, UserParams } from '../params';

export type GetUserActionDod = {
  meta: {
    name: 'getUser',
    actionId: UuidType,
    domainType: 'action',
  }
  attrs: {
    userId: UserId
  },
}

export type GetingUserOut = UserAttrs;

type UserDoesNotExistLocale = {
    text: 'Такого пользователя не существует',
    hint: { userId: UserId },
}

export type UserDoesNotExistError = ErrorDod<UserDoesNotExistLocale, 'UserDoesNotExistError'>

export type GetingUserServiceParams = QueryServiceParams<
  UserParams, GetUserActionDod, GetingUserOut, UserDoesNotExistError
>
