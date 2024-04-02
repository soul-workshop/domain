import { ModuleResolves } from 'rilata/src/app/module/module-resolves';
import { ModelModule } from './module';
import { ModelRepository } from './domain-object/model/repo';

export type ModelModuleResolves = ModuleResolves<ModelModule> & {
  moduleUrl: '/api/model-module/',
  telegramAuthHashLifetimeLimitAsSeconds?: number, // default 10 seconds
  authentificateBotToken: string,
  modelRepo: ModelRepository;
}

export const modelModuleResolves: Omit<
  ModelModuleResolves,
  'db' | 'busMessageRepo' | 'modelRepo' | 'authentificateBotToken'
  > = {
    moduleName: 'ModelModule',
    moduleUrl: '/api/model-module/',
  };
