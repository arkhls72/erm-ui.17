import dayjs from 'dayjs/esm';

import { MyProductFee, NewMyProductFee } from './my-product-fee.model';

export const sampleWithRequiredData: MyProductFee = {
  id: 12710,
  fee: 'kiddingly uh-huh',
  feeTypeId: 23729,
  feeTypeName: 'ha drat',
  myProductId: 11013,
};

export const sampleWithPartialData: MyProductFee = {
  id: 25261,
  fee: 'as hence out',
  feeTypeId: 10902,
  feeTypeName: 'prance pajamas',
  myProductId: 3557,
  lastModifiedBy: 'whether mammoth',
  lastModifiedDate: dayjs('2024-01-24T12:49'),
};

export const sampleWithFullData: MyProductFee = {
  id: 2245,
  fee: 'loudly aside',
  feeTypeId: 26773,
  feeTypeName: 'overview worth stealthily',
  myProductId: 11116,
  createdDate: dayjs('2024-01-24T20:03'),
  createdBy: 'unethically',
  lastModifiedBy: 'upward',
  lastModifiedDate: dayjs('2024-01-24T20:37'),
};

export const sampleWithNewData: NewMyProductFee = {
  fee: 'uncover vainly yowl',
  feeTypeId: 8044,
  feeTypeName: 'envious oh',
  myProductId: 11170,
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
