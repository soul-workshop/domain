import { AggregateRoot } from 'rilata/src/domain/domain-object/aggregate-root';
import { AggregateRootHelper } from 'rilata/src/domain/domain-object/aggregate-helper';
import { Logger } from 'rilata/src/common/logger/logger';
import { DtoFieldValidator } from 'rilata/src/domain/validator/field-validator/dto-field-validator';
import { ModelAttrs, ModelParams } from '../../domain-data/model/params';
import { modelAttrsVMap } from '../../domain-data/model/v-map';

export class ModelAR extends AggregateRoot<ModelParams> {
  protected attrs: ModelAttrs;

  protected helper: AggregateRootHelper<ModelParams>;

  protected logger: Logger;

  constructor(attrs: ModelAttrs, version: number, logger: Logger) {
    super();
    this.checkInveriants(attrs);
    this.logger = logger;
    this.attrs = attrs;
    this.helper = new AggregateRootHelper<ModelParams>('ModelAR', attrs, 'modelId', version, [], logger);
  }

  protected checkInveriants(attrs: ModelAttrs): void {
    const invariantValidator = new DtoFieldValidator('modelInvariants', true, { isArray: false }, 'dto', modelAttrsVMap);
    const invariantsResult = invariantValidator.validate(attrs);
    if (invariantsResult.isFailure()) {
      throw this.logger.error('не соблюдены инварианты агрегата Model', {
        modelAttrs: attrs,
        validatorValue: invariantsResult.value,
      });
    }
  }

  getId(): string {
    return this.attrs.modelId;
  }

  getShortName(): string {
    return `Модель: ${this.attrs.name}`;
  }

  getCategory():string {
    return this.attrs.category;
  }
}
