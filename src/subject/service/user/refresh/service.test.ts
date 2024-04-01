import {
  describe, test, expect, spyOn, beforeEach,
} from 'bun:test';
import { DomainUser } from 'rilata/src/app/caller';
import { TestDatabase } from 'rilata/src/app/database/test-database';
import { JwtVerifyError } from 'rilata/src/app/jwt/jwt-errors';
import { JwtTokens } from 'cy-core/src/types';
import { DomainServerFixtures } from '../../../../fixtures';
import { SubjectModule } from '../../../module';
import { SubjectModuleFixtures } from '../../../fixtures';
import { RefreshTokenRequestDod, RefreshTokenServiceParams } from './s-params';
import { UserDoesNotExistError } from '../../../domain-data/user/repo-errors';

describe('refresh token service tests', () => {
  const server = DomainServerFixtures.getTestServer(['SubjectModule']);
  const sut = server.getModule<SubjectModule>('SubjectModule');
  const resolver = sut.getModuleResolver();
  const decoder = resolver.getJwtDecoder();

  const caller: DomainUser = {
    userId: 'edc6bfdc-ae44-4e7d-a35e-f26a0e92ffdd',
    type: 'DomainUser',
  };
  const refreshExpiredTime = new Date('2024-01-01').getTime(); // 1704067200000
  const nowTime = refreshExpiredTime - 50000; // 1704067150000
  const refreshToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJlZGM2YmZkYy1hZTQ0LTRlN2QtYTM1ZS1mMjZhMGU5MmZmZGQiLCJ0ZWxlZ3JhbUlkIjo1Mjk4NDg0MDIxLCJleHAiOjE3MDQwNjcyMDAwMDAsInR5cCI6InJlZnJlc2gifQ.RZpk3i9aX5xEjg2zJSfEOmIZYEuDwkJztPuisI5IYFs';

  beforeEach(() => {
    const testDb = resolver.getDatabase() as TestDatabase;
    testDb.addBatch(SubjectModuleFixtures.subjectRepoFixtures);
  });

  test('успех, сгенерирован новый access токен', async () => {
    const requestDod: RefreshTokenRequestDod = {
      meta: {
        name: 'refreshToken',
        requestId: '47f202e3-5146-47b7-af5f-94e6256757f9',
        domainType: 'request',
      },
      attrs: { refreshToken },
    };
    const decoderDateMock = spyOn(decoder, 'getNow').mockReturnValue(nowTime);

    const result = await sut.executeService<RefreshTokenServiceParams>(requestDod, caller);
    expect(result.isSuccess()).toBe(true);

    const tokens = result.value as JwtTokens;
    expect(Object.keys(tokens).length).toBe(2);
    expect(tokens.access).toBe('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJlZGM2YmZkYy1hZTQ0LTRlN2QtYTM1ZS1mMjZhMGU5MmZmZGQiLCJ0ZWxlZ3JhbUlkIjo1Mjk4NDg0MDIxLCJleHAiOjE3MDQxNTM1NTAwMDAsInR5cCI6ImFjY2VzcyJ9.9GGxJR8ORvzGd2i-Gw1Z2hHkpnlG2iMktkJUrINe2Zw');
    expect(tokens.refresh).toBe('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJlZGM2YmZkYy1hZTQ0LTRlN2QtYTM1ZS1mMjZhMGU5MmZmZGQiLCJ0ZWxlZ3JhbUlkIjo1Mjk4NDg0MDIxLCJleHAiOjE3MDQzMjYzNTAwMDAsInR5cCI6InJlZnJlc2gifQ.MH1ite8_dGlzWibBzPTa_l8UKGmn_Q7FhwOP9YiaLgc');
    expect(decoderDateMock).toHaveBeenCalledTimes(3); // verify, create access, create refresh
  });

  test('провал, ошибка верификации токена', async () => {
    const notValidRefreshToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJlZGM2YmZkYy1hZTQ0LTRlN2QtYTM1ZS1mMjZhMGU5MmZmMzIiLCJ0ZWxlZ3JhbUlkIjo1Mjk4NDg0MDIxLCJleHAiOjE3MDQwNjcyMDAwMDAsInR5cCI6InJlZnJlc2gifQ.kROF8A4rQl1IjXYclYj-rktb0seCCS0iXN17Uc_uSZ8';
    const requestDod: RefreshTokenRequestDod = {
      meta: {
        name: 'refreshToken',
        requestId: '47f202e3-5146-47b7-af5f-94e6256757f9',
        domainType: 'request',
      },
      attrs: {
        refreshToken: notValidRefreshToken,
      },
    };

    const result = await sut.executeService<RefreshTokenServiceParams>(requestDod, caller);
    expect(result.isFailure()).toBe(true);
    expect(result.value as JwtVerifyError).toEqual({
      locale: {
        text: 'Токен не валидный',
        hint: {},
        name: 'JwtVerifyError',
      },
      name: 'JwtVerifyError',
      meta: {
        domainType: 'error',
        errorType: 'domain-error',
      },
    });
  });

  test('провал, пользователь не найден', async () => {
    const notFoundCaller: DomainUser = {
      userId: 'edc6bfdc-ae44-4e7d-a35e-f26a0e92ff32',
      type: 'DomainUser',
    };
    const notFoundUserRefreshToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJlZGM2YmZkYy1hZTQ0LTRlN2QtYTM1ZS1mMjZhMGU5MmZmMzIiLCJ0ZWxlZ3JhbUlkIjo1Mjk4NDg0MDIxLCJleHAiOjE3MDQwNjcyMDAwMDAsInR5cCI6InJlZnJlc2gifQ.kROF8A4rQl1IjXYclYj-rktb0seCCS0iXN17Uc_uSZ8';
    const requestDod: RefreshTokenRequestDod = {
      meta: {
        name: 'refreshToken',
        requestId: '47f202e3-5146-47b7-af5f-94e6256757c2',
        domainType: 'request',
      },
      attrs: {
        refreshToken: notFoundUserRefreshToken,
      },
    };

    const result = await sut.executeService<RefreshTokenServiceParams>(requestDod, notFoundCaller);
    expect(result.isFailure()).toBe(true);
    expect(result.value as UserDoesNotExistError).toEqual({
      locale: {
        text: 'Пользователя с id:{{userId}} не существует, или эта запись уже удалена.',
        hint: {
          userId: 'edc6bfdc-ae44-4e7d-a35e-f26a0e92ff32',
        },
        name: 'UserDoesNotExistError',
      },
      name: 'UserDoesNotExistError',
      meta: {
        domainType: 'error',
        errorType: 'domain-error',
      },
    });
  });
});
