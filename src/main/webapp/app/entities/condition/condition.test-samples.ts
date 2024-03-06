import { Condition, NewCondition } from './condition.model';

export const sampleWithRequiredData: Condition = {
  id: 15091,
};

export const sampleWithPartialData: Condition = {
  id: 28738,
};

export const sampleWithFullData: Condition = {
  id: 19297,
  name: 'for bleakly',
};

export const sampleWithNewData: NewCondition = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
