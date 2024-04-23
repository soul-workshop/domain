import { ModuleResolves } from 'rilata/src/app/module/module-resolves';
import { FrontProxyModule } from './module';
import { WorkshopFacade } from '../workshop-new/facade';
import { SubjectFacade } from '../subject/facade';

export type FrontendProxyResolves = ModuleResolves<FrontProxyModule> & {
  moduleUrl: '/api/frontend-proxy-module/',
  subjectFacade: SubjectFacade,
  workshopFacade: WorkshopFacade,
}

export const frontendProxyModuleResolves: Pick<FrontendProxyResolves, 'moduleUrl' | 'moduleName'> = {
  moduleUrl: '/api/frontend-proxy-module/',
  moduleName: 'FrontProxyModule',
};
