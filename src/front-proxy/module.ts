import { Module } from 'rilata/src/app/module/module';
import { AuthJwtPayload } from 'cy-core/src/types';
import { ModuleType } from 'rilata/src/app/module/types';
import { GeneraQueryService, GeneralCommandService, GeneralEventService } from 'rilata/src/app/service/types';
import { GettingCurrentUserService } from './services/get-current-user/service';

export class FrontProxyModule extends Module<AuthJwtPayload> {
  moduleType: ModuleType = 'read-module' as const;

  moduleName = 'FrontProxyModule' as const;

  queryServices: GeneraQueryService[] = [
    new GettingCurrentUserService(),
  ];

  commandServices: GeneralCommandService[] = [];

  eventServices: GeneralEventService[] = [];
}
