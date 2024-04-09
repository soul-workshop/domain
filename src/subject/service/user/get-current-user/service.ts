import { QueryService } from 'rilata/src/app/service/query-service';
import { RequestDodValidator, ServiceResult } from 'rilata/src/app/service/types';
import { success } from 'rilata/src/common/result/success';
import { storeDispatcher } from 'rilata/src/app/async-store/store-dispatcher';
import { DomainUser } from 'rilata/src/app/caller';
import { GettingCurrentUserServiceParams } from './s-params';
import { getCurrentUserValidator } from './v-map';
import { UserRepository } from '../../../domain-object/user/repo';
import { WorkshopFacade } from '../../../../workshop-new/facade';

export class GettingCurrentUserService extends QueryService<GettingCurrentUserServiceParams> {
  aRootName: 'UserAR' = 'UserAR' as const;

  serviceName: 'getCurrentUser' = 'getCurrentUser' as const;

  protected supportedCallers = ['DomainUser'] as const;

  protected validator:
  RequestDodValidator<GettingCurrentUserServiceParams> = getCurrentUserValidator;

  protected async runDomain(): Promise<ServiceResult<GettingCurrentUserServiceParams>> {
    const workshopId = '6f91d305-3f4b-4a3d-9bef-72cf3757cc33';
    const store = storeDispatcher.getStoreOrExepction();
    if (store.caller.type !== 'DomainUser') {
      throw this.logger.error('Пользователь не доменный пользователь');
    }
    const caller = store.caller as DomainUser;
    const { userId } = caller;
    const repoUsers = UserRepository.instance(this.moduleResolver);
    const result = await repoUsers.getUser(userId);
    if ((result).isFailure()) {
      throw await this.logger.error(`Пользователь с id: ${userId} подписанным токеном авторизации в базе данных не существует`);
    }
    const repoWorkshop = WorkshopFacade.instance(this.moduleResolver);
    const workshopAttrs = (await repoWorkshop.getWorkshop(workshopId, store.caller));
    if (!workshopAttrs) {
      throw await this.logger.error(`Workshop-a с workshopId: ${workshopId} не существует`);
    }
    return success({
      ...result.value.getAttrs(),
      workshopName: workshopAttrs.value.name,
      workshopId: workshopAttrs.value.name,
    });
  }
}
