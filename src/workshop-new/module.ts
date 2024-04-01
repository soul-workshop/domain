import { AuthJwtPayload } from 'cy-core/src/types';
import { Module } from 'rilata/src/app/module/module';
import { ModuleType } from 'rilata/src/app/module/types';
import { GeneraQueryService, GeneralCommandService, GeneralEventService } from 'rilata/src/app/service/types';
import { GettingWorkshopService } from './service/workshop/get-workshop/service';

export class WorkshopModule extends Module<AuthJwtPayload> {
  moduleType: ModuleType = 'common-module' as const;

  moduleName = 'WorkshopModule' as const;

  queryServices: GeneraQueryService[] = [
    new GettingWorkshopService(),
  ];

  commandServices: GeneralCommandService[] = [];

  eventServices: GeneralEventService[] = [];
}
