import { AuthJwtPayload } from 'cy-core/src/types';
import { ModuleResolver } from 'rilata/src/app/module/module-resolver';
import { ServerResolver } from 'rilata/src/app/server/server-resolver';
import { ModuleResolveInstance } from 'rilata/src/app/resolves/types';
import { FrontProxyModule } from './module';
import { FrontendProxyResolves } from './resolves';
import { SubjectFacade } from '../subject/facade';
import { WorkshopFacade } from '../workshop-new/facade';

export class FrontendProxyModuleResolver extends ModuleResolver<
  AuthJwtPayload, FrontProxyModule, FrontendProxyResolves
> {
  // override without db.init()
  init(module: FrontProxyModule, serverResolver: ServerResolver<AuthJwtPayload>): void {
    this.module = module;
    this.serverResolver = serverResolver;
    this.resolves.subjectFacade.init(this);
    this.resolves.workshopFacade.init(this);
  }

  resolve(key: unknown): ModuleResolveInstance {
    throw this.getLogger().error('Method getRealisation not implemented.');
  }

  resolveRepo(key: unknown): ModuleResolveInstance {
    throw this.getLogger().error('not be called in read module');
  }

  resolveFacade(key: unknown): ModuleResolveInstance {
    if (key === SubjectFacade) return this.resolves.subjectFacade;
    if (key === WorkshopFacade) return this.resolves.workshopFacade;
    throw this.getLogger().error(`not find facade for key: ${key}`);
  }
}
