import dayjs from 'dayjs/esm';

import { EhcPrimary, NewEhcPrimary } from './ehc-primary.model';

export const sampleWithRequiredData: EhcPrimary = {
  id: 30054,
  ehcId: 3058,
  clientId: 28153,
  name: 'tremendously ready',
  ehcType: 'irritably',
  policyNumber: 'phew inasmuch',
};

export const sampleWithPartialData: EhcPrimary = {
  id: 27064,
  ehcId: 8342,
  clientId: 28360,
  name: 'episode chasuble',
  status: 'pessimistic',
  ehcType: 'whoa',
  policyNumber: 'even residence innocently',
  policyHolder: 'after humanise',
  fax: 'variant distort',
  email: 'Jermaine56@gmail.com',
  createdDate: dayjs('2024-01-26'),
  createdBy: 'upon',
  lastModifiedDate: dayjs('2024-01-27T03:50'),
  lastModifiedBy: 'rug',
};

export const sampleWithFullData: EhcPrimary = {
  id: 29479,
  ehcId: 5358,
  clientId: 2922,
  name: 'than incidentally nothing',
  status: 'lively flesh devil',
  ehcType: 'or between',
  groupNumber: 'cabbage hourly',
  policyNumber: 'out',
  policyHolder: 'eventually',
  certificateNumber: 'brr uh-huh',
  note: 'meh turbulent silently',
  endDate: dayjs('2024-01-27T00:45'),
  phone: '791-554-8964 x0',
  fax: 'where outperfor',
  email: 'Paul.Toy18@yahoo.com',
  createdDate: dayjs('2024-01-27'),
  createdBy: 'oxygenate below furiously',
  lastModifiedDate: dayjs('2024-01-27T07:16'),
  lastModifiedBy: 'bah',
};

export const sampleWithNewData: NewEhcPrimary = {
  ehcId: 26841,
  clientId: 5723,
  name: 'sovereignty',
  ehcType: 'properly',
  policyNumber: 'against mole amongst',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
