import { AuthJwtPayload } from 'cy-core/src/types';
import { ModuleResolver } from 'rilata/src/app/module/module-resolver';
import { ModuleResolveInstance } from 'rilata/src/app/resolves/types';
import { WorkshopModule } from './module';
import { WorkshopModuleResolves } from './resolves';

export class WorkshoModuleResolver extends ModuleResolver<
AuthJwtPayload, WorkshopModule, WorkshopModuleResolves> {
  resolve(...args: unknown[]): unknown {
    throw new Error('Method not implemented.');
  }

  resolveRepo(...args: unknown[]): ModuleResolveInstance {
    throw new Error('Method not implemented.');
  }

  resolveFacade(...args: unknown[]): ModuleResolveInstance {
    throw new Error('Method not implemented.');
  }
}
