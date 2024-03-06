import { FeeType, NewFeeType } from './fee-type.model';

export const sampleWithRequiredData: FeeType = {
  id: 29987,
  name: 'highly',
};

export const sampleWithPartialData: FeeType = {
  id: 2,
  name: 'though consequently',
};

export const sampleWithFullData: FeeType = {
  id: 19438,
  name: 'tangle qua',
};

export const sampleWithNewData: NewFeeType = {
  name: 'soup doubtfully gripping',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
