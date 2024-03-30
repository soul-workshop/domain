import { AggregateFactory } from 'rilata/src/domain/domain-object/aggregate-factory';
import { AssertionException } from 'rilata/src/common/exeptions';
import { Caller } from 'rilata/src/app/caller';
import { UserAttrs, UserParams } from '../../domain-data/user/params';
import { UserAR } from './a-root';

export class UserFactory extends AggregateFactory<UserParams> {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  create(caller: Caller, action: unknown): UserAR {
    throw new AssertionException('not implemented');
  }

  restore(userAttrs: UserAttrs, version: number): UserAR {
    return new UserAR(userAttrs, version, this.logger);
  }
}
