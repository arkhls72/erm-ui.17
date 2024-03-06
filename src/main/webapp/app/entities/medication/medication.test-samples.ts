import dayjs from 'dayjs/esm';

import { Medication, NewMedication } from './medication.model';

export const sampleWithRequiredData: Medication = {
  id: 8127,
  name: 'paddle effort unabashedly',
  reasonFor: 'fooey above maple',
  startDate: dayjs('2024-01-25T02:28'),
};

export const sampleWithPartialData: Medication = {
  id: 12678,
  name: 'because',
  reasonFor: 'coerce veil neutralise',
  startDate: dayjs('2024-01-25T04:43'),
  createdDate: dayjs('2024-01-25T13:58'),
  createdBy: 'hm phew likewise',
  lastModifiedDate: dayjs('2024-01-25T01:04'),
};

export const sampleWithFullData: Medication = {
  id: 11290,
  name: 'hence sesame',
  reasonFor: 'rhyme',
  note: 'scarce',
  startDate: dayjs('2024-01-25T16:58'),
  endDate: dayjs('2024-01-25T21:23'),
  createdDate: dayjs('2024-01-25T02:01'),
  createdBy: 'zowie',
  lastModifiedDate: dayjs('2024-01-25T07:23'),
  lastModifiedBy: 'briskly',
};

export const sampleWithNewData: NewMedication = {
  name: 'feedback',
  reasonFor: 'hopelessly',
  startDate: dayjs('2024-01-25T04:32'),
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
