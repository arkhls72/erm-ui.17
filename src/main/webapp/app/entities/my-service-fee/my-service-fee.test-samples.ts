import dayjs from 'dayjs/esm';

import { MyServiceFee, NewMyServiceFee } from './my-service-fee.model';

export const sampleWithRequiredData: MyServiceFee = {
  id: 6827,
  fee: 15536.42,
  feeTypeId: 25895,
  myServiceId: 1308,
};

export const sampleWithPartialData: MyServiceFee = {
  id: 30620,
  fee: 17416.94,
  feeTypeId: 11454,
  myServiceId: 9706,
  note: 'immerse oof genie',
  createdBy: 'principle real',
  lastModifiedBy: 'nor',
};

export const sampleWithFullData: MyServiceFee = {
  id: 7983,
  fee: 25812.2,
  feeTypeId: 32400,
  myServiceId: 23581,
  note: 'dop vaporise',
  createdBy: 'quaint segregate lest',
  createdDate: dayjs('2024-01-27T21:02'),
  lastModifiedBy: 'next progress ah',
  lastModifiedDate: dayjs('2024-01-27T08:38'),
};

export const sampleWithNewData: NewMyServiceFee = {
  fee: 26990.57,
  feeTypeId: 30509,
  myServiceId: 22553,
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
