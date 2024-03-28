import { ModuleResolver } from 'rilata/src/app/module/module-resolver';
import { ModuleResolveInstance } from 'rilata/src/app/resolves/types';
import { AuthJwtPayload } from 'cy-core/src/types';
import { SubjectModule } from './module';
import { SubjectModuleResolves } from './resolves';
import { UserRepository } from './domain-object/user/repo';

export class SubjectModuleResolver extends ModuleResolver<
  AuthJwtPayload, SubjectModule, SubjectModuleResolves
> {
  resolve(key: unknown): unknown {
    if (key === 'botToken') return this.resolves.authentificateBotToken;
    if (key === 'authHashLifeTime') return this.resolves.telegramAuthHashLifetimeLimitAsSeconds ?? 10;
    throw this.getLogger().error(`not finded key by: ${key}`, key);
  }

  resolveRepo(key: unknown): ModuleResolveInstance {
    if (key === UserRepository) return this.resolves.userRepo;
    throw this.getLogger().error(`not finded key by: ${key}`, key);
  }

  resolveFacade(...args: unknown[]): ModuleResolveInstance {
    throw new Error('Method not implemented.');
  }
}
