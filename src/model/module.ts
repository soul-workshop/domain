import { AuthJwtPayload } from 'cy-core/src/types';
import { Module } from 'rilata/src/app/module/module';
import { ModuleType } from 'rilata/src/app/module/types';
import { GeneraQueryService, GeneralCommandService, GeneralEventService } from 'rilata/src/app/service/types';
import { GettingWorkshopModelsService } from './services/get-workshop-models/service';
import { GettingWorkshopModelService } from './services/get-workshop-model/service';

export class ModelModule extends Module<AuthJwtPayload> {
  moduleName = 'ModelModule' as const;

  moduleType: ModuleType = 'common-module' as const;

  queryServices: GeneraQueryService[] = [
    new GettingWorkshopModelsService(),
    new GettingWorkshopModelService(),
  ];

  commandServices: GeneralCommandService[] = [];

  eventServices: GeneralEventService[] = [];
}
