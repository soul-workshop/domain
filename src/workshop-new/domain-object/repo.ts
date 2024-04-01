import { Repositoriable } from 'rilata/src/app/resolves/repositoriable';
import { UuidType } from 'rilata/src/common/types';
import { Result } from 'rilata/src/common/result/types';
import { WorkshopAttrs } from '../domain-data/params';
import { WorkshopForUserDoesntExistError } from '../domain-data/repo-erros';
import { WorkshopModuleResolver } from '../resolver';

export interface WorkshopRepository {
  init(resolver: WorkshopModuleResolver): void
  getWorkshop(id: UuidType): Promise<Result<WorkshopForUserDoesntExistError, WorkshopAttrs>>;
}

export const WorkshopRepository = {
  instance(repoResolver: Repositoriable): WorkshopRepository {
    return repoResolver.resolveRepo(WorkshopRepository) as WorkshopRepository;
  },
};
