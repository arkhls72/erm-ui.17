import dayjs from 'dayjs/esm';

import { Ehc, NewEhc } from './ehc.model';

export const sampleWithRequiredData: Ehc = {
  id: 8960,
  policyNumber: 'quaintly jar when',
  policyHolder: 'expansion stealthily joyfully',
  name: 'likewise',
  clientId: 26576,
};

export const sampleWithPartialData: Ehc = {
  id: 31531,
  certificateNumber: 'round towards',
  policyNumber: 'cautiously cheerfully',
  policyHolder: 'sightsee pace provided',
  name: 'pudding',
  note: 'only blah',
  type: 'circa observe',
  status: 'until trespass whenever',
  endDate: dayjs('2024-01-27T18:20'),
  clientId: 14978,
  dependents: 22580,
  lastModifiedDate: dayjs('2024-01-27T09:19'),
};

export const sampleWithFullData: Ehc = {
  id: 16585,
  certificateNumber: 'spyglass',
  policyNumber: 'notwithstanding between',
  policyHolder: 'seemingly excepting karate',
  groupNumber: 'atop',
  name: 'instead whisk despite',
  note: 'belittle',
  type: 'strange ugh supposing',
  status: 'furthermore',
  endDate: dayjs('2024-01-27T10:18'),
  phone: '317-529-7046 x5',
  fax: 'spotlight frigh',
  email: 'Name_Orn@gmail.com',
  clientId: 16586,
  addressId: 17749,
  coverages: 28362,
  ehcClient: 'nor',
  dependents: 13908,
  createdDate: dayjs('2024-01-27T11:37'),
  createdBy: 'strengthen pink use',
  lastModifiedBy: 'aw',
  lastModifiedDate: dayjs('2024-01-27T12:39'),
};

export const sampleWithNewData: NewEhc = {
  policyNumber: 'trowel unnatural beside',
  policyHolder: 'yuck warmly unimpressively',
  name: 'um hmph',
  clientId: 22642,
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
