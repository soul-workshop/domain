import { AuthJwtPayload } from 'cy-core/src/types';
import { Module } from 'rilata/src/app/module/module';
import { ModuleType } from 'rilata/src/app/module/types';
import { GeneraQueryService, GeneralCommandService, GeneralEventService } from 'rilata/src/app/service/types';
import { UserAuthentificationService } from './service/user/authentificate/service';

export class SubjectModule extends Module<AuthJwtPayload> {
  moduleName = 'SubjectModule' as const;

  moduleType: ModuleType = 'common-module' as const;

  queryServices: GeneraQueryService[] = [
    new UserAuthentificationService(),
  ];

  commandServices: GeneralCommandService[] = [];

  eventServices: GeneralEventService[] = [];
}
