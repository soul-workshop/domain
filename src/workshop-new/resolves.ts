import { ModuleResolves } from 'rilata/src/app/module/module-resolves';
import { WorkshopModule } from './module';
import { WorkshopRepository } from './domain-object/repo';

export type WorkshopModuleResolves = ModuleResolves<WorkshopModule> & {
  moduleUrl: '/api/model-module/',
 workshopRepo: WorkshopRepository;
}

export const workshopModuleResolves: Pick<WorkshopModuleResolves, 'moduleUrl' | 'moduleName'> = {
  moduleUrl: '/api/model-module/',
  moduleName: 'WorkshopModule',
};
