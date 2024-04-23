/* eslint-disable import/no-duplicates */
import { FrontendProxyResolves } from './resolves';
import { frontendProxyModuleResolves } from './resolves';
import { SubjectFacadeOneServerImpl } from '../subject/infra/one-server-facade/subject';
import { WorkshopFacadeOneServerImpl } from '../workshop-new/infra/one-server-facade/workshop';

export namespace FrontProxyModuleFixtures {
  export const FrontProxyResolves: FrontendProxyResolves = {
    ...frontendProxyModuleResolves,
    get db(): never {
      throw Error('read module not supported work with database, only facades');
    },
    get busMessageRepo(): never {
      throw Error('read module not supported work with database, only facades');
    },
    subjectFacade: new SubjectFacadeOneServerImpl(),
    workshopFacade: new WorkshopFacadeOneServerImpl(),
  };
}
