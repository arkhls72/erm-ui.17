import dayjs from 'dayjs/esm';

import { EhcClient, NewEhcClient } from './ehc-client.model';

export const sampleWithRequiredData: EhcClient = {
  id: 14020,
  ehcType: 'detect attention chafe',
  policyHolder: 'because',
  clientId: 21821,
  ehcId: 21717,
  ehcPrimaryId: 1885,
  relation: 'barring',
};

export const sampleWithPartialData: EhcClient = {
  id: 26359,
  ehcType: 'gee childhood if',
  policyHolder: 'provided contort printing',
  clientId: 17459,
  ehcId: 1665,
  ehcPrimaryId: 30228,
  relation: 'mockingly declaration',
  removedDate: dayjs('2024-01-27T09:57'),
  lastModifiedBy: 'coaxingly warped a',
  createdDate: dayjs('2024-01-27T20:03'),
};

export const sampleWithFullData: EhcClient = {
  id: 2687,
  ehcType: 'inasmuch before blame',
  policyHolder: 'can now',
  clientId: 24948,
  ehcId: 19393,
  endDate: dayjs('2024-01-27T08:51'),
  ehcPrimaryId: 23255,
  note: 'up lest',
  relation: 'plot enigma hmph',
  status: 'minus oh',
  removedDate: dayjs('2024-01-27T10:26'),
  lastModfiedDate: dayjs('2024-01-27T06:50'),
  lastModifiedBy: 'riddle slushy disappoint',
  createdDate: dayjs('2024-01-27T09:37'),
  createdBy: 'towards terrible',
};

export const sampleWithNewData: NewEhcClient = {
  ehcType: 'madly as duh',
  policyHolder: 'yowza continually traveler',
  clientId: 7787,
  ehcId: 22621,
  ehcPrimaryId: 6456,
  relation: 'subway',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
