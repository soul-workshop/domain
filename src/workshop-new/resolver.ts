import { AuthJwtPayload } from 'cy-core/src/types';
import { ModuleResolver } from 'rilata/src/app/module/module-resolver';
import { ModuleResolveInstance } from 'rilata/src/app/resolves/types';
import { WorkshopModule } from './module';
import { WorkshopModuleResolves } from './resolves';
import { WorkshopRepository } from './domain-object/repo';

export class WorkshopModuleResolver extends ModuleResolver<
AuthJwtPayload, WorkshopModule, WorkshopModuleResolves> {
  resolve(...args: unknown[]): unknown {
    throw new Error('Method not implemented.');
  }

  resolveRepo(key: unknown): ModuleResolveInstance {
    if (key === WorkshopRepository) return this.resolves.workshopRepository;
    throw new Error('репозитория по этому ключу не найден.');
  }

  resolveFacade(...args: unknown[]): ModuleResolveInstance {
    throw new Error('Method not implemented.');
  }
}
