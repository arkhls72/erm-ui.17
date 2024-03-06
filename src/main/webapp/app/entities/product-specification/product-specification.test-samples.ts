import dayjs from 'dayjs/esm';

import { ProductSpecification, NewProductSpecification } from './product-specification.model';

export const sampleWithRequiredData: ProductSpecification = {
  id: 19581,
  make: 'fluffy',
  modelNumber: 'however interestingly viciously',
  serialNumber: 'knottily aspirate',
  productId: 24173,
};

export const sampleWithPartialData: ProductSpecification = {
  id: 19678,
  make: 'offensively',
  modelNumber: 'slew',
  serialNumber: 'per aha',
  barcodeMediaId: 'against times packaging',
  productId: 15224,
  lastModifiedBy: 'severe whose',
  createdDate: dayjs('2024-01-21T23:21'),
};

export const sampleWithFullData: ProductSpecification = {
  id: 23711,
  make: 'provided pish cornerstone',
  modelNumber: 'coolly into',
  serialNumber: 'scythe adored gah',
  barcodeMediaId: 'beatbox',
  productId: 471,
  lastModifiedBy: 'crushing speaking',
  lastModifiedDate: dayjs('2024-01-21T18:47'),
  createdBy: 'incidentally',
  createdDate: dayjs('2024-01-21T13:35'),
};

export const sampleWithNewData: NewProductSpecification = {
  make: 'boohoo indeed',
  modelNumber: 'by aside',
  serialNumber: 'because eek amid',
  productId: 11506,
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
