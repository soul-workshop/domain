/* eslint-disable @typescript-eslint/no-unused-vars */
import { AuthJwtPayload } from 'cy-core/src/types';
import { ModuleResolveInstance } from 'rilata/src/app/resolves/types';
import { BusMessageRepository } from 'rilata/src/app/database/bus-message-repository';
import { ModuleResolver } from 'rilata/src/app/module/module-resolver';
import { EventRepository } from 'rilata/src/app/database/event-repository';
import { ModelModule } from './module';
import { ModelRepository } from './domain-object/model/repo';
import { ModelModuleResolves } from './resolves';

export class ModelModuleResolver extends ModuleResolver<
  AuthJwtPayload, ModelModule, ModelModuleResolves
> {
  resolve(key: unknown): unknown {
    if (key === 'botToken') return this.resolves.authentificateBotToken;
    if (key === 'authHashLifeTime') return this.resolves.telegramAuthHashLifetimeLimitAsSeconds ?? 10;
    throw this.getLogger().error(`not finded key by: ${key}`, key);
  }

  resolveRepo(key: unknown): ModuleResolveInstance {
    if (key === ModelRepository) return this.resolves.modelRepo;
    throw this.getLogger().error(`not finded key by: ${key}`, key);
  }

  resolveFacade(...args: unknown[]): ModuleResolveInstance {
    throw new Error('Method not implemented.');
  }
}
