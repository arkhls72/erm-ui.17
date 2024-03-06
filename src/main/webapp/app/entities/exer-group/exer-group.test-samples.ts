import dayjs from 'dayjs/esm';

import { ExerGroup, NewExerGroup } from './exer-group.model';

export const sampleWithRequiredData: ExerGroup = {
  id: 22702,
  name: 'gynaecology so',
};

export const sampleWithPartialData: ExerGroup = {
  id: 15759,
  name: 'sleepy practise among',
  lastModifiedBy: 'revisit salad dredge',
  createdBy: 'conceptualize',
};

export const sampleWithFullData: ExerGroup = {
  id: 22527,
  name: 'delightfully tightly repository',
  description: 'although versus',
  lastModifiedDate: dayjs('2024-01-26T08:23'),
  lastModifiedBy: 'who',
  createdDate: dayjs('2024-01-27T00:24'),
  createdBy: 'larder an as',
};

export const sampleWithNewData: NewExerGroup = {
  name: 'what whoever',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
