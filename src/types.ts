import { FrontProxyModule } from './front-proxy/module';
import { SubjectModule } from './subject/module';
import { WorkshopModule } from './workshop-new/module';

export type CraftyardServerModules = SubjectModule | WorkshopModule | FrontProxyModule;
