import { ModuleResolver } from 'rilata/src/app/module/module-resolver';
import { ModuleResolveInstance } from 'rilata/src/app/resolves/types';
import { AuthJwtPayload } from 'cy-core/src/types';
import { AuthModule } from './module';
import { AuthModuleResolves } from './resolves';

export class AuthModuleResolver extends ModuleResolver<
  AuthJwtPayload, AuthModule, AuthModuleResolves
> {
  getRealisation(key: unknown): unknown {
    if (key === 'botToken') return this.resolves.authentificateBotToken;
    if (key === 'authHashLifeTime') return this.resolves.telegramAuthHashLifetimeLimitAsSeconds ?? 10;
    throw Error(`not finded key by: ${key}`);
  }

  getRepository(...args: unknown[]): ModuleResolveInstance {
    throw new Error('Method not implemented.');
  }

  getFacade(...args: unknown[]): ModuleResolveInstance {
    throw new Error('Method not implemented.');
  }
}
