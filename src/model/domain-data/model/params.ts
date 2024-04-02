import { UuidType } from 'rilata/src/common/types';
import { DomainMeta, OutputAggregateDataTransfer } from 'rilata/src/domain/domain-data/domain-types';
import { AggregateRootDataParams } from 'rilata/src/domain/domain-data/params-types';
import { AddModelActionParams } from './add-model/a-params';

export type ModelCategory = 'Мебель' | 'Кухонная утварь' | 'Игрушки';

export type ModelAttrs = {
    modelId: UuidType,
    workshopId: UuidType,
    name: string,
    category: ModelCategory,
    images: string[],
}

export type ModelMeta = DomainMeta<'ModelAR', 'modelId'>;

export type ModelParams = AggregateRootDataParams<
  ModelAttrs, ModelMeta, AddModelActionParams, []
>;

export type ModelARDT = OutputAggregateDataTransfer<ModelParams>;
