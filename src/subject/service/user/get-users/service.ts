import { QueryService } from 'rilata/src/app/service/query-service';
import { RequestDodValidator, ServiceResult } from 'rilata/src/app/service/types';
import { success } from 'rilata/src/common/result/success';
import { GetUsersRequestDod, GetUsersServiceParams } from './s-params';
import { getUsersValidator } from './v-map';
import { UserRepository } from '../../../domain-object/user/repo';

export class GettingUsersService extends QueryService<GetUsersServiceParams> {
  aRootName: 'UserAR' = 'UserAR' as const;

  serviceName: 'getUsers' = 'getUsers' as const;

  protected supportedCallers: readonly ('ModuleCaller' | 'AnonymousUser' | 'DomainUser')[] = ['DomainUser'];

  protected validator: RequestDodValidator<GetUsersServiceParams> = getUsersValidator;

  protected async runDomain(
    requestDod: GetUsersRequestDod,
  ): Promise<ServiceResult<GetUsersServiceParams>> {
    const repo = UserRepository.instance(this.moduleResolver);
    const repoResult = await repo.getUsers(requestDod.attrs.userIds);
    return success(repoResult.map((user) => user.getAttrs()));
  }
}
