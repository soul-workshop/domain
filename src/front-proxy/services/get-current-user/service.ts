import { QueryService } from 'rilata/src/app/service/query-service';
import { RequestDodValidator, ServiceResult } from 'rilata/src/app/service/types';
import { success } from 'rilata/src/common/result/success';
import { storeDispatcher } from 'rilata/src/app/async-store/store-dispatcher';
import { GettingCurrentUserServiceParams } from './s-params';
import { getCurrentUserValidator } from './v-map';
import { WorkshopFacade } from '../../../workshop-new/facade';
import { SubjectFacade } from '../../../subject/facade';

export class GettingCurrentUserService extends QueryService<GettingCurrentUserServiceParams> {
  aRootName: 'UserAR' = 'UserAR' as const;

  serviceName: 'getCurrentUser' = 'getCurrentUser' as const;

  protected supportedCallers = ['DomainUser', 'ModuleCaller'] as const;

  protected validator:
  RequestDodValidator<GettingCurrentUserServiceParams> = getCurrentUserValidator;

  protected async runDomain(): Promise<ServiceResult<GettingCurrentUserServiceParams>> {
    const workshopId = '6f91d305-3f4b-4a3d-9bef-72cf3757cc33';
    const store = storeDispatcher.getStoreOrExepction();
    if (store.caller.type !== 'DomainUser') {
      throw this.logger.error('Пользователь не доменный пользователь');
    }
    const workshopFacade = WorkshopFacade.instance(this.moduleResolver);
    const workshopResult = (await workshopFacade.getWorkshop(workshopId, store.caller));
    if (workshopResult.isFailure()) {
      throw await this.logger.error(
        `Workshop-a с workshopId: ${workshopId} не существует`,
        { result: workshopResult.value },
      );
    }
    const { userId } = store.caller;
    const subjectFacade = SubjectFacade.instance(this.moduleResolver);
    const userResult = await subjectFacade.getUser(userId, store.caller);
    if ((userResult).isFailure()) {
      throw await this.logger.error(
        `Пользователь с id: ${userId} подписанным токеном авторизации в базе данных не существует`,
        { result: workshopResult.value },
      );
    }
    return success({
      ...userResult.value,
      workshopName: workshopResult.value.name,
      workshopId: workshopResult.value.workshopId,
    });
  }
}
