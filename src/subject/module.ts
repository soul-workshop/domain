import { AuthJwtPayload } from 'cy-core/src/types';
import { Module } from 'rilata/src/app/module/module';
import { ModuleType } from 'rilata/src/app/module/types';
import { GeneraQueryService, GeneralCommandService, GeneralEventService } from 'rilata/src/app/service/types';
import { AuthentificatingUserService } from './service/user/authentificate/service';
import { RefreshingTokenService } from './service/user/refresh/service';
import { GettingCurrentUserService } from './service/user/get-current-user/service';
import { GettingUserService } from './service/user/get-user/service';
import { GettingUsersService } from './service/user/get-users/service';

export class SubjectModule extends Module<AuthJwtPayload> {
  moduleName = 'SubjectModule' as const;

  moduleType: ModuleType = 'common-module' as const;

  queryServices: GeneraQueryService[] = [
    new AuthentificatingUserService(),
    new RefreshingTokenService(),
    new GettingCurrentUserService(),
    new GettingUserService(),
    new GettingUsersService(),
  ];

  commandServices: GeneralCommandService[] = [];

  eventServices: GeneralEventService[] = [];
}
