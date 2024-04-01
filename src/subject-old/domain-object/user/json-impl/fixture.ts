import { UserAttrs } from '../../../domain-data/user/params';

export const testUsersRecords: (UserAttrs & { version: number })[] = [
  {
    version: 0,
    userId: 'fa91a299-105b-4fb0-a056-92634249130c',
    telegramId: 5436134100,
    type: 'employee',
    userProfile: {
      firstName: 'Jack',
      lastName: 'Smith',
    },
  },
  {
    version: 0,
    userId: '9c035bdd-5367-4c7b-a7a7-f7eaaaec28b7',
    telegramId: 5436134100,
    type: 'employee',
    userProfile: {
      firstName: 'Jack',
      lastName: 'Smith',
    },
  },
  {
    version: 0,
    userId: '493f5cbc-f572-4469-9cf1-3702802e6a31',
    telegramId: 3290593910,
    type: 'employee',
    userProfile: {
      firstName: 'Bill',
      lastName: 'Oruell',
    },
  },
  {
    version: 0,
    userId: 'bc9166cb-ba37-43cb-93d3-ce6da27471df',
    telegramId: 5436134100,
    type: 'client',
    userProfile: {
      firstName: 'Jack',
      lastName: 'Smith',
    },
  },
];

export const testUsersRecordsAsJson = JSON.stringify(testUsersRecords);

export function getUserRecords(attrs: Partial<UserAttrs>): string {
  return JSON.stringify([{ ...testUsersRecords[2], ...attrs }]);
}
