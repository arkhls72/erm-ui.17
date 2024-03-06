import dayjs from 'dayjs/esm';

import { Wsib, NewWsib } from './wsib.model';

export const sampleWithRequiredData: Wsib = {
  id: 19327,
  employer: 'bowed ew aha',
  accidentDate: dayjs('2024-01-19T00:20'),
};

export const sampleWithPartialData: Wsib = {
  id: 5027,
  employer: 'substantiate',
  clientId: 26673,
  accidentDate: dayjs('2024-01-19T03:50'),
  phoneExtension: 'motorboat',
  cellPhone: 'lasting before',
  closeDate: dayjs('2024-01-19T00:06'),
  note: 'bah',
  coverages: 30679,
  addressId: 16720,
  lastModifiedDate: dayjs('2024-01-19T10:46'),
};

export const sampleWithFullData: Wsib = {
  id: 13339,
  employer: 'wont meanwhile',
  claimNumber: 'whispered',
  clientId: 2389,
  supervisor: 'traumatic oh thoughtfully',
  accidentDate: dayjs('2024-01-19T17:05'),
  adjudicator: 'promptly incidentally which',
  caseManager: 'ranch intensely',
  status: 'fooey ugh',
  phone: '(292) 739-98',
  phoneExtension: 'equatorial',
  cellPhone: 'supposing',
  closeDate: dayjs('2024-01-19T22:45'),
  note: 'quizzically gee',
  fax: 'cane selfish',
  coverages: 12735,
  email: 'Marley.Hand@yahoo.com',
  addressId: 5280,
  lastModifiedBy: 'vet employ amortise',
  lastModifiedDate: dayjs('2024-01-19T01:42'),
};

export const sampleWithNewData: NewWsib = {
  employer: 'given',
  accidentDate: dayjs('2024-01-19T16:06'),
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
