import dayjs from 'dayjs/esm';

import { Prog, NewProg } from './prog.model';

export const sampleWithRequiredData: Prog = {
  id: 31361,
  status: 'oof incidentally how',
  clientId: 29871,
  startDate: dayjs('2024-01-22T12:56'),
  assessmentId: 26945,
};

export const sampleWithPartialData: Prog = {
  id: 27688,
  status: 'amidst',
  clientId: 25112,
  startDate: dayjs('2024-01-22T04:10'),
  assessmentId: 16524,
  createdDate: dayjs('2024-01-22T06:16'),
};

export const sampleWithFullData: Prog = {
  id: 25926,
  name: 'symbolise throughout',
  status: 'ack',
  clientId: 17599,
  startDate: dayjs('2024-01-22T10:16'),
  endDate: dayjs('2024-01-22T06:26'),
  clinicalNote: 'phew the oh',
  assessmentId: 2354,
  createdDate: dayjs('2024-01-22T11:01'),
  createdBy: dayjs('2024-01-22T17:58'),
  lastModifiedBy: 'philosophise ugh',
  lastModifiedDate: dayjs('2024-01-22T06:43'),
};

export const sampleWithNewData: NewProg = {
  status: 'barrel admire',
  clientId: 7511,
  startDate: dayjs('2024-01-22T09:11'),
  assessmentId: 5477,
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
