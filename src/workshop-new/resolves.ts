import { ModuleResolves } from 'rilata/src/app/module/module-resolves';
import { WorkshopModule } from './module';
import { WorkshopRepository } from './domain-object/repo';

export type WorkshopModuleResolves = ModuleResolves<WorkshopModule> & {
  moduleUrl: '/api/model-module/',
 workshopRepo: WorkshopRepository;
}
