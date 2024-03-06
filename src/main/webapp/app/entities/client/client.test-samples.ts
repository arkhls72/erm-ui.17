import dayjs from 'dayjs/esm';

import { Client, NewClient } from './client.model';

export const sampleWithRequiredData: Client = {
  id: 13139,
  firstName: 'Earnest',
  lastName: 'Murray',
  cellPhone: 'splosh withX',
  gender: 'fair near',
  emergencyName: 'mmm judgementally',
  emergencyPhone: 'where absolute ',
};

export const sampleWithPartialData: Client = {
  id: 29297,
  firstName: 'Caden',
  lastName: 'Collins',
  cellPhone: 'obedienceXXX',
  email: 'Brionna_Doyle@yahoo.com',
  addressId: 15407,
  gender: 'ouch astride',
  emergencyName: 'gratefully however',
  emergencyPhone: 'trial whoa exce',
  createdBy: 'brush amid huzzah',
  lastModifiedDate: dayjs('2024-01-27T19:36'),
};

export const sampleWithFullData: Client = {
  id: 30024,
  firstName: 'Fay',
  lastName: 'Hettinger',
  birthDate: dayjs('2024-01-27T15:45'),
  homePhone: 'long-term',
  cellPhone: 'thoroughly pira',
  email: 'Tracey.DAmore@gmail.com',
  addressId: 3128,
  gender: 'majestically',
  howHear: 'sportsman prevail',
  emergencyName: 'within inside who',
  emergencyPhone: 'conjureXXXXX',
  createdDate: dayjs('2024-01-27T13:38'),
  createdBy: 'saw portly scale',
  lastModifiedDate: dayjs('2024-01-27T11:27'),
  lastModifiedBy: 'brr recess',
  phoneExtension: 'the',
};

export const sampleWithNewData: NewClient = {
  firstName: 'Juston',
  lastName: 'Treutel',
  cellPhone: 'ew limplyXXX',
  gender: 'mortally',
  emergencyName: 'inherit faithfully',
  emergencyPhone: 'age concerning',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
