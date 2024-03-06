import { Muscle, NewMuscle } from './muscle.model';

export const sampleWithRequiredData: Muscle = {
  id: 32446,
  name: 'freak quicker',
};

export const sampleWithPartialData: Muscle = {
  id: 4592,
  name: 'waiter',
};

export const sampleWithFullData: Muscle = {
  id: 30930,
  name: 'baggy buff around',
};

export const sampleWithNewData: NewMuscle = {
  name: 'supposing nor nor',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
