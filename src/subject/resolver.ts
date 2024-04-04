import { ModuleResolver } from 'rilata/src/app/module/module-resolver';
import { ModuleResolveInstance } from 'rilata/src/app/resolves/types';
import { AuthJwtPayload } from 'cy-core/src/types';
import { ServerResolver } from 'rilata/src/app/server/server-resolver';
import { SubjectModule } from './module';
import { SubjectModuleResolves } from './resolves';
import { UserRepository } from './domain-object/user/repo';
import { WorkshopFacade } from '../workshop-new/facade';

export class SubjectModuleResolver extends ModuleResolver<
  AuthJwtPayload, SubjectModule, SubjectModuleResolves
> {
  init(module: SubjectModule, serverResolver: ServerResolver<AuthJwtPayload>): void {
    // override without db.init()
    this.module = module;
    this.resolves.workshopFacade.init(this);
    this.serverResolver = serverResolver;
  }

  resolve(key: unknown): unknown {
    if (key === 'botToken') return this.resolves.authentificateBotToken;
    if (key === 'authHashLifeTime') return this.resolves.telegramAuthHashLifetimeLimitAsSeconds ?? 10;
    throw this.getLogger().error(`not finded key by: ${key}`, key);
  }

  resolveRepo(key: unknown): ModuleResolveInstance {
    if (key === UserRepository) return this.resolves.userRepo;
    throw this.getLogger().error(`not finded key by: ${key}`, key);
  }

  resolveFacade(key: unknown[]): ModuleResolveInstance {
    if (key === WorkshopFacade) return this.resolves.workshopFacade;
    throw this.getLogger().error(`not find facade for key: ${key}`);
  }
}
