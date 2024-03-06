import dayjs from 'dayjs/esm';

import { Mva, NewMva } from './mva.model';

export const sampleWithRequiredData: Mva = {
  id: 6641,
  insurance: 'federate yuck loftily',
  clientId: 21684,
  claimNumber: 'mismanage low',
  accidentDate: dayjs('2024-01-24T19:10'),
  status: 'single',
};

export const sampleWithPartialData: Mva = {
  id: 26606,
  insurance: 'shakily',
  clientId: 11717,
  claimNumber: 'flour meh up',
  accidentDate: dayjs('2024-01-24T09:33'),
  status: 'blah mob',
  closeDate: dayjs('2024-01-24T03:19'),
  phoneExtension: 'shoulder broadc',
  cellPhone: 'needy pinafore',
  email: 'Kareem88@gmail.com',
  createdDate: dayjs('2024-01-24T23:57'),
  createdBy: 'nor limited',
  lastModifiedBy: 'royal',
  phone: '397.500.5935 x5',
};

export const sampleWithFullData: Mva = {
  id: 8094,
  insurance: 'perky king android',
  clientId: 30751,
  claimNumber: 'gnaw',
  accidentDate: dayjs('2024-01-24T23:20'),
  adjuster: 'boohoo friendship',
  status: 'young balaclava',
  closeDate: dayjs('2024-01-24T06:56'),
  phoneExtension: 'consequently',
  cellPhone: 'aw er',
  fax: 'tog meanwhile from',
  email: 'Garett_Waters27@yahoo.com',
  note: 'but wrong',
  addressId: 13853,
  coverages: 'provided',
  createdDate: dayjs('2024-01-24T10:16'),
  createdBy: 'tornado successfully',
  lastModifiedBy: 'apropos',
  lastModifiedDate: dayjs('2024-01-24T12:33'),
  phone: '773-991-9236 x3',
};

export const sampleWithNewData: NewMva = {
  insurance: 'simplistic',
  clientId: 4038,
  claimNumber: 'unless supposing',
  accidentDate: dayjs('2024-01-24T02:24'),
  status: 'than per',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
