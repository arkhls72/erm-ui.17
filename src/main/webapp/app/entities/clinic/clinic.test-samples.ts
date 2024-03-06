import dayjs from 'dayjs/esm';

import { Clinic, NewClinic } from './clinic.model';

export const sampleWithRequiredData: Clinic = {
  id: 9531,
  name: 'coaxingly',
  phone: '597.332.7317',
  addressId: 7937,
};

export const sampleWithPartialData: Clinic = {
  id: 13990,
  name: 'excepting',
  phone: '528-275-8004 x4',
  addressId: 11159,
  createdBy: 'writing hire',
  lastModifiedBy: 'amongst',
};

export const sampleWithFullData: Clinic = {
  id: 4634,
  name: 'drat weatherise underneath',
  phone: '(251) 340-7914 ',
  fax: 'jeer hug',
  email: 'Roselyn.OKon29@gmail.com',
  addressId: 5276,
  createdDate: dayjs('2024-01-27T07:58'),
  createdBy: 'consequently',
  lastModifiedBy: 'yet furthermore',
  lastModifiedDate: dayjs('2024-01-27T22:35'),
};

export const sampleWithNewData: NewClinic = {
  name: 'fortunate',
  phone: '1-593-719-5171 ',
  addressId: 20779,
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
