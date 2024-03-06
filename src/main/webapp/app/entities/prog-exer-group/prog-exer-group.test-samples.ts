import dayjs from 'dayjs/esm';

import { ProgExerGroup, NewProgExerGroup } from './prog-exer-group.model';

export const sampleWithRequiredData: ProgExerGroup = {
  id: 14079,
};

export const sampleWithPartialData: ProgExerGroup = {
  id: 3816,
  progId: 13183,
};

export const sampleWithFullData: ProgExerGroup = {
  id: 804,
  exerGroupId: 30560,
  progId: 10397,
  createdBy: 'outrank down carefree',
  createdDate: dayjs('2024-01-20T17:11'),
  lastModifiedBy: 'astride through',
  lastModifiedDate: dayjs('2024-01-20T06:27'),
};

export const sampleWithNewData: NewProgExerGroup = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
