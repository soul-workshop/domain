import { ModuleResolves } from 'rilata/src/app/module/module-resolves';
import { AuthModule } from './module';

export type AuthModuleResolves = ModuleResolves<AuthModule> & {
  moduleUrl: '/api/auth-module/',
  telegramAuthHashLifetimeLimitAsSeconds?: number, // default 10 seconds
  authentificateBotToken: string,
  userRepo: unknown,
}
