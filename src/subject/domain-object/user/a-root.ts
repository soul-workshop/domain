import crypto from 'node:crypto';
import { AggregateRoot } from 'rilata/src/domain/domain-object/aggregate-root';
import { failure } from 'rilata/src/common/result/failure';
import { dodUtility } from 'rilata/src/common/utils/domain-object/dod-utility';
import { Result } from 'rilata/src/common/result/types';
import { success } from 'rilata/src/common/result/success';
import { Logger } from 'rilata/src/common/logger/logger';
import { DomainResult } from 'rilata/src/domain/domain-data/params-types';
import { JwtCreator } from 'rilata/src/app/jwt/jwt-creator';
import { JwtVerifier } from 'rilata/src/app/jwt/jwt-verifier';
import { AuthJwtPayload } from 'cy-core/src/types';
import {
  UserAttrs, UserParams, UserType,
} from '../../domain-data/user/params';
import { userARValidator } from '../../domain-data/user/v-map';
import {
  UserAuthentificationActionParams,
  UserAuthDomainQuery,
} from '../../domain-data/user/authentificate/a-params';
import { UserRefreshActionParams, UserRefreshDomainQuery } from '../../domain-data/user/refresh/a-params';
import { TelegramAuthDateNotValidError, TelegramHashNotValidError } from '../../domain-data/user/aggregate-errors';

export class UserAR extends AggregateRoot<UserParams> {
  constructor(
    protected attrs: UserAttrs,
    protected version: number,
    protected logger: Logger,
  ) {
    super(attrs, userARValidator, 'UserAR', 'userId', version, [], logger);
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
    authQuery: UserAuthDomainQuery,
    tokenCreator: JwtCreator<AuthJwtPayload>,
  ):DomainResult<UserAuthentificationActionParams> {
    const result = this.isValidHash(authQuery);

    if (result.isFailure()) {
      return failure(result.value);
    }

    return this.createTokens(tokenCreator);
  }

  refreshToken(
    refreshQuery: UserRefreshDomainQuery,
    tokenVerifier: JwtVerifier<AuthJwtPayload>,
    tokenCreator: JwtCreator<AuthJwtPayload>,
  ): DomainResult<UserRefreshActionParams> {
    const verifyResult = tokenVerifier.verifyToken(refreshQuery.refreshToken);
    if (verifyResult.isFailure()) return failure(verifyResult.value);

    return this.createTokens(tokenCreator);
  }

  private isValidHash(authQuery: UserAuthDomainQuery):
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
      return failure(dodUtility.getDomainError<TelegramHashNotValidError>(
        'TelegramHashNotValidError',
        'Хэш телеграмма некорректный',
        { hash: authQuery.telegramAuthDTO.hash },
      ));
    }

    const hashLifeTime = this.getNow() - authQuery.telegramAuthDTO.auth_date * 1000;
    const authHashLifetimeLimit = authQuery.telegramAuthHashLifetimeLimitsAsSeconds * 1000;
    const hashLifeTimeIsValid = (authHashLifetimeLimit - hashLifeTime) < 0;

    if (hashLifeTimeIsValid) {
      return failure(dodUtility.getDomainError<TelegramAuthDateNotValidError>(
        'TelegramAuthDateNotValidError',
        'Прошло больше {{authHashLifetimeAsSeconds}} секунд после получения кода авторизации в телеграм. Повторите процедуру авторизации еще раз.',
        { authHashLifetimeAsSeconds: authHashLifetimeLimit / 1000 },
      ));
    }
    return success(true);
  }

  protected createTokens(tokenCreator: JwtCreator<AuthJwtPayload>): Result<never, JwtTokens> {
    const tokenData: AuthJwtPayload = {
      userId: this.attrs.userId,
      telegramId: this.attrs.telegramId,
    };

    const access = tokenCreator.createToken(tokenData, 'access');
    const refresh = tokenCreator.createToken(tokenData, 'refresh');
    return success({ access, refresh });
  }

  getNow(): number {
    return Date.now();
  }
}
