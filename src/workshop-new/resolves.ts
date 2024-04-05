import { ModuleResolves } from 'rilata/src/app/module/module-resolves';
import { WorkshopModule } from './module';
import { WorkshopRepository } from './domain-object/repo';
import { WorkshopFacade } from './facade';

export type WorkshopModuleResolves = ModuleResolves<WorkshopModule> & {
  moduleUrl: '/api/workshop-module/',
 workshopRepository: WorkshopRepository;
}

export const workshopModuleResolves: Pick<WorkshopModuleResolves, 'moduleUrl' | 'moduleName'> = {
  moduleUrl: '/api/workshop-module/',
  moduleName: 'WorkshopModule',
};
