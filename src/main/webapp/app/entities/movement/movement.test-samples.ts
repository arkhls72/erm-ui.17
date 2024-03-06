import { Movement, NewMovement } from './movement.model';

export const sampleWithRequiredData: Movement = {
  id: 25981,
  name: 'notwithstanding shortage perky',
};

export const sampleWithPartialData: Movement = {
  id: 12465,
  name: 'gadzooks',
};

export const sampleWithFullData: Movement = {
  id: 15469,
  name: 'potty plummet querulous',
};

export const sampleWithNewData: NewMovement = {
  name: 'unless',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
