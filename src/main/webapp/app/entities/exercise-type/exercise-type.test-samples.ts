import { ExerciseType, NewExerciseType } from './exercise-type.model';

export const sampleWithRequiredData: ExerciseType = {
  id: 16774,
  name: 'innervation',
};

export const sampleWithPartialData: ExerciseType = {
  id: 492,
  name: 'mosque',
};

export const sampleWithFullData: ExerciseType = {
  id: 16230,
  name: 'gosh',
};

export const sampleWithNewData: NewExerciseType = {
  name: 'the joshingly',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
