import { AggregateFactory } from 'rilata/src/domain/domain-object/aggregate-factory';
import { Caller } from 'rilata/src/app/caller';
import { uuidUtility } from 'rilata/src/common/utils/uuid/uuid-utility';
import { UuidType } from 'rilata/src/common/types';
import { ModelAR } from './a-root';
import { ModelAttrs, ModelParams } from '../../domain-data/model/params';
import { AddModelDomainCommand, AddedModelEvent } from '../../domain-data/model/add-model/a-params';

export class ModelFactory extends AggregateFactory<ModelParams> {
  create(caller: Caller, action: AddModelDomainCommand, requestId: UuidType): ModelAR {
    const modelAttrs: ModelAttrs = {
      ...action,
      modelId: uuidUtility.getNewUUID(),
      images: [],
    };
    const model = new ModelAR(modelAttrs, 0, this.logger);
    model.getHelper().registerEvent<AddedModelEvent>('AddedModelEvent', modelAttrs, requestId, caller);
    return model;
  }

  restore(modelAttrs: ModelAttrs, version: number): ModelAR {
    return new ModelAR(modelAttrs, version, this.logger);
  }
}
