import dayjs from 'dayjs/esm';

import { Operation, NewOperation } from './operation.model';

export const sampleWithRequiredData: Operation = {
  id: 5512,
  name: 'waver barring circa',
  operationDate: dayjs('2024-01-24T21:17'),
};

export const sampleWithPartialData: Operation = {
  id: 30154,
  name: 'vibrant',
  operationDate: dayjs('2024-01-24T11:44'),
  createdBy: 'centurion fluffy',
  lastModifiedDate: dayjs('2024-01-24T10:00'),
};

export const sampleWithFullData: Operation = {
  id: 25426,
  name: 'glossy likewise',
  operationDate: dayjs('2024-01-24T20:42'),
  reasonFor: 'rightfully standard once',
  note: 'aside',
  createdDate: dayjs('2024-01-24T09:43'),
  createdBy: 'along windage',
  lastModifiedBy: 'exist plasticize',
  lastModifiedDate: dayjs('2024-01-24T00:01'),
};

export const sampleWithNewData: NewOperation = {
  name: 'sundial marvelous spiritual',
  operationDate: dayjs('2024-01-24T10:11'),
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
