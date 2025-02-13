import { UuidType } from 'rilata/src/common/types';
import { DomainMeta } from 'rilata/src/domain/domain-data/domain-types';
import { AggregateRootDataParams } from 'rilata/src/domain/domain-data/params-types';
import { TelegramId } from 'cy-core/src/types';
import { UserAuthentificationActionParams } from './authentificate/a-params';

export type UserProfile = {
  firstName: string,
  lastName: string,
}

export type UserType = 'employee' | 'client';

export type UserAttrs = {
  userId: UuidType,
  telegramId: TelegramId,
  type: UserType,
  userProfile: UserProfile,
}

export type UserMeta = DomainMeta<'UserAR', 'userId'>;

export type UserParams = AggregateRootDataParams<
  UserAttrs, UserMeta, UserAuthentificationActionParams, []
>;
