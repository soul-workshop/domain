import { AuthJwtPayload } from 'cy-core/src/types';
import { Module } from 'rilata/src/app/module/module';
import { ModuleType } from 'rilata/src/app/module/types';
import { GeneraQueryService, GeneralCommandService, GeneralEventService } from 'rilata/src/app/service/types';

export class AuthModule extends Module<AuthJwtPayload> {
  moduleName = 'AuthModule' as const;

  moduleType: ModuleType = 'common-module' as const;

  queryServices: GeneraQueryService[] = [];

  commandServices: GeneralCommandService[] = [];

  eventServices: GeneralEventService[] = [];
}
