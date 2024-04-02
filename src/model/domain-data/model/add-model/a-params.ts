import { ActionParams, DomainResult } from 'rilata/src/domain/domain-data/params-types';
import { EventDod } from 'rilata/src/domain/domain-data/domain-types';
import { UuidType } from 'rilata/src/common/types';
import { ModelARDT, ModelAttrs, ModelCategory } from '../params';
import { ModelAR } from '../../../domain-object/model/a-root';

export type AddModelDomainCommand = {
    name: string,
    category: ModelCategory,
    workshopId: UuidType,
}

export type AddModelOut = ModelAR;

type AddedModelEventAttrs = ModelAttrs;

export type AddedModelEvent = EventDod<
    AddedModelEventAttrs,
    'AddedModelEvent',
    ModelARDT
>;

export type AddModelActionParams = ActionParams<
    AddModelDomainCommand,
    AddModelOut,
    never,
    AddedModelEvent[]
>

export type AddModelResult = DomainResult<AddModelActionParams>;
