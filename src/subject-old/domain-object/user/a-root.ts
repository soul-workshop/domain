import crypto from 'node:crypto';
import { AggregateRoot } from 'rilata/src/domain/domain-object/aggregate-root';
import { failure } from 'rilata/src/common/result/failure';
import { dodUtility } from 'rilata/src/common/utils/domain-object/dod-utility';
import { Result } from 'rilata/src/common/result/types';
import { success } from 'rilata/src/common/result/success';
import { AssertionException } from 'rilata/src/common/exeptions';
import { Logger } from 'rilata/src/common/logger/logger';
import { TokenCreator } from 'rilata/src/app/jwt/token-creator.interface';
import { AggregateRootHelper } from 'rilata/src/domain/domain-object/aggregate-helper';
import { DomainResult } from 'rilata/src/domain/domain-data/params-types';
import {
  UserAuthentificationActionParams,
  UserAuthentificationDomainQuery,
  JWTPayload,
  TelegramAuthDateNotValidError,
  TelegramHashNotValidError,
} from '../../domain-data/user/user-authentification/a-params';
import {
  UserAttrs, UserParams, UserType,
} from '../../domain-data/user/params';
import { TG_AUTH_HASH_LIFETIME_AS_SECONDS } from '../../subject-config';
import { userARValidator } from '../../domain-data/user/v-map';

export class UserAR extends AggregateRoot<UserParams> {
  protected helper: AggregateRootHelper<UserParams>;

  constructor(
    protected attrs: UserAttrs,
    protected version: number,
    protected logger: Logger,
  ) {
    super();
    const result = userARValidator.validate(attrs);
    if (result.isFailure()) {
      const errStr = 'Не соблюдены инварианты UserAR';
      this.logger.error(errStr, { attrs, result });
      throw new AssertionException(errStr);
    }
    this.helper = new AggregateRootHelper('UserAR', attrs, version, [], logger);
  }

  getId(): string {
    return this.attrs.userId;
  }

  getTelegramId(): number {
    return this.attrs.telegramId;
  }

  getUserType(): UserType {
    return this.attrs.type;
  }

  getShortName(): string {
    return `${this.attrs.userProfile.lastName} ${this.attrs.userProfile.firstName}`;
  }

  userAuthentification(
    authQuery: UserAuthentificationDomainQuery,
    tokenCreator: TokenCreator<JWTPayload>,
  ):DomainResult<UserAuthentificationActionParams> {
    const result = this.isValidHash(authQuery);

    if (result.isFailure()) {
      return failure(result.value);
    }

    const tokenData: JWTPayload = {
      userId: this.attrs.userId,
    };

    const jwtTokens = tokenCreator.createToken(tokenData);
    return success(jwtTokens);
  }

  private isValidHash(authQuery: UserAuthentificationDomainQuery):
   Result<TelegramHashNotValidError | TelegramAuthDateNotValidError, true> {
    const secret = new Bun.CryptoHasher('sha256').update(authQuery.botToken).digest();
    const { hash, ...telegramAuthDTOWithoutHash } = authQuery.telegramAuthDTO;
    const rawData = Object
      .entries(telegramAuthDTOWithoutHash)
      .map(([key, value]) => `${key}=${value}`)
      .sort()
      .join('\n');
    const calcHash = crypto.createHmac('sha256', secret).update(rawData).digest('hex');
    if (hash !== calcHash) {
      return failure(dodUtility.getDomainErrorByType<TelegramHashNotValidError>(
        'TelegramHashNotValidError',
        'Хэш телеграмма некорректный',
        { hash: authQuery.telegramAuthDTO.hash },
      ));
    }

    const nowTimeStamp = Math.trunc(this.getNowDate().getTime() / 1000);
    const hashLifeTimeAsSeconds = nowTimeStamp - authQuery.telegramAuthDTO.auth_date;
    const hashLifeTimeValid = ((TG_AUTH_HASH_LIFETIME_AS_SECONDS) - hashLifeTimeAsSeconds);

    if (hashLifeTimeValid < 0) {
      return failure(dodUtility.getDomainErrorByType<TelegramAuthDateNotValidError>(
        'TelegramAuthDateNotValidError',
        'Прошло больше {{authHashLifetimeAsSeconds}} секунд после получения кода авторизации в телеграм. Повторите процедуру авторизации еще раз.',
        { authHashLifetimeAsSeconds: TG_AUTH_HASH_LIFETIME_AS_SECONDS },
      ));
    }
    return success(true);
  }

  getNowDate(): Date {
    return new Date();
  }
}
