import dayjs from 'dayjs/esm';

import { Product, NewProduct } from './product.model';

export const sampleWithRequiredData: Product = {
  id: 7642,
  name: 'sneer',
  description: 'slim sometimes gah',
  suppierId: 28493,
  quantity: 20640,
  itemPrice: 9474.16,
};

export const sampleWithPartialData: Product = {
  id: 4314,
  name: 'past',
  description: 'who meh',
  suppierId: 6819,
  quantity: 1372,
  itemPrice: 19844.3,
  note: 'embargo surprisingly dawdle',
  createdDate: dayjs('2024-01-21T20:26'),
  lastModifiedDate: dayjs('2024-01-21T05:02'),
  emptyPrice: 3128.88,
};

export const sampleWithFullData: Product = {
  id: 15161,
  name: 'sideboard undulate doze',
  description: 'towards jabber',
  suppierId: 29142,
  quantity: 15196,
  itemPrice: 1934.1,
  note: 'ah',
  lastOrderDate: dayjs('2024-01-21T13:14'),
  createdBy: 'search swiftly oh',
  createdDate: dayjs('2024-01-21T15:29'),
  lastModifiedBy: 'constant instead hasten',
  lastModifiedDate: dayjs('2024-01-21T12:42'),
  emptyPrice: 1461.59,
};

export const sampleWithNewData: NewProduct = {
  name: 'and',
  description: 'since',
  suppierId: 5251,
  quantity: 894,
  itemPrice: 30138.78,
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
