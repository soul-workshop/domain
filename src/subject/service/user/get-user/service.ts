import { QueryService } from 'rilata/src/app/service/query-service';
import { RequestDodValidator, ServiceResult } from 'rilata/src/app/service/types';
import { dodUtility } from 'rilata/src/common/utils/domain-object/dod-utility';
import { failure } from 'rilata/src/common/result/failure';
import { success } from 'rilata/src/common/result/success';
import { GetUserRequestDod, GetUserServiceParams } from './s-params';
import { getUserValidator } from './v-map';
import { UserRepository } from '../../../domain-object/user/repo';

export class GettingUserService extends QueryService<GetUserServiceParams> {
  public aRootName: 'UserAR' = 'UserAR' as const;

  public serviceName: 'getUser' = 'getUser' as const;

  protected supportedCallers = ['DomainUser', 'ModuleCaller'] as const;

  protected validator: RequestDodValidator<GetUserServiceParams> = getUserValidator;

  protected async runDomain(
    requestDod: GetUserRequestDod,
  ): Promise<ServiceResult<GetUserServiceParams>> {
    const repo = UserRepository.instance(this.moduleResolver);
    const result = await repo.getUser(requestDod.attrs.userId);
    if (result.isFailure()) {
      return failure(dodUtility.getDomainError('UserDoesNotExistError', 'Такого пользователя не существует', { userId: requestDod.attrs.userId }));
    }
    return success(result.value.getAttrs());
  }
}
