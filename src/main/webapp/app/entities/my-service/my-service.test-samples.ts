import dayjs from 'dayjs/esm';

import { MyService, NewMyService } from './my-service.model';

export const sampleWithRequiredData: MyService = {
  id: 23030,
  name: 'disruption',
};

export const sampleWithPartialData: MyService = {
  id: 5293,
  name: 'mmm variable',
  description: 'log',
  commonServiceCode: 28024,
  unit: 'sarcastic furthermore barring',
  note: 'inasmuch',
  createdBy: dayjs('2024-01-24T01:53'),
  lastModifiedDate: dayjs('2024-01-24T20:08'),
};

export const sampleWithFullData: MyService = {
  id: 21355,
  name: 'versus',
  description: 'inasmuch between',
  commonServiceCodeId: 8432,
  commonServiceCode: 26114,
  unit: 'phew',
  note: 'violet hmph tremble',
  createdDate: dayjs('2024-01-24T21:57'),
  createdBy: dayjs('2024-01-24T22:44'),
  lastModifiedBy: 'absent code nominalize',
  lastModifiedDate: dayjs('2024-01-24T23:50'),
};

export const sampleWithNewData: NewMyService = {
  name: 'bowling ouch',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
