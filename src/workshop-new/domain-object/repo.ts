import { Repositoriable } from 'rilata/src/app/resolves/repositoriable';
import { UserId } from 'rilata/src/common/types';
import { Result } from 'rilata/src/common/result/types';
import { WorkshopAttrs } from '../domain-data/params';
import { WorkshopForUserDoesntExistError } from '../domain-data/repo-erros';
import { WorkshoModuleResolver } from '../resolver';

export interface WorkshopRepository {
  init(resolver: WorkshoModuleResolver): void
  getWorshop(userId:UserId): Promise<Result<WorkshopForUserDoesntExistError, WorkshopAttrs>>;
  findById(workshopId: WorkshopAttrs['workshopId']): Promise<WorkshopAttrs | undefined>
}

export const WorkshopRepository = {
  instance(repoResolver: Repositoriable): WorkshopRepository {
    return repoResolver.resolveRepo(WorkshopRepository) as WorkshopRepository;
  },
};
