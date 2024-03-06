import dayjs from 'dayjs/esm';

import { ExerGroupDetaill, NewExerGroupDetaill } from './exer-group-detaill.model';
import { Exercise } from '../exercise/exercise.model';

export const sampleWithRequiredData: ExerGroupDetaill = {
  id: 22012,
  exerGroupId: 29707,
  exercise: {} as Exercise,
};

export const sampleWithPartialData: ExerGroupDetaill = {
  id: 268,
  exerGroupId: 28146,
  exercise: {} as Exercise,
  lastModifiedBy: 'yang',
  createdDate: dayjs('2024-01-26T10:56'),
  createdBy: 'oof gah',
};

export const sampleWithFullData: ExerGroupDetaill = {
  id: 8799,
  exerGroupId: 31082,
  exercise: {} as Exercise,
  lastModifiedBy: 'eek interrupt',
  lastModifiedDate: dayjs('2024-01-26T22:57'),
  createdDate: dayjs('2024-01-26T23:07'),
  createdBy: 'infrastructure',
};

export const sampleWithNewData: NewExerGroupDetaill = {
  exerGroupId: 30429,
  exercise: {} as Exercise,
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
