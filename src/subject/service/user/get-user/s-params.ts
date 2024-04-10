import { UserId, UuidType } from 'rilata/src/common/types';
import { ErrorDod, RequestDod } from 'rilata/src/domain/domain-data/domain-types';
import { QueryServiceParams } from 'rilata/src/app/service/types';
import { UserAttrs, UserParams } from '../../../domain-data/user/params';

export type GetUserRequestDodAttrs = {
  userId: UuidType,
}

export type GetUserRequestDod = RequestDod<GetUserRequestDodAttrs, 'getUser'>

export type GetUserOut = UserAttrs

type UserDoesNotExistLocale = {
  name: 'UserDoesNotExistError',
  text: 'Такого пользователя не существует',
  hint: { userId: UserId },
}

export type UserDoesNotExistError = ErrorDod<'UserDoesNotExistError', UserDoesNotExistLocale>

export type GetUserServiceParams = QueryServiceParams<
  UserParams,
  GetUserRequestDod,
  GetUserOut,
  UserDoesNotExistError
>
