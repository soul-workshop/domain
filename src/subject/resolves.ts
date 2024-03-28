import { ModuleResolves } from 'rilata/src/app/module/module-resolves';
import { SubjectModule } from './module';
import { UserRepository } from './domain-object/user/repo';

export type SubjectModuleResolves = ModuleResolves<SubjectModule> & {
  moduleUrl: '/api/subject-module/',
  telegramAuthHashLifetimeLimitAsSeconds?: number, // default 10 seconds
  authentificateBotToken: string,
  userRepo: UserRepository,
}

export const subjectModuleResolves: Omit<
  SubjectModuleResolves,
  'db' | 'busMessageRepo' | 'userRepo' | 'authentificateBotToken'
> = {
  moduleName: 'SubjectModule',
  moduleUrl: '/api/subject-module/',
};
