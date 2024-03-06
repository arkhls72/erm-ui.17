import dayjs from 'dayjs/esm';

import { Coverage, NewCoverage } from './coverage.model';

export const sampleWithRequiredData: Coverage = {
  id: 747,
};

export const sampleWithPartialData: Coverage = {
  id: 980,
  therapyId: 29526,
  ehcId: 8865,
  mvaId: 896,
  limit: 'evil',
  lastModifiedBy: 'basketball',
};

export const sampleWithFullData: Coverage = {
  id: 20583,
  therapyId: 8634,
  ehcId: 637,
  wsibId: 25338,
  mvaId: 24373,
  limit: 'trifle than extremely',
  note: 'bah scaly assumption',
  lastModifiedName: 'by adored which',
  lastModifiedBy: 'duh',
  createdDate: dayjs('2024-01-26T23:36'),
  createdBy: 'near',
};

export const sampleWithNewData: NewCoverage = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
