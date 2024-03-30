import { CraftyardServer } from 'cy-core/src/server/server';
import { CraftyardServerStarter } from 'cy-core/src/server/starter';
import { SubjectModule } from './subject/module';
import { SubjectModuleResolver } from './subject/resolver';
import { CraftyardServerModules } from './types';
import { SubjectModuleFixtures } from './subject/fixtures';

export namespace DomainServerFixtures {
  export function getTestServer<M extends CraftyardServerModules>(
    runModules: M['moduleName'][] | 'all',
  ): CraftyardServer {
    process.env.NODE_ENV = 'test';
    process.env.JWT_SECRET_KEY = 'your-256-bit-secret';
    const starter = new CraftyardServerStarter<CraftyardServerModules>([
      [SubjectModule, SubjectModuleResolver, SubjectModuleFixtures.subjectModuleTestResolves],
    ]);
    return starter.start(runModules) as CraftyardServer;
  }
}
