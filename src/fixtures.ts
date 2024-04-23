import { CraftyardServer } from 'cy-core/src/server/server';
import { CraftyardServerStarter } from 'cy-core/src/server/starter';
import { SubjectModule } from './subject/module';
import { SubjectModuleResolver } from './subject/resolver';
import { CraftyardServerModules } from './types';
import { SubjectModuleFixtures } from './subject/fixtures';
import { WorkshopModule } from './workshop-new/module';
import { WorkshopModuleResolver } from './workshop-new/resolver';
import { WorkshopModuleFixtures } from './workshop-new/fixture';
import { FrontProxyModule } from './front-proxy/module';
import { FrontendProxyModuleResolver } from './front-proxy/resolver';
import { FrontProxyModuleFixtures } from './front-proxy/fixtures';

export namespace DomainServerFixtures {
  export function getTestServer<M extends CraftyardServerModules>(
    runModules: M['moduleName'][] | 'all',
  ): CraftyardServer {
    process.env.NODE_ENV = 'test';
    process.env.JWT_SECRET_KEY = 'your-256-bit-secret';
    const starter = new CraftyardServerStarter<CraftyardServerModules>([
      [SubjectModule, SubjectModuleResolver, SubjectModuleFixtures.subjectModuleTestResolves],
      [WorkshopModule, WorkshopModuleResolver, WorkshopModuleFixtures.workshopResolves],
      [FrontProxyModule, FrontendProxyModuleResolver, FrontProxyModuleFixtures.FrontProxyResolves],
    ]);
    return starter.start(runModules) as CraftyardServer;
  }
}
