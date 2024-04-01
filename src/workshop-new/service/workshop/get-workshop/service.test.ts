import {
  describe, test, expect, spyOn, beforeEach,
} from 'bun:test';
import { DomainServerFixtures } from '../../../../fixtures';
import { WorkshopModule } from '../../../module';

describe('reftest token service test', () => {
  const server = DomainServerFixtures.getTestServer(['WorkshopModule']);
  const sut = server.getModule<WorkshopModule>('WorkshopModule');
  const resolver = sut.getModuleResolver();
});
